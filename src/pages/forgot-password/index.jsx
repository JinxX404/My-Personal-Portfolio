import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from 'components/AppIcon';
import { supabase } from 'lib/supabase';
import { useToast } from 'context/ToastContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { success, error: showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });

      if (resetError) {
        setError(resetError.message);
        showError(resetError.message);
      } else {
        setIsSubmitted(true);
        success('Password reset link sent! Check your email.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      showError('Failed to send reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Helmet>
        <title>Forgot Password — Reset Your Account</title>
        <meta name="description" content="Reset your portfolio admin password." />
      </Helmet>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center text-secondary-600 hover:text-accent transition-colors mb-6">
            <Icon name="ArrowLeft" size={16} className="mr-1" />
            Back to Login
          </Link>
          <div className="w-16 h-16 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Key" size={32} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-primary-800 dark:text-primary-200">Forgot Password?</h1>
          <p className="text-secondary-600 mt-2">No worries, we'll send you reset instructions.</p>
        </div>

        {isSubmitted ? (
          <div className="bg-white dark:bg-surface rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Mail" size={32} className="text-success" />
            </div>
            <h2 className="text-xl font-bold text-primary-800 dark:text-primary-200 mb-2">Check Your Email</h2>
            <p className="text-secondary-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>. Click the link to reset your password.
            </p>
            <button
              onClick={() => { setIsSubmitted(false); setEmail(''); }}
              className="text-accent hover:text-accent-700 font-medium"
            >
              Didn't receive the email? Try again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-surface rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-background dark:border-primary-700 dark:text-primary-200 ${
                  error ? 'border-error-500' : 'border-primary-200'
                }`}
                placeholder="your@email.com"
                autoFocus
              />
              {error && (
                <p className="mt-1 text-sm text-error-500 flex items-center gap-1">
                  <Icon name="AlertCircle" size={14} />
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Icon name="Loader" size={16} className="animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Icon name="Send" size={16} />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
