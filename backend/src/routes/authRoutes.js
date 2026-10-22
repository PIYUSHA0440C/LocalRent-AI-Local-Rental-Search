import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from '../middleware/validate.js';

const router = Router();

// Strict rate limiter for password reset requests to protect against email spamming / brute-force
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 requests per 15 minutes per IP
  message: { message: 'Too many password reset attempts, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.get('/me', authenticate, getMe);
router.post('/forgot-password', passwordResetLimiter, validateForgotPassword, forgotPassword);
router.post('/reset-password/:token', passwordResetLimiter, validateResetPassword, resetPassword);
router.post('/reset-password', passwordResetLimiter, validateResetPassword, resetPassword);

export default router;
