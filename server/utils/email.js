const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  family: 4, // Force IPv4
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000
});

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
