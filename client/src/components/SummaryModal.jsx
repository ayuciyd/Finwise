import React, { useState } from 'react';
import Modal from './Modal';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

const SummaryModal = ({ isOpen, onClose, transactions, categories }) => {
  const [range, setRange] = useState('last-month'); // 'last-month', 'last-3-months', 'last-6-months', 'last-year'

  if (!isOpen) return null;

  // Helper to filter and aggregate values based on ranges
  const getRangeSummary = () => {
    const today = new Date();
    let startDate = new Date();

    if (range === 'last-month') {
      startDate.setMonth(today.getMonth() - 1);
    } else if (range === 'last-3-months') {
      startDate.setMonth(today.getMonth() - 3);
    } else if (range === 'last-6-months') {
      startDate.setMonth(today.getMonth() - 6);
    } else if (range === 'last-year') {
      startDate.setFullYear(today.getFullYear() - 1);
    }

    // Filter transactions in date range
    const filteredTx = transactions.filter(tx => {
      if (!tx.date) return false;
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= today;
    });

    const income = filteredTx
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const spent = filteredTx
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const netSavings = income - spent;
    const savingsRate = income > 0 ? (netSavings / income) * 100 : 0;

    // Group expenses by category
    const catMap = {};
    filteredTx
      .filter(t => t.type === 'expense')
      .forEach(tx => {
        const cat = categories.find(c => String(c.id) === String(tx.category_id)) || {
          name: 'Savings Transfers / Others',
          color: '#6B7280'
        };
        
        if (!catMap[cat.name]) {
          catMap[cat.name] = { amount: 0, color: cat.color };
        }
        catMap[cat.name].amount += parseFloat(tx.amount || 0);
      });

    const categoryList = Object.entries(catMap)
      .map(([name, val]) => ({
        name,
        amount: val.amount,
        color: val.color
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      income,
      spent,
      netSavings,
      savingsRate,
      categoryList,
      txCount: filteredTx.length
    };
  };

  const summary = getRangeSummary();

  const tabs = [
    { id: 'last-month', label: 'Last Month' },
    { id: 'last-3-months', label: 'Last 3 Months' },
    { id: 'last-6-months', label: 'Last 6 Months' },
    { id: 'last-year', label: 'Last Year' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Financial Summary Report" maxWidth="max-w-3xl">
      <div className="space-y-6 pr-1 font-poppins">
        
        {/* Date range selection tabs with spacing and tracking */}
        <div className="grid grid-cols-2 sm:flex bg-gray-100 p-1.5 rounded-xl gap-2.5 sm:gap-3.5 border border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setRange(tab.id)}
              className={`text-center py-2.5 text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer tracking-wide ${
                range === tab.id
                  ? 'bg-white text-finwise-navy shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/45'
              } ${
                range === tab.id ? 'w-full' : 'w-full'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Grid - 4 Columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-center text-xs text-gray-500 font-semibold mb-1">
              <span>Total Income</span>
              <ArrowDownRight size={14} className="text-finwise-green" />
            </div>
            <p className="text-lg font-extrabold text-finwise-navy">₹{summary.income.toLocaleString()}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-center text-xs text-gray-500 font-semibold mb-1">
              <span>Total Expenses</span>
              <ArrowUpRight size={14} className="text-red-500" />
            </div>
            <p className="text-lg font-extrabold text-finwise-navy">₹{summary.spent.toLocaleString()}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between shadow-sm">
            <div className="text-xs text-gray-500 font-semibold mb-1">Net Savings</div>
            <p className={`text-lg font-extrabold ${summary.netSavings >= 0 ? 'text-finwise-green' : 'text-red-650'}`}>
              {summary.netSavings < 0 ? '-' : ''}₹{Math.abs(summary.netSavings).toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-center text-xs text-gray-500 font-semibold mb-1">
              <span>Savings Rate</span>
              <TrendingUp size={14} className={summary.savingsRate >= 20 ? 'text-finwise-green' : 'text-gray-400'} />
            </div>
            <p className="text-lg font-extrabold text-finwise-navy">
              {summary.savingsRate > 0 ? `${summary.savingsRate.toFixed(0)}%` : '0%'}
            </p>
          </div>
        </div>

        {/* Savings Performance Analysis Statement */}
        <div className={`p-4 rounded-xl border text-xs flex gap-3 leading-relaxed items-start ${
          summary.netSavings >= 0 
            ? 'bg-finwise-mint/40 border-finwise-green/10 text-gray-700'
            : 'bg-red-50 border-red-100 text-gray-750'
        }`}>
          {summary.netSavings >= 0 ? (
            <>
              <TrendingUp size={18} className="text-finwise-green shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-finwise-navy block mb-0.5">Healthy Savings Rate!</span>
                You saved ₹{summary.netSavings.toLocaleString()} during this period, keeping a savings rate of {summary.savingsRate.toFixed(0)}%. Consider transferring leftover amounts to your core savings.
              </div>
            </>
          ) : (
            <>
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-red-700 block mb-0.5">Negative Savings Deficit!</span>
                You spent ₹{Math.abs(summary.netSavings).toLocaleString()} more than your income in this period. Review your top categories below to curb non-essential outflows.
              </div>
            </>
          )}
        </div>

        {/* Category breakdown progress bars */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-finwise-navy uppercase tracking-wider">Top Spending Categories</h4>
          
          {summary.categoryList.length === 0 ? (
            <p className="text-xs text-gray-400 italic text-center py-4">No expenses recorded in this period.</p>
          ) : (
            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              {summary.categoryList.map((cat, idx) => {
                const totalExpense = summary.spent || 1;
                const ratio = (cat.amount / totalExpense) * 100;
                
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="text-finwise-navy font-bold">{cat.name}</span>
                      </div>
                      <span className="text-gray-700">₹{cat.amount.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal">({ratio.toFixed(0)}%)</span></span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${ratio}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Close Button Footer */}
        <div className="flex justify-end pt-4 border-t border-gray-100 shrink-0">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-750 font-bold text-xs rounded-xl transition-all duration-300 cursor-pointer shadow-sm border border-gray-200"
          >
            Close Report
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default SummaryModal;
