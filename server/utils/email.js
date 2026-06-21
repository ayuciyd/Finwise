const nodemailer = require('nodemailer');
require('dotenv').config();

const smtpHost = process.env.SMTP_HOST || process.env.MAIL_SERVER;
const smtpPort = parseInt(process.env.SMTP_PORT || process.env.MAIL_PORT || '587', 10);
// Nodemailer secure is true for SSL (port 465). For port 587 or 2525, it uses STARTTLS (secure should be false).
const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

const emailUser = process.env.EMAIL_USER || process.env.MAIL_USERNAME;
const emailPass = process.env.EMAIL_PASS || process.env.MAIL_PASSWORD;
const defaultSender = process.env.MAIL_DEFAULT_SENDER || `"FinWise" <${emailUser}>`;

const transporterConfig = {
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: emailUser,
    pass: emailPass
  },
  family: 4, // Force IPv4 to prevent Render connection hangs
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
};

// Fall back to Gmail optimizations if no custom SMTP host is provided
if (!smtpHost) {
  transporterConfig.service = 'gmail';
  transporterConfig.port = 465;
  transporterConfig.secure = true;
  delete transporterConfig.host;
}

const transporter = nodemailer.createTransport(transporterConfig);

const sendEmail = async ({ to, subject, html }) => {
  if (!emailUser || emailUser === 'your_email@gmail.com') {
    console.log('\n=============================================');
    console.log(`[DEVELOPMENT MODE] Email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${html.replace(/<[^>]+>/g, '')}`);
    console.log('=============================================\n');
    return true;
  }

  try {
    const mailOptions = {
      from: defaultSender,
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
