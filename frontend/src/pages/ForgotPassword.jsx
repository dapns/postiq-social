import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import '../styles/Auth.css';

const ForgotPassword = () => {
  const { forgotPassword, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    setError('');
    return true;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    try {
      await forgotPassword(email);
      setSubmitted(true);
      showSuccessToast('Reset link sent to your email. Check your inbox!');
    } catch (err) {
      const errorMessage = err.message || 'Failed to send reset email. Please try again.';
      showErrorToast(errorMessage);
    }
  };

  if (submitted) {
    return (
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1 className="auth-title">Check Your Email</h1>
              <p className="auth-subtitle">Password reset instructions sent</p>
            </div>

            <div className="success-message">
              <p>We've sent a password reset link to <strong>{email}</strong></p>
              <p>Click the link in the email to reset your password. If you don't see it, check your spam folder.</p>
            </div>

            <div className="auth-links" style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Button
                onClick={() => setSubmitted(false)}
                className="btn-secondary"
              >
                Send Another Email
              </Button>
            </div>

            <div className="auth-footer" style={{ marginTop: '2rem' }}>
              <p>
                Remember your password?{' '}
                <Link to="/login" className="auth-link signin-link">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-subtitle">Enter your email to reset your password</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`form-input ${error ? 'error' : ''}`}
                disabled={isLoading}
              />
              {error && <span className="form-error">{error}</span>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary auth-btn"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          {/* Links */}
          <div className="auth-footer">
            <p>
              <Link to="/login" className="auth-link signin-link">
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
};

export default ForgotPassword;
