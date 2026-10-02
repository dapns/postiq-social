import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/components/common/AuthLayout';
import '../styles/Auth.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, isLoading } = useAuth();

  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (formData.newPassword.length > 200) {
      newErrors.newPassword = 'Password must be less than 200 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await resetPassword(formData.email.trim(), token, formData.newPassword);
      setSubmitted(true);
      showSuccessToast('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err.message || 'Failed to reset password. Please try again.';
      showErrorToast(errorMessage);
    }
  };

  if (submitted) {
    return (
        <AuthLayout>
          <div className="auth-card">
            <div className="auth-header">
              <h1 className="auth-title">Password Reset Complete</h1>
              <p className="auth-subtitle">Your password has been updated</p>
            </div>

            <div className="success-message">
              <p>Your password has been successfully reset. You can now sign in with your new password.</p>
            </div>

            <Button
              onClick={() => navigate('/login')}
              className="w-full btn-primary auth-btn"
            >
              Go to Sign In
            </Button>
          </div>
        </AuthLayout>
    );
  }

  if (!token) {
    return (
        <AuthLayout>
          <div className="auth-card">
            <div className="auth-header">
              <h1 className="auth-title">Invalid Reset Link</h1>
              <p className="auth-subtitle">The reset link is invalid or expired</p>
            </div>

            <Link to="/forgot-password" className="w-full">
              <Button className="w-full btn-primary auth-btn">
                Request New Reset Link
              </Button>
            </Link>

            <div className="auth-footer auth-footer--compact">
              <p>
                <Link to="/login" className="auth-link signin-link">
                  Back to sign in
                </Link>
              </p>
            </div>
          </div>
        </AuthLayout>
    );
  }

  return (
      <AuthLayout>
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">Enter your new password</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                disabled={isLoading}
                required
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* New Password Field */}
            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                New Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter a strong password (min 8 characters)"
                className={`form-input ${errors.newPassword ? 'error' : ''}`}
                disabled={isLoading}
              />
              {errors.newPassword && (
                <span className="form-error">{errors.newPassword}</span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <span className="form-error">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary auth-btn"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
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
      </AuthLayout>
  );
};

export default ResetPassword;
