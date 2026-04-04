// src/pages/login/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from 'components/AppIcon';
import { useAuth } from 'context/AuthContext';
import { useToast } from 'context/ToastContext';
import { loginSchema, validate } from 'lib/validation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { signIn, isAuthenticated, isConfigured } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  const from = location.state?.from?.pathname || '/admin-dashboard';
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validate with Zod
    const validation = validate(loginSchema, { email, password });
    
    if (!validation.success) {
      setErrors(validation.errors);
      const firstError = Object.values(validation.errors)[0];
      toast.error(firstError);
      return;
    }

    setIsLoading(true);
    
    const result = await signIn(email, password);
    
    if (result.success) {
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } else {
      toast.error(result.error || 'Invalid credentials');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 pt-16 pb-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Icon name="Lock" size={32} className="text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-primary-800 mb-2">Admin Login</h1>
          <p className="text-secondary-600">Sign in to manage your portfolio</p>
        </div>

        {/* Not Configured Warning */}
        {!isConfigured && (
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={20} className="text-warning-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-warning-800 text-sm">Supabase Not Configured</h3>
                <p className="text-warning-700 text-xs mt-1">
                  Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Icon 
                  name="Mail" 
                  size={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" 
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  disabled={isLoading || !isConfigured}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Icon 
                  name="Lock" 
                  size={20} 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" 
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  disabled={isLoading || !isConfigured}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  tabIndex={-1}
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isConfigured}
              className="w-full bg-accent hover:bg-accent-700 disabled:bg-secondary-300 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader" size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Icon name="LogIn" size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <Link
              to="/forgot-password"
              className="text-sm text-accent hover:text-accent-700 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-secondary-600 hover:text-accent transition-colors inline-flex items-center gap-2"
          >
            <Icon name="ArrowLeft" size={16} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
