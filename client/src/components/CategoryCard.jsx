import React from 'react';
import { Plus } from 'lucide-react';

const CategoryCard = ({ category, onAddExpense }) => {
  const spent = parseFloat(category.spent) || 0;
  const allocated = parseFloat(category.allocated_amount) || 0;
  const left = allocated - spent;
  const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;
  
  const progressColor = category.color || '#1B5E3B';

  return (
    <div className="bg-white p-3 rounded-xl border border-finwise-green/10 shadow-[0_4px_12px_rgba(27,94,59,0.04)] hover:shadow-[0_6px_18px_rgba(27,94,59,0.08)] transition-all duration-300">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: category.color || '#1B5E3B' }}></div>
          <h4 className="text-sm font-bold text-finwise-navy">{category.name}</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">₹{spent} / ₹{allocated}</span>
          {onAddExpense && (
            <button 
              onClick={() => onAddExpense(category.id)}
              className="p-1 text-finwise-green hover:bg-finwise-mint rounded-lg transition-colors border border-finwise-green/10 hover:border-finwise-green/20"
              title={`Add ${category.name} expense`}
            >
              <Plus size={12} />
            </button>
          )}
        </div>
      </div>
      
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1.5">
        <div className="h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: progressColor }}></div>
      </div>
      
      <div className="flex justify-between text-[10px] font-semibold text-gray-500">
        <span className={percentage >= 100 ? 'text-finwise-red font-bold' : ''}>
          {percentage.toFixed(0)}% used
        </span>
        <span>
          ₹{left >= 0 ? left : 0} left
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;
