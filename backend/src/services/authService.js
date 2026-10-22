import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Token from '../models/Token.js';
import config from '../config/env.js';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailService.js';

class AuthService {
  // Generate JWT access token
  generateAccessToken(userId) {
    return jwt.sign({ userId }, config.jwt.accessSecret, {
      expiresIn: config.jwt.accessExpiry,
    });
  }

  // Generate JWT refresh token and store in DB
  async generateRefreshToken(userId) {
    const token = crypto.randomBytes(40).toString('hex');

    // Remove old refresh tokens for this user (max 5 sessions)
    const existingTokens = await Token.find({ user: userId }).sort({ createdAt: 1 });
    if (existingTokens.length >= 5) {
      await Token.findByIdAndDelete(existingTokens[0]._id);
    }

    await Token.create({
      user: userId,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return token;
  }

  // Register new user
  async register({ name, email, password, role, phone }) {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const error = new Error('An account with this email already exists');
      error.statusCode = 400;
      throw error;
    }

    // Create email verification OTP
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      phone,
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: verificationExpiry,
    });

    // Send verification email (don't block on failure)
    sendVerificationEmail(user.email, user.name, verificationToken).catch((err) => {
      console.error('Failed to send verification email:', err.message);
    });

    return {
      user: user.toJSON(),
    };
  }

  // Login user
  async login({ email, password }) {
    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    if (user.isSuspended) {
      const error = new Error('Your account has been suspended. Contact support.');
      error.statusCode = 403;
      throw error;
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = await this.generateRefreshToken(user._id);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      const error = new Error('Refresh token is required');
      error.statusCode = 400;
      throw error;
    }

    // Find the refresh token in DB
    const tokenDoc = await Token.findOne({ token: refreshToken });

    if (!tokenDoc) {
      const error = new Error('Invalid refresh token');
      error.statusCode = 401;
      throw error;
    }

    // Check if expired
    if (tokenDoc.expiresAt < new Date()) {
      await Token.findByIdAndDelete(tokenDoc._id);
      const error = new Error('Refresh token expired. Please login again.');
      error.statusCode = 401;
      throw error;
    }

    // Check user still exists and is not suspended
    const user = await User.findById(tokenDoc.user);
    if (!user) {
      await Token.findByIdAndDelete(tokenDoc._id);
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    if (user.isSuspended) {
      await Token.deleteMany({ user: user._id });
      const error = new Error('Account suspended');
      error.statusCode = 403;
      throw error;
    }

    // Generate new access token
    const accessToken = this.generateAccessToken(user._id);

    return { accessToken, user: user.toJSON() };
  }

  // Logout - remove refresh token
  async logout(refreshToken) {
    if (refreshToken) {
      await Token.findOneAndDelete({ token: refreshToken });
    }
  }

  // Verify email
  async verifyEmail(email, otp) {
    const user = await User.findOne({
      email: email.toLowerCase(),
      emailVerificationToken: otp,
      emailVerificationExpiry: { $gt: new Date() },
    }).select('+emailVerificationToken +emailVerificationExpiry');

    if (!user) {
      const error = new Error('Invalid or expired OTP');
      error.statusCode = 400;
      throw error;
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    // Generate tokens
    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = await this.generateRefreshToken(user._id);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 400;
      throw error;
    }

    if (newPassword.length < 6) {
      const error = new Error('New password must be at least 6 characters');
      error.statusCode = 400;
      throw error;
    }

    user.password = newPassword;
    await user.save();

    // Invalidate all refresh tokens to force re-login on other devices
    await Token.deleteMany({ user: userId });
  }

  // Request password reset link
  async forgotPassword(email) {
    if (!email) {
      const error = new Error('Email is required');
      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    // Timing and enumeration mitigation:
    // If user does not exist, return generic success response without error
    if (!user) {
      return {
        message: 'If an account with that email exists, a password reset link has been sent.',
      };
    }

    // Generate cryptographically secure random token (32 bytes = 64 hex characters)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token with SHA-256 before saving to database
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Token expires in 30 minutes
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();

    // Construct client reset URL
    const clientBaseUrl = Array.isArray(config.clientUrl)
      ? config.clientUrl[0]
      : (config.clientUrl || 'http://localhost:5173');
    const resetUrl = `${clientBaseUrl.replace(/\/+$/, '')}/reset-password/${resetToken}`;

    // Send password reset email (non-blocking failure logging)
    sendPasswordResetEmail(user.email, user.name, resetUrl).catch((err) => {
      console.error('Failed to send password reset email:', err.message);
    });

    return {
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }

  // Reset password using token
  async resetPassword(token, newPassword) {
    if (!token) {
      const error = new Error('Reset token is required');
      error.statusCode = 400;
      throw error;
    }

    if (!newPassword || newPassword.length < 6) {
      const error = new Error('New password must be at least 6 characters');
      error.statusCode = 400;
      throw error;
    }

    // Hash incoming raw token to compare against hashed token in DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user by valid hashed token and non-expired time
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      const error = new Error('Password reset link is invalid or has expired');
      error.statusCode = 400;
      throw error;
    }

    // Set new password (pre-save hook will hash with bcrypt)
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Invalidate all active sessions/refresh tokens for this user
    await Token.deleteMany({ user: user._id });

    return {
      message: 'Password has been reset successfully. You can now log in with your new password.',
    };
  }
}

export default new AuthService();
