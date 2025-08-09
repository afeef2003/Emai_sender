# 🤖 AI Email Generator & Sender

A full-stack web application that uses AI to generate professional emails and sends them to multiple recipients automatically. Built with React, Node.js, Express, and integrated with Groq AI for intelligent email generation.

![AI Email Sender Demo](https://img.shields.io/badge/Status-Active-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-14+-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

- **🤖 AI-Powered Email Generation**: Uses Groq AI to generate professional emails based on user prompts
- **📧 Real Email Sending**: Actually sends emails to multiple recipients using SMTP
- **✏️ Email Editing**: Edit generated emails (subject and body) before sending
- **👥 Multiple Recipients**: Send to multiple email addresses simultaneously
- **📱 Responsive Design**: Beautiful, modern UI that works on desktop and mobile
- **🎨 Professional Templates**: Clean HTML email templates with styling
- **⚡ Real-time Feedback**: Loading states and success/error messages
- **🛡️ Error Handling**: Graceful fallbacks when AI or email services are unavailable

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ installed
- Gmail account (or other SMTP email provider)
- Groq API key (free at https://console.groq.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-email-sender.git
   cd ai-email-sender
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   PORT=3001
   ```

4. **Set up Gmail App Password** (if using Gmail)
   - Enable 2-Factor Authentication on your Google account
   - Generate an App Password: https://myaccount.google.com/apppasswords
   - Use the 16-character app password in your `.env` file

5. **Start the application**
   ```bash
   npm start
   ```

6. **Open your browser**
   ```
   http://localhost:3001
   ```

## 🖥️ Screenshots

### Main Interface
The clean, modern interface makes it easy to generate and send AI-powered emails.

### Email Generation
AI generates professional emails based on your prompts - from meeting invitations to follow-ups.

### Email Editing
Edit the generated content before sending to ensure it matches your needs perfectly.

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **HTML5 & CSS3** - Responsive design with gradients and animations
- **JavaScript ES6+** - Modern JavaScript features

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web application framework
- **Nodemailer** - Email sending functionality
- **CORS** - Cross-origin resource sharing

### AI & APIs
- **Groq SDK** - AI email generation
- **Gmail SMTP** - Email delivery service

### Deployment
- **Railway** - Cloud hosting platform
- **Environment Variables** - Secure configuration management

## 📚 API Documentation

### Generate Email
```http
POST /api/generate-email
Content-Type: application/json

{
  "prompt": "Write a meeting invitation for tomorrow"
}
```

**Response:**
```json
{
  "subject": "Meeting Invitation",
  "body": "Generated email content..."
}
```

### Send Email
```http
POST /api/send-email
Content-Type: application/json

{
  "recipients": ["email1@example.com", "email2@example.com"],
  "subject": "Email subject",
  "body": "Email content",
  "senderName": "Your Name",
  "senderEmail": "your@email.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully sent 2 email(s)",
  "successful": 2,
  "failed": 0,
  "total": 2
}
```

## 🎯 Usage Examples

### Business Meeting Invitation
**Prompt:** "Write a team meeting invitation for next Thursday at 2 PM"

**Generated Email:**
```
Subject: Team Meeting Invitation

Dear Team,

I hope this email finds you well. I would like to schedule a team meeting to discuss our upcoming projects and goals.

Meeting Details:
- Date: Next Thursday
- Time: 2:00 PM - 3:00 PM
- Location: Conference Room A / Zoom

Please confirm your attendance by replying to this email.

Best regards,
[Your Name]
```

### Follow-up Email
**Prompt:** "Follow up on project discussion from last week"

**Generated Email:**
```
Subject: Following Up on Our Project Discussion

Hi there,

I hope you're doing well. I wanted to follow up on our previous conversation regarding the project we discussed last week.

As promised, I'm reaching out to provide you with the next steps and additional information we outlined.

Please let me know if you have any questions.

Best regards,
[Your Name]
```

## 🚀 Deployment

### Deploy to Railway (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Railway**
   - Go to https://railway.app/
   - Connect your GitHub repository
   - Add environment variables in Railway dashboard

3. **Set Environment Variables in Railway**
   ```
   GROQ_API_KEY=your_key
   EMAIL_USER=your@gmail.com
   EMAIL_PASS=your_app_password
   ```

### Deploy to Other Platforms

- **Heroku**: Add `Procfile` with `web: node server.js`
- **Render**: Set build command to `npm install` and start command to `npm start`
- **Vercel**: Add `vercel.json` configuration for serverless deployment

## 🔧 Configuration

### Email Providers

**Gmail (Recommended)**
```javascript
service: 'gmail',
auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // App Password
}
```

**Outlook/Hotmail**
```javascript
service: 'hotmail',
auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
}
```

**Custom SMTP**
```javascript
host: 'smtp.yourdomain.com',
port: 587,
secure: false,
auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
}
```

### AI Models

The application uses Groq's `mixtral-8x7b-32768` model by default. You can change this in `server.js`:

```javascript
model: 'llama2-70b-4096', // or other Groq models
temperature: 0.7,
max_tokens: 1000
```

## 🐛 Troubleshooting

### Common Issues

**Authentication Error (Gmail)**
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**Solution:** Make sure you're using an App Password, not your regular Gmail password.

**Backend Not Available**
```
Error: Failed to fetch from backend
```
**Solution:** Ensure the backend server is running on port 3001.

**CORS Error**
```
Error: Access to fetch blocked by CORS policy
```
**Solution:** Make sure CORS is properly configured in server.js.

**AI Generation Failed**
```
Error: Groq API error
```
**Solution:** Check your API key and ensure you have available credits.

### Debug Mode

Run the server with debug information:
```bash
DEBUG=* npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use ESLint for code linting
- Write clear commit messages
- Add comments for complex logic
- Test new features thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 AI Email Sender

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for providing the AI API
- [Nodemailer](https://nodemailer.com/) for email functionality
- [Railway](https://railway.app/) for hosting platform
- [React](https://reactjs.org/) for the frontend framework

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](https://github.com/yourusername/ai-email-sender/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🚀 What's Next?

### Planned Features
- **📅 Email Scheduling**: Schedule emails to be sent later
- **📊 Analytics Dashboard**: Track sent emails and open rates
- **🎨 Custom Templates**: Create and save custom email templates
- **👥 Contact Management**: Built-in contact list management
- **🔗 Email Chains**: Create automated email sequences
- **📱 Mobile App**: Native mobile applications

### Version Roadmap
- **v1.1**: Email scheduling and templates
- **v1.2**: Analytics and tracking
- **v2.0**: Mobile applications and advanced features

---

Made with ❤️ by [Syeda Shamama Afeef]

⭐ **Star this repository if you found it helpful!**