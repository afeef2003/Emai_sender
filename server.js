const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

// Email transporter setup (CORRECTED)
const createTransporter = () => {
    return nodemailer.createTransport({  // ← Fixed: createTransport (not createTransporter)
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'syedashamama459@gmail.com',
            pass: process.env.EMAIL_PASS || 'risi bqbs gqfx fsmz'
        }
    });
};

// Alternative: Use any SMTP service
const createCustomTransporter = () => {
    return nodemailer.createTransporter({
        host: 'smtp.gmail.com', // or your SMTP host
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Generate email using Groq AI
app.post('/api/generate-email', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Call Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are a professional email writer. Generate a well-structured, professional email based on the user's prompt. 
                    
                    Format your response as a JSON object with exactly these fields:
                    {
                        "subject": "Email subject line",
                        "body": "Complete email body with proper formatting, greeting, and signature placeholder"
                    }
                    
                    Make the email professional, clear, and appropriate for business communication. Include proper greeting, body paragraphs, and closing.`
                },
                {
                    role: 'user',
                    content: `Generate an email for: ${prompt}`
                }
            ],
            model: 'mixtral-8x7b-32768', // or llama2-70b-4096
            temperature: 0.7,
            max_tokens: 1000
        });

        const response = chatCompletion.choices[0]?.message?.content;
        
        try {
            // Try to parse as JSON
            const emailData = JSON.parse(response);
            res.json(emailData);
        } catch (parseError) {
            // Fallback: extract subject and body manually
            const lines = response.split('\n');
            const subject = lines.find(line => line.toLowerCase().includes('subject:'))?.replace(/subject:\s*/i, '') || 'Professional Communication';
            const body = response.replace(/subject:.*$/im, '').trim();
            
            res.json({
                subject: subject,
                body: body || response
            });
        }

    } catch (error) {
        console.error('Error generating email:', error);
        
        // Fallback to local generation if API fails
        const fallbackEmail = generateFallbackEmail(req.body.prompt);
        res.json(fallbackEmail);
    }
});

// Fallback email generation
function generateFallbackEmail(prompt) {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('meeting') || lowerPrompt.includes('schedule')) {
        return {
            subject: 'Meeting Invitation',
            body: `Dear Team,

I hope this email finds you well. I would like to schedule a meeting to discuss the matters outlined in our previous conversations.

Meeting Details:
- Date: [Please specify date]
- Time: [Please specify time]
- Location: [Please specify location/link]

Please confirm your attendance by replying to this email.

Best regards,
[Your Name]`
        };
    } else if (lowerPrompt.includes('follow') && lowerPrompt.includes('up')) {
        return {
            subject: 'Following Up on Our Previous Discussion',
            body: `Dear [Recipient],

I hope you're doing well. I wanted to follow up on our previous conversation regarding the topics we discussed.

As promised, I'm reaching out to provide you with the additional information and next steps we outlined.

Please let me know if you have any questions or if there's anything else you need from my side.

Best regards,
[Your Name]`
        };
    } else {
        return {
            subject: 'Professional Communication',
            body: `Dear [Recipient],

I hope this email finds you well.

${prompt}

Thank you for your time and consideration. I look forward to your response.

Best regards,
[Your Name]
[Your Position]
[Your Contact Information]`
        };
    }
}

// Send email endpoint
app.post('/api/send-email', async (req, res) => {
    try {
        const { recipients, subject, body, senderName, senderEmail } = req.body;
        
        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({ error: 'Recipients array is required' });
        }
        
        if (!subject || !body) {
            return res.status(400).json({ error: 'Subject and body are required' });
        }

        // Create transporter
        const transporter = createTransporter();
        
        // Verify transporter
        await transporter.verify();
        
        const fromEmail = senderEmail || process.env.EMAIL_USER;
        const fromName = senderName || 'AI Email Sender';
        
        // Send emails
        const emailPromises = recipients.map(async (recipient) => {
            const mailOptions = {
                from: `${fromName} <${fromEmail}>`,
                to: recipient,
                subject: subject,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 20px; text-align: center; color: white;">
                            <h2>📧 Email Generated by AI</h2>
                        </div>
                        <div style="padding: 30px; background: white; border-left: 4px solid #4facfe;">
                            ${body.split('\n').map(line => `<p>${line}</p>`).join('')}
                        </div>
                        <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666;">
                            This email was generated and sent using AI Email Sender
                        </div>
                    </div>
                `,
                text: body // Fallback plain text
            };
            
            return transporter.sendMail(mailOptions);
        });
        
        // Wait for all emails to be sent
        const results = await Promise.allSettled(emailPromises);
        
        // Check results
        const successful = results.filter(result => result.status === 'fulfilled').length;
        const failed = results.filter(result => result.status === 'rejected').length;
        
        if (failed > 0) {
            console.error('Some emails failed to send:', results.filter(r => r.status === 'rejected').map(r => r.reason));
        }
        
        res.json({
            success: true,
            message: `Successfully sent ${successful} email(s)${failed > 0 ? `, ${failed} failed` : ''}`,
            successful,
            failed,
            total: recipients.length
        });
        
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            error: 'Failed to send email', 
            details: error.message,
            help: 'Make sure your email credentials are set up correctly'
        });
    }
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'AI Email Sender Backend is running!',
        timestamp: new Date().toISOString(),
        endpoints: [
            'POST /api/generate-email',
            'POST /api/send-email',
            'GET /api/test'
        ]
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
    console.log(`🚀 AI Email Sender Backend running at http://localhost:${port}`);
    console.log(`📧 Make sure to set up your environment variables:`);
    console.log(`   - GROQ_API_KEY: Your Groq API key`);
    console.log(`   - EMAIL_USER: Your email address`);
    console.log(`   - EMAIL_PASS: Your email app password`);
});

module.exports = app;