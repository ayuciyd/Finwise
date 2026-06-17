import React from 'react';
import { Target } from 'lucide-react';

const GoalCard = ({ goal, onAddMoney }) => {
  const target = parseFloat(goal.target_amount) || 0;
  const saved = parseFloat(goal.saved_amount) || 0;
  const percentage = target > 0 ? (saved / target) * 100 : 0;
  
  return (
    <div className="bg-white p-3 rounded-xl border border-finwise-green/10 shadow-[0_4px_12px_rgba(27,94,59,0.04)] hover:shadow-[0_6px_18px_rgba(27,94,59,0.08)] transition-all duration-300 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {goal.image_url ? (
            <img 
              src={goal.image_url} 
              alt={goal.name} 
              className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0 shadow-sm"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="bg-finwise-amber/10 p-2 rounded-lg text-finwise-amber shrink-0">
              <Target size={14} />
            </div>
          )}
          <div className="min-w-0">
            {goal.target_url ? (
              <a 
                href={goal.target_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-bold text-finwise-navy hover:text-finwise-green hover:underline truncate block"
                title="View product/vacation link"
              >
                {goal.name}
              </a>
            ) : (
              <h4 className="text-sm font-bold text-finwise-navy truncate block" title={goal.name}>{goal.name}</h4>
            )}
            <span className="text-[10px] font-semibold text-gray-500">₹{saved} of ₹{target}</span>
          </div>
        </div>
        <button 
          onClick={onAddMoney}
          className="text-xs font-bold text-finwise-green bg-finwise-mint hover:bg-finwise-green hover:text-white rounded-lg px-2.5 py-1.5 transition-all duration-300 shadow-sm border border-finwise-green/10 shrink-0"
        >
          Add Money
        </button>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-0.5">
        <div className="bg-finwise-green h-1.5 rounded-full" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
      </div>
      
      <div className="flex justify-between text-[9px] font-bold text-gray-400">
        <span>{Math.round(percentage)}% complete</span>
        {goal.target_url && (
          <a href={goal.target_url} target="_blank" rel="noopener noreferrer" className="text-finwise-green hover:underline flex items-center gap-0.5">
            Link ↗
          </a>
        )}
      </div>
    </div>
  );
};

export default GoalCard;
