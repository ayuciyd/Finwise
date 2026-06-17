import React, { useState, useEffect } from 'react';
import Modal from './Modal';

export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors text-gray-500"
          >
            {cancelText}
          </button>
          <button 
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const PromptDialog = ({ isOpen, onClose, onSubmit, title, placeholder, initialValue = '' }) => {
  const [val, setVal] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setVal(initialValue);
    }
  }, [isOpen, initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(val);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input 
            type="url" 
            required 
            value={val} 
            onChange={e => setVal(e.target.value)} 
            placeholder={placeholder}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-finwise-green text-sm"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-semibold transition-colors text-gray-500"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-finwise-green hover:bg-finwise-medium text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};
