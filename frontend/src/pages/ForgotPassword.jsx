import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, clearError } from '../store/authSlice';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    return () => dispatch(clearError());
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await dispatch(forgotPassword(email)).unwrap();
      setIsSubmitted(true);
      toast.success('Password reset link sent!');
    } catch (err) {
      // Error handled by redux slice and error toast effect
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 fade-in">
      <div className="w-full max-w-md">
        {isSubmitted ? (
          <div className="card-static p-8 rounded-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-orange-50 text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto text-3xl">
              <FiMail />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-[var(--color-secondary)]">Check Your Email</h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                If an account exists for <span className="font-semibold text-gray-900">{email}</span>, we&apos;ve sent a link to reset your password.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-amber-950">
                <FiCheckCircle className="text-amber-700" />
                <span>What to do next:</span>
              </div>
              <p>• Click the link in the email to set a new password.</p>
              <p>• The reset link will automatically expire in <strong>30 minutes</strong>.</p>
              <p>• If you don&apos;t see the email, check your spam or junk folder.</p>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="btn-secondary w-full py-2.5 text-sm"
                id="try-another-email-btn"
              >
                Try Another Email
              </button>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:underline"
                id="back-to-login-link"
              >
                <FiArrowLeft /> Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <span className="text-4xl mb-3 block">🔐</span>
              <h1 className="text-2xl font-extrabold text-[var(--color-secondary)]">Forgot Password?</h1>
              <p className="text-sm text-gray-500 mt-1">
                Enter your email and we&apos;ll send you instructions to reset your password.
              </p>
            </div>

            <div className="card-static p-8 rounded-2xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="forgot-email">
                    Registered Email Address
                  </label>
                  <input
                    id="forgot-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="input-field"
                    placeholder="you@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3"
                  id="forgot-submit-btn"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Instructions...
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              Remember your password?{' '}
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

export default ForgotPassword;
