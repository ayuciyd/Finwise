import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wallet, Save, LogOut } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { ConfirmDialog } from '../components/CustomDialog';
import LoggedInNavbar from '../components/LoggedInNavbar';


const Settings = () => {
  const { user, logout, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    monthly_budget: ''
  });
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        monthly_budget: user.monthly_budget || ''
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/auth/profile', {
        name: formData.name,
        monthly_budget: parseFloat(formData.monthly_budget) || 0
      });
      login(data.user);
      toast.success('Settings saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save settings');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/auth/me');
      toast.success("Account deleted");
      window.location.href = '/login';
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="min-h-screen bg-finwise-mint/30 font-poppins">
      <LoggedInNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-finwise-navy mb-6">Account Settings</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Form (col-span-2) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-finwise-green/10 shadow-[0_8px_30px_rgba(27,94,59,0.06)] hover:shadow-[0_12px_36px_rgba(27,94,59,0.12)] hover:-translate-y-0.5 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-finwise-navy mb-4">Profile Information</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-650 mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-finwise-green outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-650 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      value={user?.email || ''} 
                      disabled
                      className="w-full px-3 py-1.5 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-650 mb-1.5">Monthly Budget (₹)</label>
                    <input 
                      type="number" 
                      name="monthly_budget" 
                      value={formData.monthly_budget} 
                      onChange={handleChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-finwise-green outline-none text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-2">
                  <button type="submit" className="bg-finwise-green text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-finwise-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-red-100 shadow-[0_8px_30px_rgba(163,45,45,0.04)] hover:shadow-[0_12px_36px_rgba(163,45,45,0.08)] hover:-translate-y-0.5 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-red-600 mb-1.5">Danger Zone</h2>
              <p className="text-xs text-gray-550 mb-4">These actions are permanent and cannot be undone.</p>
              
              <div className="flex flex-col gap-3">
                <button onClick={logout} className="w-full flex items-center justify-center gap-1.5 px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-55 hover:bg-red-50 transition-colors cursor-pointer">
                  <LogOut size={16} /> Sign Out
                </button>
                <button onClick={() => setConfirmOpen(true)} className="w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer shadow-sm">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ConfirmDialog 
        isOpen={isConfirmOpen} 
        onClose={() => setConfirmOpen(false)} 
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you absolutely sure you want to delete your account? This action cannot be undone and will erase all your financial data."
      />
    </div>
  );
};

export default Settings;
