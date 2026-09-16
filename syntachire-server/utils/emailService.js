const nodemailer = require('nodemailer');
require('dotenv').config();

const EMAIL_FROM = process.env.EMAIL_FROM || 'syntachire.ai@gmail.com';

function getTransporter() {
  const EMAIL_USER = (process.env.EMAIL_USER || 'syntachire.ai@gmail.com').trim();
  const EMAIL_PASS = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

/**
 * Send Email Confirmation OTP for Signup
 */
async function sendSignupOtpEmail(toEmail, userName, otpCode) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7ff; margin: 0; padding: 0; color: #0f172a; }
        .container { max-width: 560px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #004ac6, #4f46e5); padding: 32px 24px; text-align: center; color: #ffffff; }
        .logo-text { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 32px 28px; }
        .title { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
        .text { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
        .otp-box { background: #f8fafc; border: 2px dashed #004ac6; border-radius: 14px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #004ac6; font-family: monospace; }
        .otp-sub { font-size: 11px; color: #64748b; margin-top: 6px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-text">SyntacHire AI</div>
          <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">Career Velocity &amp; Placement Platform</div>
        </div>
        <div class="content">
          <div class="title">Confirm Your Email Address</div>
          <div class="text">
            Hi <strong>${userName || 'Candidate'}</strong>,<br/><br/>
            Welcome to <strong>SyntacHire AI</strong>! To complete your registration and activate your placement preparation workspace, please enter the 6-digit confirmation code below:
          </div>
          <div class="otp-box">
            <div class="otp-code">${otpCode}</div>
            <div class="otp-sub">Valid for 10 minutes. Do not share this code with anyone.</div>
          </div>
          <div class="text" style="font-size: 12px; color: #64748b;">
            If you did not sign up for an account on SyntacHire AI, you can safely ignore this email.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SyntacHire AI Platform (syntachire.ai@gmail.com). All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const mailOptions = {
      from: `"SyntacHire AI" <${EMAIL_FROM}>`,
      to: toEmail,
      subject: `SyntacHire AI — ${otpCode} is your signup verification code`,
      html: htmlContent,
    };

    const trans = getTransporter();
    const info = await trans.sendMail(mailOptions);
    console.log(`[Email Sent] Signup OTP sent to ${toEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.warn(`[Email Notice] Direct SMTP send failed (${err.message}). (OTP: ${otpCode})`);
    return { success: true, fallback: true, otp: otpCode };
  }
}

/**
 * Send Password Reset OTP Email
 */
async function sendPasswordResetEmail(toEmail, userName, otpCode) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7ff; margin: 0; padding: 0; color: #0f172a; }
        .container { max-width: 560px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #004ac6, #4f46e5); padding: 32px 24px; text-align: center; color: #ffffff; }
        .logo-text { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 32px 28px; }
        .title { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
        .text { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
        .otp-box { background: #f8fafc; border: 2px dashed #004ac6; border-radius: 14px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #004ac6; font-family: monospace; }
        .otp-sub { font-size: 11px; color: #64748b; margin-top: 6px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo-text">SyntacHire AI</div>
          <div style="font-size: 13px; opacity: 0.9; margin-top: 4px;">Security &amp; Account Recovery</div>
        </div>
        <div class="content">
          <div class="title">Reset Your Password</div>
          <div class="text">
            Hi <strong>${userName || 'User'}</strong>,<br/><br/>
            We received a request to reset your password for your <strong>SyntacHire AI</strong> account. Use the 6-digit verification code below to set a new password:
          </div>
          <div class="otp-box">
            <div class="otp-code">${otpCode}</div>
            <div class="otp-sub">This OTP is valid for 10 minutes. Do not share it with anyone.</div>
          </div>
          <div class="text" style="font-size: 12px; color: #64748b;">
            If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} SyntacHire AI Platform (syntachire.ai@gmail.com). All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const mailOptions = {
      from: `"SyntacHire AI" <${EMAIL_FROM}>`,
      to: toEmail,
      subject: `SyntacHire AI — ${otpCode} is your password reset code`,
      html: htmlContent,
    };

    const trans = getTransporter();
    const info = await trans.sendMail(mailOptions);
    console.log(`[Email Sent] Password reset OTP sent to ${toEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.warn(`[Email Notice] Direct SMTP send failed (${err.message}). (OTP: ${otpCode})`);
    return { success: true, fallback: true, otp: otpCode };
  }
}

module.exports = {
  sendSignupOtpEmail,
  sendPasswordResetEmail,
};
