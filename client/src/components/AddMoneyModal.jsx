import React, { useState } from 'react';
import Modal from './Modal';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AddMoneyModal = ({ isOpen, onClose, onSuccess, savingsType, currentAmount, goalId, goalName }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const floatAmount = parseFloat(amount) || 0;
    const floatCurrent = parseFloat(currentAmount) || 0;
    try {
      if (savingsType === 'goal') {
        await api.put(`/goals/${goalId}`, { saved_amount: floatCurrent + floatAmount });
      } else {
        await api.put(`/savings/${savingsType}`, { current_amount: floatCurrent + floatAmount });
      }

      // Auto-create an expense transaction for savings to deduct from current monthly budget
      const note = savingsType === 'goal' 
        ? `Saved: ${goalName}` 
        : `Saved: ${savingsType === 'emergency' ? 'Emergency Fund' : 'Monthly Savings'}`;
      
      await api.post('/transactions', {
        amount: floatAmount,
        type: 'expense',
        note,
        category_id: null,
        date: new Date().toISOString().split('T')[0]
      });

      setAmount('');
      onSuccess();
      onClose();
      toast.success("Money added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add money");
    } finally {
      setLoading(false);
    }
  };

  const displayName = savingsType === 'goal' 
    ? goalName 
    : (savingsType === 'emergency' ? 'Emergency Fund' : 'Monthly Savings');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Money to ${displayName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Add (₹)</label>
          <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-finwise-green" placeholder="0" />
        </div>
        <p className="text-xs text-gray-500">Current Balance: ₹{currentAmount}</p>
        <button type="submit" disabled={loading} className="w-full bg-finwise-green text-white py-2 rounded-lg font-medium hover:bg-finwise-medium transition-colors shadow-sm">
          {loading ? 'Adding...' : 'Add Money'}
        </button>
      </form>
    </Modal>
  );
};
export default AddMoneyModal;
