import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword, clearError } from '../store/authSlice';
import { FiEye, FiEyeOff, FiLock, FiCheckCircle, FiAlertCircle, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token: routeToken } = useParams();
  const [searchParams] = useSearchParams();
  const token = routeToken || searchParams.get('token');

  const { loading, error } = useSelector((s) => s.auth);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    return () => dispatch(clearError());
  }, [error, dispatch]);

  // Countdown timer redirect after successful reset
  useEffect(() => {
    let timer;
    if (isSuccess && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (isSuccess && countdown === 0) {
      navigate('/login');
    }
    return () => clearTimeout(timer);
  }, [isSuccess, countdown, navigate]);

  // Validation checks
  const isLengthValid = password.length >= 6;
  const isMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = isLengthValid && isMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Reset token is missing or invalid');
      return;
    }

    if (!isLengthValid) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!isMatch) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await dispatch(resetPassword({ token, password })).unwrap();
      setIsSuccess(true);
      toast.success('Password reset successfully!');
    } catch (err) {
      // Error handled by redux slice and toast
    }
  };

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 fade-in">
        <div className="w-full max-w-md card-static p-8 rounded-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl">
            <FiAlertCircle />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-[var(--color-secondary)]">Invalid Reset Link</h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              This password reset link is missing or invalid. Please request a new link to reset your password.
            </p>
          </div>
          <Link
            to="/forgot-password"
            className="btn-primary w-full py-3 inline-flex items-center justify-center gap-2"
            id="request-new-link-btn"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 fade-in">
      <div className="w-full max-w-md">
        {isSuccess ? (
          <div className="card-static p-8 rounded-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              <FiCheckCircle />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-[var(--color-secondary)]">Password Reset Complete</h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your password has been changed successfully. You can now use your new password to sign in.
              </p>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3.5 text-xs text-emerald-800">
              Redirecting to sign-in page in <strong>{countdown} seconds</strong>...
            </div>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="btn-primary w-full py-3 inline-flex items-center justify-center gap-2"
              id="go-to-login-btn"
            >
              Sign In Now <FiArrowRight />
            </button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <span className="text-4xl mb-3 block">🔒</span>
              <h1 className="text-2xl font-extrabold text-[var(--color-secondary)]">Create New Password</h1>
              <p className="text-sm text-gray-500 mt-1">
                Enter your new password below. Make sure it is secure.
              </p>
            </div>

            <div className="card-static p-8 rounded-2xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="reset-new-password">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="reset-new-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoFocus
                      className="input-field pr-10"
                      placeholder="At least 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      tabIndex="-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="reset-confirm-password">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="reset-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="input-field pr-10"
                      placeholder="Repeat your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      tabIndex="-1"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements Checklist */}
                <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 space-y-1.5 text-xs text-gray-600">
                  <div className={`flex items-center gap-1.5 ${isLengthValid ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                    <FiCheckCircle className={isLengthValid ? 'text-emerald-500' : 'text-gray-300'} />
                    <span>At least 6 characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 ${isMatch ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                    <FiCheckCircle className={isMatch ? 'text-emerald-500' : 'text-gray-300'} />
                    <span>Passwords match</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="btn-primary w-full py-3"
                  id="reset-submit-btn"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating Password...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Back to{' '}
              <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
