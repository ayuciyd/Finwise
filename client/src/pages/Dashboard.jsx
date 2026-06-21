import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wallet, Bell, ChevronDown, Plus, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import api from '../utils/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

import CategoryCard from '../components/CategoryCard';
import GoalCard from '../components/GoalCard';
import AIInsights from '../components/AIInsights';
import SummaryModal from '../components/SummaryModal';
import Modal from '../components/Modal';
import LoggedInNavbar from '../components/LoggedInNavbar';



import AddCategoryModal from '../components/AddCategoryModal';
import AddGoalModal from '../components/AddGoalModal';
import AddMoneyModal from '../components/AddMoneyModal';
import AddTransactionModal from '../components/AddTransactionModal';

const CHART_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#14B8A6', // Teal
  '#F97316'  // Orange
];

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  
  const [data, setData] = useState({
    categories: [],
    transactions: [],
    goals: [],
    savings: []
  });
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7)); // "YYYY-MM"
  const [defaultCategoryForTx, setDefaultCategoryForTx] = useState(null);

  // Modal states
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [isGoalModalOpen, setGoalModalOpen] = useState(false);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const [isLeftoverModalOpen, setLeftoverModalOpen] = useState(false);
  const [hasShownLeftoverModal, setHasShownLeftoverModal] = useState(false);
  const [moneyModalConfig, setMoneyModalConfig] = useState({ isOpen: false, type: '', current: 0, goalId: '', goalName: '' });

  const fetchData = async () => {
    try {
      const [catRes, txRes, goalRes, savRes] = await Promise.all([
        api.get('/categories'),
        api.get('/transactions'),
        api.get('/goals'),
        api.get('/savings')
      ]);
      
      const categoriesWithColors = catRes.data.map((cat, index) => {
        const color = CHART_COLORS[index % CHART_COLORS.length];
        return { ...cat, color };
      });

      setData({
        categories: categoriesWithColors,
        transactions: txRes.data,
        goals: goalRes.data,
        savings: savRes.data
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setData(prev => ({ ...prev, loading: false })); // keep dynamic calculation safe
      setLoading(false);
    }
  };

  const getPreviousMonthStr = (monthStr) => {
    const [year, month] = monthStr.split('-').map(Number);
    const prevDate = new Date(year, month - 2, 2);
    return prevDate.toISOString().substring(0, 7);
  };

  const getPrevMonthLeftover = () => {
    if (loading || data.transactions.length === 0) {
      return { leftover: 0, prevMonthStr: '' };
    }
    const prevMonthStr = getPreviousMonthStr(selectedMonth);
    const prevTransactions = data.transactions.filter(t => t.date && t.date.substring(0, 7) === prevMonthStr);
    
    if (prevTransactions.length === 0) {
      return {
        leftover: 0,
        prevMonthStr
      };
    }

    const prevIncome = prevTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const prevBudget = parseFloat(user?.monthly_budget || 0) + prevIncome;
    const prevSpent = prevTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const leftover = prevBudget - prevSpent;
    return { leftover: leftover > 0 ? leftover : 0, prevMonthStr };
  };

  const { leftover: prevLeftover, prevMonthStr } = getPrevMonthLeftover();

  useEffect(() => {
    fetchData();
  }, []);

  // Reset leftover popup state when user changes the active month
  useEffect(() => {
    setHasShownLeftoverModal(false);
  }, [selectedMonth]);

  // Open leftover savings transfer popup automatically if leftovers are detected
  useEffect(() => {
    if (!loading && prevLeftover > 0 && !hasShownLeftoverModal) {
      setLeftoverModalOpen(true);
      setHasShownLeftoverModal(true);
    }
  }, [loading, prevLeftover, hasShownLeftoverModal]);

  const handleAddCategory = () => setCategoryModalOpen(true);
  const handleAddGoal = () => setGoalModalOpen(true);
  const handleAddMoney = (type, currentAmount, goalId = '', goalName = '') => 
    setMoneyModalConfig({ isOpen: true, type, current: currentAmount, goalId, goalName });
  const handleAddTransaction = (catId = null) => {
    setDefaultCategoryForTx(catId);
    setTransactionModalOpen(true);
  };

  const handleTransferLeftover = async (type, amount, prevMonth) => {
    try {
      const targetSaving = data.savings.find(s => s.type === type) || { current_amount: 0 };
      const currentBal = parseFloat(targetSaving.current_amount) || 0;
      await api.put(`/savings/${type}`, { current_amount: currentBal + amount });

      const monthName = new Date(prevMonth + "-02").toLocaleString('default', { month: 'long' });
      await api.post('/transactions', {
        amount,
        type: 'expense',
        note: `Auto-Transfer: Leftover ${monthName} budget to ${type === 'emergency' ? 'Emergency Fund' : 'Monthly Savings'}`,
        category_id: null,
        date: `${prevMonth}-28`
      });

      toast.success(`₹${amount.toLocaleString()} transferred to ${type === 'emergency' ? 'Emergency Fund' : 'Monthly Savings'}!`);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to transfer leftover budget");
    }
  };

  const handleEditCategory = (category) => {
    setCategoryToEdit(category);
    setCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category? All transactions in this category will be uncategorized.")) {
      try {
        await api.delete(`/categories/${categoryId}`);
        toast.success("Category deleted successfully!");
        fetchData();
      } catch (err) {
        toast.error("Failed to delete category");
      }
    }
  };


  // Month-by-month filtering helper
  const getUniqueMonths = () => {
    const months = new Set();
    const current = new Date().toISOString().substring(0, 7); // YYYY-MM
    months.add(current);
    data.transactions.forEach(tx => {
      if (tx.date) {
        months.add(tx.date.substring(0, 7));
      }
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  };

  const uniqueMonths = getUniqueMonths();

  // Selected month calculations
  const monthlyTransactions = data.transactions.filter(t => t.date && t.date.substring(0, 7) === selectedMonth);

  const totalIncome = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalBudget = parseFloat(user?.monthly_budget || 0) + totalIncome;
  const totalSpent = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalRemaining = totalBudget - totalSpent;

  // Calculate dynamic spent amounts for the selected month
  const categoriesWithSpent = data.categories.map((cat) => {
    const spent = monthlyTransactions
      .filter(tx => String(tx.category_id) === String(cat.id) && tx.type === 'expense')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    return { ...cat, spent };
  });

  const emergencySavings = data.savings.find(s => s.type === 'emergency') || { target_amount: 100000, current_amount: 0 };
  const monthlySavings = data.savings.find(s => s.type === 'monthly') || { target_amount: 20000, current_amount: 0 };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-finwise-navy text-xl">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-finwise-mint/30 font-poppins text-gray-800">
      <LoggedInNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Main Content */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-white p-5 sm:p-6 rounded-2xl border border-finwise-green/10 shadow-[0_8px_30px_rgba(27,94,59,0.06)] hover:shadow-[0_12px_36px_rgba(27,94,59,0.12)] hover:-translate-y-0.5 transition-all duration-300 gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-finwise-navy">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">Here is what's happening with your finances today.</p>
              </div>
              <div className="flex flex-wrap gap-2.5 sm:gap-3 w-full sm:w-auto">
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)} 
                  className="bg-gray-100 text-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-finwise-green cursor-pointer shadow-sm border border-gray-200 flex-1 sm:flex-initial text-center"
                >
                  {uniqueMonths.map(m => {
                    const date = new Date(m + "-02");
                    const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                    return <option key={m} value={m}>{label}</option>;
                  })}
                </select>
                <button 
                  onClick={() => setSummaryOpen(true)}
                  className="bg-finwise-navy hover:bg-finwise-green text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer flex-1 sm:flex-initial"
                >
                  <TrendingUp size={14} /> <span className="whitespace-nowrap">Summary</span>
                </button>
                <button onClick={() => handleAddTransaction()} className="bg-finwise-green text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-finwise-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm flex-1 sm:flex-initial">
                  <Plus size={14} /> <span className="whitespace-nowrap">Add Transaction</span>
                </button>
              </div>
            </div>

            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Card 1: Budget */}
              <div className="bg-finwise-navy text-white p-5 rounded-2xl border border-finwise-navy/20 shadow-[0_8px_30px_rgba(27,94,59,0.06)] hover:shadow-[0_12px_36px_rgba(27,94,59,0.12)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[120px]">
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-finwise-green opacity-25 rounded-full blur-xl"></div>
                <div className="flex justify-between items-center mb-2 relative z-10">
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Monthly Budget</span>
                  <Wallet size={16} className="text-finwise-mint" />
                </div>
                <p className="text-2xl font-extrabold relative z-10">₹{totalBudget.toLocaleString()}</p>
                <span className="text-[10px] text-gray-400 mt-1 relative z-10">{new Date(selectedMonth + "-02").toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              </div>

              {/* Card 2: Spent */}
              <div className="bg-white p-5 rounded-2xl border border-finwise-green/10 shadow-[0_8px_30px_rgba(27,94,59,0.06)] hover:shadow-[0_12px_36px_rgba(27,94,59,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[120px]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Spent So Far</span>
                  <ArrowUpRight size={16} className="text-red-500" />
                </div>
                <p className="text-2xl font-extrabold text-finwise-navy">₹{totalSpent.toLocaleString()}</p>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-red-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>

              {/* Card 3: Remaining */}
              <div className="bg-white p-5 rounded-2xl border border-finwise-green/10 shadow-[0_8px_30px_rgba(27,94,59,0.06)] hover:shadow-[0_12px_36px_rgba(27,94,59,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[120px]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Remaining</span>
                  <TrendingUp size={16} className="text-finwise-green" />
                </div>
                <p className={`text-2xl font-extrabold ${totalRemaining >= 0 ? 'text-finwise-green' : 'text-red-500'}`}>
                  ₹{Math.max(totalRemaining, 0).toLocaleString()}
                </p>
                <span className="text-[10px] text-gray-400 mt-1">
                  {totalRemaining >= 0 ? 'Within budget bounds' : 'Exceeded budget!'}
                </span>
              </div>
            </div>

            {/* Main Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Column 1: Spending Overview & Savings Goals */}
              <div className="space-y-6">
                {/* Spending Overview Chart */}
                <div className="bg-white p-5 rounded-2xl border border-finwise-green/10 shadow-[0_8px_30px_rgba(27,94,59,0.06)] hover:shadow-[0_12px_36px_rgba(27,94,59,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between min-h-[240px]">
                  <h3 className="text-base font-bold text-finwise-navy">Spending Overview</h3>
                  {categoriesWithSpent.length > 0 && totalSpent > 0 ? (
                    <div className="flex flex-col sm:flex-row items-center gap-6 mt-2">
                      <div className="w-full sm:w-1/2 h-36 flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoriesWithSpent.filter(c => c.spent > 0)}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={52}
                              paddingAngle={4}
                              dataKey="spent"
                            >
                              {categoriesWithSpent.filter(c => c.spent > 0).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `₹${value}`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-full sm:w-1/2 space-y-2 pr-1">
                        {categoriesWithSpent.filter(c => c.spent > 0).slice(0, 4).map((cat) => {
                          const pct = totalSpent > 0 ? ((cat.spent / totalSpent) * 100).toFixed(0) : 0;
                          return (
                            <div key={cat.id} className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100/70 transition-colors">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="w-2.5 h-2.5 rounded-full shadow-sm shrink-0" style={{ backgroundColor: cat.color }} />
                                <span className="text-xs font-bold text-finwise-navy truncate">{cat.name}</span>
                              </div>
                              <div className="flex items-center gap-3 shrink-0 font-semibold text-xs">
                                <span className="text-finwise-navy">₹{parseFloat(cat.spent).toLocaleString()}</span>
                                <span className="text-gray-455 w-8 text-right text-[10px] font-medium">{pct}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="h-36 flex flex-col justify-center items-center text-gray-400 text-sm">
                      <Wallet size={24} className="mb-2 opacity-50" />
                      <p>No spending data for this month</p>
                    </div>
                  )}
                </div>

                {/* Savings Goals */}
                <div className="bg-white p-5 rounded-2xl border border-finwise-green/10 shadow-[0_8px_30px_rgba(27,94,59,0.06)] hover:shadow-[0_12px_36px_rgba(27,94,59,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold text-finwise-navy">Savings Goals</h3>
                    <button onClick={handleAddGoal} className="text-xs text-finwise-green font-bold flex items-center hover:underline cursor-pointer">
                      <Plus size={14} className="mr-1" /> Add
                    </button>
                  </div>
                  <div className="space-y-2 flex-1">
                    {data.goals.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center py-6">No goals set</p>
                    ) : (
                      data.goals.map(goal => (
                        <GoalCard 
                          key={goal.id} 
                          goal={goal} 
                          onAddMoney={() => handleAddMoney('goal', parseFloat(goal.saved_amount) || 0, goal.id, goal.name)} 
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Column 2: Categories */}
              <div className="bg-white p-5 rounded-2xl border border-finwise-green/10 shadow-[0_8px_30px_rgba(27,94,59,0.06)] hover:shadow-[0_12px_36px_rgba(27,94,59,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-finwise-navy">Categories</h3>
                  <button onClick={handleAddCategory} className="text-xs text-finwise-green font-bold flex items-center hover:underline cursor-pointer">
                    <Plus size={14} className="mr-1" /> Add
                  </button>
                </div>
                <div className="space-y-2 flex-1">
                  {categoriesWithSpent.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-6">No categories added</p>
                  ) : (
                    categoriesWithSpent.map(category => (
                      <CategoryCard 
                        key={category.id} 
                        category={category} 
                        onAddExpense={handleAddTransaction}
                        onEdit={handleEditCategory}
                        onDelete={handleDeleteCategory}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity (Stretched horizontally beneath all main widgets) */}
            <div className="bg-white p-5 rounded-2xl border border-finwise-green/10 shadow-[0_8px_30px_rgba(27,94,59,0.06)] hover:shadow-[0_12px_36px_rgba(27,94,59,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-finwise-navy">Recent Activity</h3>
                <Link to="/transactions" className="text-xs text-finwise-green hover:underline font-bold">View all</Link>
              </div>
              <div className="space-y-1">
                {monthlyTransactions.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No transactions for this month</p>
                ) : (
                  monthlyTransactions.slice(0, 4).map(tx => (
                    <div key={tx.id} className="flex justify-between items-center border-b border-gray-100 py-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`p-2.5 rounded-xl shrink-0 ${tx.type === 'income' ? 'bg-finwise-yellow/20 text-finwise-amber' : 'bg-red-50 text-red-500'}`}>
                          {tx.type === 'income' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate" title={tx.note}>{tx.note || 'Transaction'}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{new Date(tx.date).toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>
                      
                      {/* Category Badge */}
                      <div className="hidden sm:flex items-center gap-2 flex-1 justify-center">
                        {tx.category_id ? (
                          (() => {
                            const cat = data.categories.find(c => String(c.id) === String(tx.category_id));
                            return cat ? (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-full">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                                <span className="text-xs font-semibold text-gray-600">{cat.name}</span>
                              </div>
                            ) : null;
                          })()
                        ) : (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-finwise-mint/30 border border-finwise-green/10 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-finwise-green shrink-0" />
                            <span className="text-xs font-semibold text-finwise-green">Surplus / Savings</span>
                          </div>
                        )}
                      </div>

                      <span className={`text-sm font-black ${tx.type === 'income' ? 'text-finwise-green' : 'text-gray-900'} shrink-0 text-right ml-4`}>
                        {tx.type === 'income' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar Stats */}
          <div className="w-full lg:w-80 space-y-6 shrink-0">
            {/* Core Savings */}
            <div className="bg-white p-6 rounded-2xl border border-finwise-green/10 shadow-[0_8px_30px_rgba(27,94,59,0.06)] hover:shadow-[0_12px_36px_rgba(27,94,59,0.12)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
              <h3 className="text-base font-bold text-finwise-navy mb-4">Core Savings</h3>
              <div className="space-y-4">
                {/* Emergency Fund */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Emergency Fund</p>
                      <p className="text-xl font-extrabold text-finwise-green mt-0.5">₹{(parseFloat(emergencySavings.current_amount) || 0).toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => handleAddMoney('emergency', parseFloat(emergencySavings.current_amount) || 0)} 
                      className="text-[10px] font-bold text-finwise-green bg-finwise-mint hover:bg-finwise-green hover:text-white rounded-lg px-2.5 py-1.5 transition-all duration-300 shadow-sm border border-finwise-green/10 cursor-pointer"
                    >
                      Add Money
                    </button>
                  </div>
                </div>
                {/* Monthly Savings */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Monthly Savings</p>
                      <p className="text-xl font-extrabold text-finwise-green mt-0.5">₹{(parseFloat(monthlySavings.current_amount) || 0).toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => handleAddMoney('monthly', parseFloat(monthlySavings.current_amount) || 0)} 
                      className="text-[10px] font-bold text-finwise-green bg-finwise-mint hover:bg-finwise-green hover:text-white rounded-lg px-2.5 py-1.5 transition-all duration-300 shadow-sm border border-finwise-green/10 cursor-pointer"
                    >
                      Add Money
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights (sidebar) */}
            <div className="h-fit">
              <AIInsights contextData={{ 
                user: { name: user?.name, monthly_budget: user?.monthly_budget },
                budget: totalBudget, 
                spent: totalSpent, 
                remaining: totalRemaining, 
                categories: categoriesWithSpent,
                savings: data.savings,
                goals: data.goals,
                transactions: data.transactions
              }} />
            </div>

          </div>
        </div>

      </main>

      {/* Modals */}
      <AddCategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => {
          setCategoryModalOpen(false);
          setCategoryToEdit(null);
        }} 
        onSuccess={fetchData} 
        categoryToEdit={categoryToEdit}
      />
      <AddGoalModal isOpen={isGoalModalOpen} onClose={() => setGoalModalOpen(false)} onSuccess={fetchData} />
      <AddTransactionModal 
        isOpen={isTransactionModalOpen} 
        onClose={() => {
          setTransactionModalOpen(false);
          setDefaultCategoryForTx(null);
        }} 
        onSuccess={fetchData} 
        categories={data.categories} 
        defaultCategoryId={defaultCategoryForTx}
      />
      <AddMoneyModal 
        isOpen={moneyModalConfig.isOpen} 
        onClose={() => setMoneyModalConfig({ ...moneyModalConfig, isOpen: false })} 
        onSuccess={fetchData} 
        savingsType={moneyModalConfig.type} 
        currentAmount={moneyModalConfig.current} 
        goalId={moneyModalConfig.goalId}
        goalName={moneyModalConfig.goalName}
      />
      <SummaryModal 
        isOpen={isSummaryOpen} 
        onClose={() => setSummaryOpen(false)} 
        transactions={data.transactions} 
        categories={data.categories}
      />
      {prevLeftover > 0 && prevMonthStr && (
        <Modal 
          isOpen={isLeftoverModalOpen} 
          onClose={() => setLeftoverModalOpen(false)} 
          title="Leftover Budget Detected!"
        >
          <div className="space-y-4 font-poppins">
            <div className="p-3 bg-finwise-mint rounded-xl text-finwise-green flex items-center justify-center gap-3 border border-finwise-green/10">
              <TrendingUp size={20} className="animate-bounce shrink-0" />
              <span className="text-xs font-extrabold text-finwise-navy">
                You saved ₹{prevLeftover.toLocaleString()} in {new Date(prevMonthStr + "-02").toLocaleString('default', { month: 'long' })}!
              </span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed text-center">
              Congratulations on spending less than your budget last month. Transfer this leftover surplus to your core savings now to grow your wealth:
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button 
                onClick={() => {
                  handleTransferLeftover('emergency', prevLeftover, prevMonthStr);
                  setLeftoverModalOpen(false);
                }}
                className="w-full text-xs font-bold text-finwise-green bg-finwise-mint hover:bg-finwise-green hover:text-white border border-finwise-green/20 rounded-lg py-2.5 shadow-sm transition-all duration-300 cursor-pointer"
              >
                + Transfer to Emergency Savings
              </button>
              <button 
                onClick={() => {
                  handleTransferLeftover('monthly', prevLeftover, prevMonthStr);
                  setLeftoverModalOpen(false);
                }}
                className="w-full text-xs font-bold text-finwise-green bg-finwise-mint hover:bg-finwise-green hover:text-white border border-finwise-green/20 rounded-lg py-2.5 shadow-sm transition-all duration-300 cursor-pointer"
              >
                + Transfer to Monthly Savings
              </button>
              <button 
                onClick={() => setLeftoverModalOpen(false)}
                className="w-full text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg py-2 transition-colors cursor-pointer text-center border border-gray-200 mt-1"
              >
                Decide Later / Dismiss
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
