import React, { useState } from 'react';
import Modal from './Modal';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AddGoalModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/goals', { 
        name, 
        target_amount: parseFloat(target), 
        saved_amount: 0,
        target_url: targetUrl || null,
        image_url: null
      });
      setName('');
      setTarget('');
      setTargetUrl('');
      onSuccess();
      onClose();
      toast.success("Goal created successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Goal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-750 mb-1">Goal Name</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-finwise-green" placeholder="e.g. Dream Vacation" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-750 mb-1">Target Amount (₹)</label>
          <input type="number" required value={target} onChange={e => setTarget(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-finwise-green" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-750 mb-1">Goal Product/Vacation Link (Optional)</label>
          <input type="url" value={targetUrl} onChange={e => setTargetUrl(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-finwise-green" placeholder="https://example.com/item" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-finwise-green text-white py-2 rounded-lg font-medium hover:bg-finwise-medium transition-colors shadow-sm">
          {loading ? 'Creating...' : 'Create Goal'}
        </button>
      </form>
    </Modal>
  );
};
export default AddGoalModal;
