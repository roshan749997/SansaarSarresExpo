import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const SignIn = () => {
  const [loginMode, setLoginMode] = useState('email'); // 'email' or 'mobile'
  const [step, setStep] = useState(1); // 1: Mobile input, 2: OTP input
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Resend OTP timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobile(value);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const resp = await api.signin({ email: formData.email, password: formData.password });
      
      // Clear any existing cookies from Google/OTP login since we're using localStorage token
      // This ensures email/password login uses Authorization header, not old cookies
      try {
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      } catch (e) {
        console.warn('Failed to clear cookies:', e);
      }
      
      // Store token then redirect to intended page or home
      if (resp?.token) {
        localStorage.setItem('auth_token', resp.token);
        console.log('[Email Login] Token stored in localStorage');
      }
      if (resp?.user?.isAdmin) {
        localStorage.setItem('auth_is_admin', 'true');
      } else {
        try { localStorage.removeItem('auth_is_admin'); } catch { }
      }
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileLoginClick = () => {
    setLoginMode('mobile');
    setStep(1);
    setError('');
    setSuccess('');
    setMobile('');
    setOtp('');
    setResendTimer(0);
  };

  const handleBackToEmail = () => {
    setLoginMode('email');
    setStep(1);
    setError('');
    setSuccess('');
    setMobile('');
    setOtp('');
    setResendTimer(0);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const data = await api.sendOtp(mobile);
      
      if (!data.success) {
        throw new Error(data?.message || 'Failed to send OTP');
      }
      
      setSuccess('OTP sent to your mobile number');
      setStep(2);
      setResendTimer(30);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const data = await api.verifyOtp({ mobile, otp });
      
      if (!data.success) {
        throw new Error(data?.message || 'Invalid OTP');
      }
      
      // Clear any existing cookies from Google login since OTP uses localStorage token
      try {
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      } catch (e) {
        console.warn('Failed to clear cookies:', e);
      }
      
      // Store token and redirect
      if (data?.token) {
        localStorage.setItem('auth_token', data.token);
        console.log('[OTP Login] Token stored in localStorage');
      }
      if (data?.user?.isAdmin) {
        localStorage.setItem('auth_is_admin', 'true');
      } else {
        try { localStorage.removeItem('auth_is_admin'); } catch { }
      }
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setError('');
    setLoading(true);
    try {
      const data = await api.sendOtp(mobile);
      
      if (!data.success) {
        throw new Error(data?.message || 'Failed to resend OTP');
      }
      
      setSuccess('OTP resent to your mobile number');
      setResendTimer(30);
      setOtp('');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeMobile = () => {
    setStep(1);
    setOtp('');
    setError('');
    setSuccess('');
    setResendTimer(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="flex h-screen">
        {/* Left Side - Logo */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-rose-100 via-pink-100 to-amber-100 items-center justify-center">
          <div className="text-center">
            <Link to="/" className="inline-block mb-8">
              <h1 className="text-5xl font-serif font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                SaariSanskar
              </h1>
            </Link>
            <p className="text-lg text-gray-600 max-w-sm mx-auto leading-relaxed">
              Discover the elegance of traditional Indian sarees. Your journey to timeless beauty starts here.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center py-8 px-4">
          <div className="w-full max-w-sm">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-6">
              <Link to="/" className="inline-block mb-6">
                <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                  SaariSanskar
                </h1>
              </Link>
            </div>

            {/* Form Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-serif font-semibold text-neutral-800 mb-1">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to your account to continue shopping
              </p>
            </div>

            {/* Sign In Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-neutral-100">
              {error && (<div className="mb-4 text-sm text-red-600">{error}</div>)}
              {success && (<div className="mb-4 text-sm text-green-600">{success}</div>)}
              
              {loginMode === 'email' ? (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-rose-500 focus:ring-rose-400 border-neutral-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(location.state?.from?.pathname || '/')}
                    className="w-full mt-2 border border-neutral-200 text-neutral-700 py-2 rounded-lg font-semibold hover:bg-neutral-50 transition-all duration-300"
                  >
                    Continue as Guest
                  </button>
                </form>
              ) : step === 1 ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors mb-2"
                  >
                    ← Back to email login
                  </button>
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-neutral-700 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={mobile}
                      onChange={handleMobileChange}
                      required
                      maxLength={10}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
                      placeholder="Enter your 10-digit mobile number"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || mobile.length !== 10}
                    className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(location.state?.from?.pathname || '/')}
                    className="w-full mt-2 border border-neutral-200 text-neutral-700 py-2 rounded-lg font-semibold hover:bg-neutral-50 transition-all duration-300"
                  >
                    Continue as Guest
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors mb-2"
                  >
                    ← Back to email login
                  </button>
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-neutral-700 mb-2">
                      Enter OTP
                    </label>
                    <div className="mb-2 text-center">
                      <p className="text-sm text-gray-600">
                        OTP sent to <span className="font-semibold text-neutral-800 text-base">{mobile}</span>
                      </p>
                    </div>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={otp}
                      onChange={handleOtpChange}
                      required
                      maxLength={6}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all text-center text-lg tracking-widest"
                      placeholder="000000"
                    />
                  </div>

                  <div className="text-center">
                    {resendTimer > 0 ? (
                      <p className="text-sm text-gray-600">
                        Resend OTP in {resendTimer} sec
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading}
                        className="text-sm text-rose-500 hover:text-rose-600 transition-colors disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleChangeMobile}
                    className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Change mobile number
                  </button>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(location.state?.from?.pathname || '/')}
                    className="w-full mt-2 border border-neutral-200 text-neutral-700 py-2 rounded-lg font-semibold hover:bg-neutral-50 transition-all duration-300"
                  >
                    Continue as Guest
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="mt-6 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
              </div>

              {/* Social Login */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    let SERVER_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
                    // Remove trailing slash if present
                    SERVER_BASE = SERVER_BASE.replace(/\/+$/, '');
                    window.location.href = `${SERVER_BASE}/api/auth/google`;
                  }}
                  className="flex items-center justify-center w-full px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </button>
                {loginMode === 'email' && (
                  <button
                    type="button"
                    onClick={handleMobileLoginClick}
                    className="flex items-center justify-center w-full px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Login with Mobile Number
                  </button>
                )}
              </div>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-rose-500 hover:text-rose-600 font-semibold transition-colors"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;