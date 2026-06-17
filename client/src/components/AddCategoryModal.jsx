import React, { useState } from 'react';
import Modal from './Modal';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AddCategoryModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/categories', { name, allocated_amount: parseFloat(amount), color: '#1B5E3B' });
      setName('');
      setAmount('');
      onSuccess();
      onClose();
      toast.success("Category added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Category">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-finwise-green" placeholder="e.g. Groceries" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Allocated Budget (₹)</label>
          <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-finwise-green" placeholder="0" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-finwise-green text-white py-2 rounded-lg font-medium hover:bg-finwise-medium transition-colors">
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </form>
    </Modal>
  );
};
export default AddCategoryModal;
