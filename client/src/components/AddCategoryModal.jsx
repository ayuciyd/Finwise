import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AddCategoryModal = ({ isOpen, onClose, onSuccess, categoryToEdit }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || '');
      setAmount(categoryToEdit.allocated_amount || '');
    } else {
      setName('');
      setAmount('');
    }
  }, [categoryToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (categoryToEdit) {
        await api.put(`/categories/${categoryToEdit.id}`, { name, allocated_amount: parseFloat(amount) });
        toast.success("Category updated successfully!");
      } else {
        await api.post('/categories', { name, allocated_amount: parseFloat(amount), color: '#1B5E3B' });
        toast.success("Category added successfully!");
      }
      setName('');
      setAmount('');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={categoryToEdit ? "Edit Category" : "Add New Category"}>
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
          {loading ? 'Saving...' : (categoryToEdit ? 'Save Changes' : 'Add Category')}
        </button>
      </form>
    </Modal>
  );
};
export default AddCategoryModal;
