import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2, ArrowRight, Lightbulb } from 'lucide-react';
import api from '../utils/api';

const Onboarding = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([
    { id: 1, name: 'Food', allocated_amount: 5000, color: '#1B5E3B' },
    { id: 2, name: 'Transport', allocated_amount: 2000, color: '#F5A623' },
    { id: 3, name: 'Shopping', allocated_amount: 3000, color: '#A32D2D' },
    { id: 4, name: 'Bills', allocated_amount: 4000, color: '#1B2A4A' },
    { id: 5, name: 'Entertainment', allocated_amount: 2000, color: '#2D7A52' },
    { id: 6, name: 'Others', allocated_amount: 1000, color: '#9CA3AF' }
  ]);
  
  const [newCatName, setNewCatName] = useState('');
  const [newCatAmount, setNewCatAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCategory = () => {
    if (!newCatName || !newCatAmount) return;
    const newCat = {
      id: Date.now(),
      name: newCatName,
      allocated_amount: parseFloat(newCatAmount),
      color: '#1B5E3B'
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
    setNewCatAmount('');
  };

  const handleRemoveCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      for (const cat of categories) {
        await api.post('/categories', { name: cat.name, allocated_amount: cat.allocated_amount, color: cat.color });
      }
      // Initialize savings defaults
      await api.get('/savings');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-finwise-mint font-poppins flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl md:text-5xl font-extrabold text-finwise-navy text-center mb-10">
          Hey {user?.name?.split(' ')[0] || 'there'}, ready to take control of your money?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-finwise-yellow/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-finwise-green"></div>
            <Lightbulb className="text-finwise-green mb-4" size={28} />
            <h3 className="font-bold text-finwise-navy mb-2">50/30/20 Rule</h3>
            <p className="text-sm text-gray-600">Allocate 50% to needs, 30% to wants, and 20% to savings. It’s a solid baseline for financial health.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-finwise-yellow/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-finwise-amber"></div>
            <Lightbulb className="text-finwise-amber mb-4" size={28} />
            <h3 className="font-bold text-finwise-navy mb-2">Emergency Fund</h3>
            <p className="text-sm text-gray-600">Aim to save 3-6 months of living expenses. It turns a crisis into a mere inconvenience.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-finwise-yellow/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-finwise-red"></div>
            <Lightbulb className="text-finwise-red mb-4" size={28} />
            <h3 className="font-bold text-finwise-navy mb-2">Avoid Impulse Buying</h3>
            <p className="text-sm text-gray-600">Wait 48 hours before making non-essential purchases. You'll be surprised how often the urge passes.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10 border border-gray-100">
          <h2 className="text-2xl font-bold text-finwise-navy mb-6">Let's set up your monthly categories</h2>
          <p className="text-gray-600 mb-8">We've added some common categories. Feel free to adjust them or add your own.</p>

          <div className="space-y-4 mb-8">
            {categories.map(cat => (
              <div key={cat.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-finwise-mint/50 p-4 rounded-xl border border-finwise-mint">
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="w-4 h-4 rounded-full mr-4" style={{ backgroundColor: cat.color }}></div>
                  <span className="font-medium text-finwise-navy">{cat.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-finwise-green">₹{cat.allocated_amount}</span>
                  <button onClick={() => handleRemoveCategory(cat.id)} className="text-gray-400 hover:text-finwise-red transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-10 bg-gray-50 p-4 rounded-xl">
            <input 
              type="text" 
              placeholder="Category name (e.g. Gym)" 
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-finwise-green"
            />
            <input 
              type="number" 
              placeholder="Amount (₹)" 
              value={newCatAmount}
              onChange={(e) => setNewCatAmount(e.target.value)}
              className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-finwise-green"
            />
            <button 
              onClick={handleAddCategory}
              className="bg-finwise-navy text-white px-6 py-2 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition-all"
            >
              <Plus size={20} className="mr-1" /> Add
            </button>
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-8">
            <button 
              onClick={handleComplete}
              disabled={loading}
              className="bg-finwise-green text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:bg-finwise-medium transition-all shadow-md transform hover:-translate-y-1"
            >
              {loading ? 'Saving...' : "Let's Go!"} <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
