import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, AlertCircle, ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  // flow: 'login', 'forgot-email', 'forgot-otp'
  const [flow, setFlow] = useState('login');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [forgotData, setForgotData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleForgotChange = (e) => {
    setForgotData({ ...forgotData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotEmail = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email: forgotData.email });
      setFlow('forgot-otp');
      setSuccess(`OTP sent to ${forgotData.email}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (forgotData.newPassword !== forgotData.confirmNewPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', {
        email: forgotData.email,
        otp_code: forgotData.otp,
        new_password: forgotData.newPassword
      });
      setSuccess(data.message);
      setFlow('login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-finwise-mint flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 text-finwise-green mb-6">
          <Wallet size={40} />
          <span className="text-3xl font-bold tracking-tight">FinWise</span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-finwise-navy">
          {flow === 'login' && 'Log in to your account'}
          {flow === 'forgot-email' && 'Reset Password'}
          {flow === 'forgot-otp' && 'Create New Password'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          
          {error && (
            <div className="mb-4 bg-red-50 border border-finwise-red/20 text-finwise-red px-4 py-3 rounded-md flex items-center gap-2 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-finwise-green/20 text-finwise-green px-4 py-3 rounded-md flex items-center gap-2 text-sm">
              <span>{success}</span>
            </div>
          )}

          {flow === 'login' && (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input name="email" type="email" required value={formData.email} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-finwise-green focus:border-finwise-green sm:text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                  <input name="password" type="password" required value={formData.password} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-finwise-green focus:border-finwise-green sm:text-sm" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="rememberMe" type="checkbox" checked={formData.rememberMe} onChange={handleChange} className="h-4 w-4 text-finwise-green focus:ring-finwise-green border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me (30 days)
                  </label>
                </div>

                <div className="text-sm">
                  <button type="button" onClick={() => { setFlow('forgot-email'); setError(''); setSuccess(''); }} className="font-medium text-finwise-green hover:text-finwise-medium">
                    Forgot your password?
                  </button>
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-finwise-green hover:bg-finwise-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-finwise-green disabled:opacity-50 transition-colors">
                  {loading ? 'Logging in...' : 'Sign in'}
                </button>
              </div>
            </form>
          )}

          {flow === 'forgot-email' && (
            <form className="space-y-6" onSubmit={handleForgotEmail}>
              <div className="text-sm text-gray-600">
                Enter your registered email address and we'll send you a 6-digit OTP to reset your password.
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input name="email" type="email" required value={forgotData.email} onChange={handleForgotChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-finwise-green focus:border-finwise-green sm:text-sm" />
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-finwise-green hover:bg-finwise-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-finwise-green disabled:opacity-50 transition-colors">
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
              <div className="text-center mt-4">
                <button type="button" onClick={() => setFlow('login')} className="inline-flex items-center text-sm font-medium text-finwise-navy hover:text-finwise-green">
                  <ArrowLeft size={16} className="mr-1" /> Back to login
                </button>
              </div>
            </form>
          )}

          {flow === 'forgot-otp' && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label className="block text-sm font-medium text-gray-700">6-Digit OTP</label>
                <div className="mt-1">
                  <input name="otp" type="text" maxLength="6" required value={forgotData.otp} onChange={(e) => setForgotData({ ...forgotData, otp: e.target.value.replace(/\D/g, '') })} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-finwise-green focus:border-finwise-green sm:text-sm text-center tracking-widest text-lg font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="mt-1">
                  <input name="newPassword" type="password" required minLength={6} value={forgotData.newPassword} onChange={handleForgotChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-finwise-green focus:border-finwise-green sm:text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <div className="mt-1">
                  <input name="confirmNewPassword" type="password" required minLength={6} value={forgotData.confirmNewPassword} onChange={handleForgotChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-finwise-green focus:border-finwise-green sm:text-sm" />
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading || forgotData.otp.length !== 6} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-finwise-green hover:bg-finwise-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-finwise-green disabled:opacity-50 transition-colors">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
              <div className="text-center mt-4">
                <button type="button" onClick={() => setFlow('login')} className="inline-flex items-center text-sm font-medium text-finwise-navy hover:text-finwise-green">
                  <ArrowLeft size={16} className="mr-1" /> Back to login
                </button>
              </div>
            </form>
          )}

          {flow === 'login' && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/signup" className="w-full flex justify-center py-2 px-4 border border-finwise-green rounded-md shadow-sm text-sm font-medium text-finwise-green bg-white hover:bg-finwise-mint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-finwise-green transition-colors">
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
