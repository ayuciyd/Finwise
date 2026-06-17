import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wallet, Plus, Target, Trash2, Calendar, ExternalLink } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import AddGoalModal from '../components/AddGoalModal';
import AddMoneyModal from '../components/AddMoneyModal';
import { ConfirmDialog, PromptDialog } from '../components/CustomDialog';
import LoggedInNavbar from '../components/LoggedInNavbar';


const Goals = () => {
  const { user } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGoalModalOpen, setGoalModalOpen] = useState(false);
  const [moneyModalConfig, setMoneyModalConfig] = useState({ isOpen: false, type: '', current: 0, goalId: '', goalName: '' });

  // Dialog configurations
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, goalId: null });
  const [promptConfig, setPromptConfig] = useState({ isOpen: false, goalId: null, initialValue: '', title: '' });

  const fetchGoals = async () => {
    try {
      const { data } = await api.get('/goals');
      setGoals(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDeleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      toast.success("Goal deleted successfully");
      fetchGoals();
    } catch (err) {
      toast.error("Failed to delete goal");
    }
  };

  const handleUpdateGoalField = async (goalId, fields) => {
    try {
      await api.put(`/goals/${goalId}`, fields);
      toast.success("Goal updated successfully!");
      fetchGoals();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update goal");
    }
  };

  const handleAddGoalClick = () => setGoalModalOpen(true);
  
  const handleAddMoneyClick = (goal) => {
    setMoneyModalConfig({
      isOpen: true,
      type: 'goal',
      current: parseFloat(goal.saved_amount) || 0,
      goalId: goal.id,
      goalName: goal.name
    });
  };

  const getGoalDeadlineInputVal = (deadlineStr) => {
    if (!deadlineStr) return '';
    return deadlineStr.substring(0, 7);
  };

  return (
    <div className="min-h-screen bg-finwise-mint/30 font-poppins text-gray-800">
      <LoggedInNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-finwise-navy">Savings Goals Planner</h1>
            <p className="text-gray-500 text-xs mt-1">Plan your future purchases, track motivational targets, and calculate smart monthly savings.</p>
          </div>
          <button onClick={handleAddGoalClick} className="mt-4 md:mt-0 bg-finwise-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-finwise-medium transition-colors flex items-center gap-1.5 shadow-sm">
            <Plus size={16} /> Add New Goal
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-550 font-semibold">Loading goals...</div>
        ) : goals.length === 0 ? (
          <div className="max-w-xl mx-auto bg-white rounded-2xl p-10 text-center border border-finwise-green/10 shadow-[0_8px_30px_rgba(27,94,59,0.06)]">
            <Target size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-base font-bold text-finwise-navy mb-1.5">No Savings Goals Set Yet</h3>
            <p className="text-gray-500 text-xs mb-5">Create a goal to buy a gadget, go on vacation, or build a personal fund.</p>
            <button onClick={handleAddGoalClick} className="bg-finwise-green text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-finwise-medium transition-colors inline-flex items-center gap-1.5">
              <Plus size={16} /> Add Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {goals.map(goal => {
              const target = parseFloat(goal.target_amount) || 0;
              const saved = parseFloat(goal.saved_amount) || 0;
              const percentage = target > 0 ? (saved / target) * 100 : 0;
              
              // Project calculator logic for this goal card
              const deadlineStr = goal.deadline;
              const targetDate = deadlineStr ? new Date(deadlineStr) : null;
              const today = new Date();

              let months = 0;
              let monthlySaving = 0;
              let isPast = false;

              if (targetDate) {
                const targetYear = targetDate.getFullYear();
                const targetMonth = targetDate.getMonth();
                const currentYear = today.getFullYear();
                const currentMonth = today.getMonth();
                
                months = (targetYear - currentYear) * 12 + (targetMonth - currentMonth);
                const remainingAmt = Math.max(target - saved, 0);

                if (months <= 0) {
                  isPast = true;
                  monthlySaving = remainingAmt;
                } else {
                  monthlySaving = remainingAmt / months;
                }
              }

              return (
                <div 
                  key={goal.id} 
                  className="bg-white rounded-2xl border border-finwise-green/10 shadow-[0_8px_30px_rgba(27,94,59,0.06)] hover:shadow-[0_12px_36px_rgba(27,94,59,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Card Title Header */}
                  <div className="bg-finwise-mint/45 p-4 border-b border-gray-100 flex items-center gap-2.5">
                    <div className="bg-finwise-amber/15 p-1.5 rounded-lg text-finwise-amber shrink-0 animate-pulse">
                      <Target size={20} />
                    </div>
                    <h3 className="text-base font-extrabold text-finwise-navy truncate flex-1">{goal.name}</h3>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    
                    {/* Goal Progress bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[11px] text-gray-500 font-semibold">Progress</span>
                        <span className="text-xs font-bold text-finwise-green">₹{saved.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">of ₹{target.toLocaleString()}</span></span>
                      </div>

                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div 
                          className="bg-finwise-green h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-[10px] font-semibold">
                        <span className="text-finwise-green">{Math.round(percentage)}% complete</span>
                        <span className="text-gray-450">₹{Math.max(target - saved, 0).toLocaleString()} left</span>
                      </div>
                    </div>

                    {/* URL Link Section */}
                    <div className="w-full">
                      <span className="text-[9px] text-gray-400 font-bold block mb-1 uppercase tracking-wider">Goal Reference Link</span>
                      {goal.target_url ? (
                        <div className="flex gap-2 items-center">
                          <a 
                            href={goal.target_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[11px] font-semibold text-finwise-green hover:text-finwise-navy hover:bg-finwise-mint flex items-center gap-1.5 bg-finwise-mint/30 border border-finwise-green/10 p-2 rounded-xl transition-all duration-300 flex-1 min-w-0"
                          >
                            <ExternalLink size={12} className="shrink-0" />
                            <span className="truncate block flex-1 text-left">{goal.target_url}</span>
                          </a>
                          <button 
                            onClick={() => setPromptConfig({ isOpen: true, goalId: goal.id, initialValue: goal.target_url, title: 'Edit Reference Link' })}
                            className="px-2.5 py-1.5 text-[10px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors shrink-0 cursor-pointer"
                            title="Edit URL"
                          >
                            Edit
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPromptConfig({ isOpen: true, goalId: goal.id, initialValue: '', title: 'Add Reference Link' })}
                          className="w-full text-[10px] font-bold text-gray-500 hover:text-finwise-green hover:bg-finwise-mint/30 border border-dashed border-gray-300 p-2 rounded-xl flex items-center justify-center gap-1 transition-all duration-300 cursor-pointer"
                        >
                          <Plus size={12} /> Add Product/Vacation Link
                        </button>
                      )}
                    </div>

                    {/* Inline Savings Planner */}
                    <div className="pt-3 border-t border-gray-100 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-finwise-navy font-bold text-[10px] uppercase tracking-wider">
                        <Calendar size={12} className="text-finwise-green" />
                        <span>Goal Savings Planner</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-[10px] text-gray-500 font-semibold shrink-0">Target Month:</label>
                        <input 
                          type="month" 
                          value={getGoalDeadlineInputVal(goal.deadline)}
                          onChange={(e) => handleUpdateGoalField(goal.id, { deadline: e.target.value ? `${e.target.value}-02` : null })}
                          min={new Date().toISOString().substring(0, 7)}
                          className="flex-1 px-2 py-0.5 border border-gray-200 rounded-lg focus:outline-none focus:border-finwise-green text-[10px] cursor-pointer"
                        />
                      </div>

                      {targetDate && (
                        <div className="bg-finwise-mint/30 p-2.5 rounded-xl border border-finwise-green/10 space-y-1 animate-fadeIn">
                          {isPast ? (
                            <p className="text-[9px] text-red-600 font-medium">Please select a future month to calculate projections.</p>
                          ) : (
                            <div className="space-y-0.5">
                              <div className="flex justify-between text-[10px]">
                                <span className="text-gray-500 font-medium">Months remaining:</span>
                                <span className="font-bold text-finwise-navy">{months} {months === 1 ? 'month' : 'months'}</span>
                              </div>
                              <div className="flex justify-between text-[10px]">
                                <span className="text-gray-500 font-medium">Remaining to save:</span>
                                <span className="font-bold text-finwise-navy">₹{Math.max(target - saved, 0).toLocaleString()}</span>
                              </div>
                              <div className="border-t border-finwise-green/10 pt-1 flex justify-between items-baseline mt-1">
                                <span className="text-[10px] font-bold text-finwise-green">Monthly Contribution:</span>
                                <span className="text-xs font-extrabold text-finwise-green">₹{Math.round(monthlySaving).toLocaleString()}<span className="text-[9px] font-normal text-gray-500">/mo</span></span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button 
                        onClick={() => handleAddMoneyClick(goal)}
                        className="flex-1 text-xs font-bold text-finwise-green bg-finwise-mint hover:bg-finwise-green hover:text-white rounded-lg py-1.5 transition-all duration-300 shadow-sm border border-finwise-green/10 cursor-pointer text-center"
                      >
                        Add Money
                      </button>
                      <button 
                        onClick={() => setConfirmConfig({ isOpen: true, goalId: goal.id })}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100 cursor-pointer"
                        title="Delete goal"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      <AddGoalModal isOpen={isGoalModalOpen} onClose={() => setGoalModalOpen(false)} onSuccess={fetchGoals} />
      
      <AddMoneyModal 
        isOpen={moneyModalConfig.isOpen} 
        onClose={() => setMoneyModalConfig({ ...moneyModalConfig, isOpen: false })} 
        onSuccess={fetchGoals} 
        savingsType={moneyModalConfig.type} 
        currentAmount={moneyModalConfig.current} 
        goalId={moneyModalConfig.goalId}
        goalName={moneyModalConfig.goalName}
      />

      <ConfirmDialog 
        isOpen={confirmConfig.isOpen} 
        onClose={() => setConfirmConfig({ isOpen: false, goalId: null })} 
        onConfirm={() => handleDeleteGoal(confirmConfig.goalId)}
        title="Delete Savings Goal"
        message="Are you sure you want to delete this savings goal? This cannot be undone."
      />

      <PromptDialog 
        isOpen={promptConfig.isOpen} 
        onClose={() => setPromptConfig({ isOpen: false, goalId: null, initialValue: '', title: '' })}
        onSubmit={(val) => handleUpdateGoalField(promptConfig.goalId, { target_url: val || null })}
        title={promptConfig.title}
        placeholder="https://example.com/product"
        initialValue={promptConfig.initialValue}
      />
    </div>
  );
};

export default Goals;
