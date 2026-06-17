import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AddTransactionModal = ({ isOpen, onClose, onSuccess, categories, defaultCategoryId }) => {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (defaultCategoryId) {
        setCategoryId(defaultCategoryId);
        setType('expense');
      } else {
        setCategoryId('');
      }
    }
  }, [isOpen, defaultCategoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/transactions', { 
        type, 
        amount: parseFloat(amount), 
        note, 
        date, 
        category_id: type === 'expense' && categoryId ? categoryId : null 
      });
      setAmount('');
      setNote('');
      onSuccess();
      onClose();
      toast.success("Transaction saved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="type" value="expense" checked={type === 'expense'} onChange={() => setType('expense')} className="text-finwise-green" />
            <span className="text-sm font-medium">Expense</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="type" value="income" checked={type === 'income'} onChange={() => setType('income')} className="text-finwise-green" />
            <span className="text-sm font-medium">Income</span>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
          <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-finwise-green" placeholder="0" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Note / Description</label>
          <input type="text" required value={note} onChange={e => setNote(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-finwise-green" placeholder="e.g. Salary, Groceries" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-finwise-green" />
        </div>

        {type === 'expense' && categories && categories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-finwise-green">
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-finwise-green text-white py-2 rounded-lg font-medium hover:bg-finwise-medium transition-colors">
          {loading ? 'Saving...' : 'Save Transaction'}
        </button>
      </form>
    </Modal>
  );
};
export default AddTransactionModal;
