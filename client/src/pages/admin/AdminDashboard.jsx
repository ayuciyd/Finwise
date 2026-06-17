import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Users, Activity, Trash2, Wallet } from 'lucide-react';
import api from '../../utils/api';
import { ConfirmDialog } from '../../components/CustomDialog';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, userId: null });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 403) {
          navigate('/dashboard');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [navigate]);

  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      toast.success('User deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete user');
    }
  };

  if (loading) return <div className="min-h-screen bg-finwise-mint flex items-center justify-center font-bold text-finwise-navy text-xl font-poppins">Loading Admin Portal...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <nav className="bg-finwise-navy text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield size={28} className="text-finwise-yellow" />
              <span className="text-xl font-bold tracking-tight">FinWise Admin Portal</span>
            </div>
            <div className="flex items-center">
              <Link to="/dashboard" className="text-sm font-medium hover:text-finwise-yellow transition-colors flex items-center gap-2">
                <Wallet size={16} /> Exit to App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-finwise-navy mb-8">Platform Overview</h1>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={24} /></div>
                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 ml-16">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Activity size={24} /></div>
                <h3 className="text-sm font-medium text-gray-500">Total Transactions</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 ml-16">{stats.totalTransactions}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-finwise-yellow/20 text-finwise-amber rounded-lg"><Wallet size={24} /></div>
                <h3 className="text-sm font-medium text-gray-500">Money Tracked</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 ml-16">₹{stats.totalMoneyTracked.toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-finwise-navy">User Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 text-xs">
                          {u.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {u.name} {u.is_admin && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-finwise-yellow/20 text-finwise-navy">Admin</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{u.monthly_budget}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!u.is_admin && (
                        <button onClick={() => setConfirmConfig({ isOpen: true, userId: u.id })} className="text-red-600 hover:text-red-900 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <ConfirmDialog 
        isOpen={confirmConfig.isOpen} 
        onClose={() => setConfirmConfig({ isOpen: false, userId: null })} 
        onConfirm={() => handleDeleteUser(confirmConfig.userId)}
        title="Delete User"
        message="Are you sure you want to delete this user? This cannot be undone."
      />
    </div>
  );
};

export default AdminDashboard;
