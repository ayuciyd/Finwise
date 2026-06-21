const nodemailer = require('nodemailer');
require('dotenv').config();

const transporterConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  family: 4, // Force IPv4 to prevent Render connection hangs
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
};

// Fall back to Gmail optimizations if no custom SMTP host is provided
if (!process.env.SMTP_HOST) {
  transporterConfig.service = 'gmail';
  transporterConfig.port = 465;
  transporterConfig.secure = true;
  delete transporterConfig.host;
}

const transporter = nodemailer.createTransport(transporterConfig);

const sendEmail = async ({ to, subject, html }) => {
  if (process.env.EMAIL_USER === 'your_email@gmail.com') {
    console.log('\n=============================================');
    console.log(`[DEVELOPMENT MODE] Email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${html.replace(/<[^>]+>/g, '')}`);
    console.log('=============================================\n');
    return true;
  }

  try {
    const mailOptions = {
      from: `"FinWise" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendEmail };
