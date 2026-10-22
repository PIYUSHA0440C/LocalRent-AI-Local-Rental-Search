import { Resend } from 'resend';
import config from '../config/env.js';

let resend = null;

if (config.resend.apiKey) {
  resend = new Resend(config.resend.apiKey);
  console.log('Resend email service initialized');
} else {
  console.warn('Resend API key not found. Email sending will be disabled.');
}

// Send verification email
export const sendVerificationEmail = async (email, name, otp) => {
  if (!resend) {
    console.log(`[DEV] OTP for ${email}: ${otp}`);
    return;
  }

  await resend.emails.send({
    from: config.resend.emailFrom,
    to: email,
    subject: 'Verify your LocalRent account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Welcome to LocalRent!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering. Please use the following 6-digit OTP to verify your email address. It will expire in 10 minutes:</p>
        <div style="margin: 30px 0; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4f46e5; text-align: center;">
          ${otp}
        </div>
        <p>If you did not create an account, no further action is required.</p>
        <p>Best regards,<br>The LocalRent Team</p>
      </div>
    `,
  });
};

// Send booking notification email
export const sendBookingEmail = async (email, name, subject, message) => {
  if (!resend) {
    console.log(`[DEV] Email to ${email}: ${subject} - ${message}`);
    return;
  }

  await resend.emails.send({
    from: config.resend.emailFrom,
    to: email,
    subject: `LocalRent - ${subject}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #E67E22; margin: 0;">LocalRent</h1>
        </div>
        <h2 style="color: #333;">Hi ${name},</h2>
        <p style="color: #555; line-height: 1.6;">${message}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${config.clientUrl}/dashboard" 
             style="background: #E67E22; color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="color: #aaa; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} LocalRent
        </p>
      </div>
    `,
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, name, resetUrl) => {
  if (!resend) {
    console.log(`[DEV] Password reset link for ${email}: ${resetUrl}`);
    return;
  }

  await resend.emails.send({
    from: config.resend.emailFrom,
    to: email,
    subject: 'Reset your LocalRent password',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #FAFAF8; border-radius: 12px; border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #E67E22; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">LocalRent</h1>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Brokerage-free room discovery</p>
        </div>
        <div style="background-color: #ffffff; padding: 32px; border-radius: 10px; border: 1px solid #edf2f7; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <h2 style="color: #2C3E50; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Password Reset Request</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
            Hi ${name || 'there'},
          </p>
          <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            We received a request to reset the password for your LocalRent account. Click the button below to choose a new password:
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #E67E22, #D35400); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(230, 126, 34, 0.35);">
              Reset Password
            </a>
          </div>
          <div style="background-color: #FFF7ED; border-left: 4px solid #E67E22; padding: 12px 16px; border-radius: 4px; margin: 24px 0;">
            <p style="color: #9A3412; font-size: 13px; line-height: 1.5; margin: 0;">
              <strong>Note:</strong> This link will expire in <strong>30 minutes</strong>. For security, this link can only be used once.
            </p>
          </div>
          <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-top: 24px;">
            If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
          </p>
          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; word-break: break-all; margin: 0;">
            If the button doesn't work, copy and paste this URL into your browser:<br />
            <a href="${resetUrl}" style="color: #E67E22; text-decoration: underline;">${resetUrl}</a>
          </p>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px; margin-bottom: 0;">
          © ${new Date().getFullYear()} LocalRent. All rights reserved.
        </p>
      </div>
    `,
  });
};
