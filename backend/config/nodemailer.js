import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTP(email, otp) {
  try {
    const response = await resend.emails.send({
      from: `${process.env.MAIL_FROM_NAME || 'StockX'} <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: email,
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>OTP Verification</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="letter-spacing: 5px; color: #333; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #666;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
    return response;
  } catch (error) {
    console.error('Failed to send OTP:', error);
    throw error;
  }
}

// Send welcome email
async function sendWelcomeEmail(email, username) {
  try {
    const response = await resend.emails.send({
      from: `${process.env.MAIL_FROM_NAME || 'StockX'} <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: email,
      subject: 'Welcome to StockX',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to StockX, ${username}!</h2>
          <p>Your account has been successfully created.</p>
          <p>Start trading and managing your portfolio with us.</p>
        </div>
      `,
    });
    return response;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

export { resend, generateOTP, sendOTP, sendWelcomeEmail };