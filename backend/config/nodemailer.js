const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for port 465
  pool: true,
  maxConnections: 2,
  maxMessages: 20,
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
  auth: {
    user: process.env.SMTP_USER,   // Verified Gmail
    pass: process.env.SMTP_PASS   // App Password
  }
});
module.exports = transporter;