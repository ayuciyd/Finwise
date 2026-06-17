import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, AlertCircle } from 'lucide-react';
import api from '../utils/api';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    monthly_budget: ''
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        monthly_budget: formData.monthly_budget ? parseFloat(formData.monthly_budget) : 0
      });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', {
        email: formData.email,
        otp_code: otp
      });
      
      await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
        rememberMe: true
      });

      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired OTP');
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
          {step === 1 ? 'Create your account' : 'Verify your email'}
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

          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleSignup}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1">
                  <input name="name" type="text" required value={formData.name} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-finwise-green focus:border-finwise-green sm:text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input name="email" type="email" required value={formData.email} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-finwise-green focus:border-finwise-green sm:text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Budget (₹)</label>
                <div className="mt-1">
                  <input name="monthly_budget" type="number" required min="0" value={formData.monthly_budget} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-finwise-green focus:border-finwise-green sm:text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1">
                  <input name="password" type="password" required minLength={6} value={formData.password} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-finwise-green focus:border-finwise-green sm:text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="mt-1">
                  <input name="confirmPassword" type="password" required minLength={6} value={formData.confirmPassword} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-finwise-green focus:border-finwise-green sm:text-sm" />
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-finwise-green hover:bg-finwise-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-finwise-green disabled:opacity-50 transition-colors">
                  {loading ? 'Creating account...' : 'Sign Up'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div className="text-center text-sm text-gray-600 mb-4">
                We've sent a 6-digit code to <span className="font-semibold text-finwise-navy">{formData.email}</span>. It expires in 10 minutes.
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">6-Digit OTP</label>
                <div className="mt-1">
                  <input name="otp" type="text" maxLength="6" required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-finwise-green focus:border-finwise-green sm:text-sm text-center tracking-widest text-lg font-bold" />
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading || otp.length !== 6} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-finwise-green hover:bg-finwise-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-finwise-green disabled:opacity-50 transition-colors">
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/login" className="w-full flex justify-center py-2 px-4 border border-finwise-green rounded-md shadow-sm text-sm font-medium text-finwise-green bg-white hover:bg-finwise-mint focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-finwise-green transition-colors">
                  Log in
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
