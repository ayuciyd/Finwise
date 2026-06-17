import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import api from '../utils/api';

const AIInsights = ({ contextData }) => {
  const [insight, setInsight] = useState("Hi! I'm your FinWise AI assistant. Click a chip below or ask a question to get personalized financial insights based on your spending and goals.");
  const [loading, setLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const fetchInsight = async (prompt) => {
    setLoading(true);
    setInsight("Analyzing your financial data...");
    try {
      const { data } = await api.post('/insights', { prompt, contextData });
      setInsight(data.insight);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.details || err.response?.data?.error || err.message || "Unknown error";
      setInsight(`Sorry, I couldn't generate an insight right now.\nError: ${errorMsg}\nPlease try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      fetchInsight(customPrompt);
      setCustomPrompt('');
    }
  };

  const chips = [
    "How can I save more?",
    "Which goal should I focus on?",
    "Analyze my spending"
  ];

  return (
    <div className="bg-finwise-navy text-white p-6 md:p-8 rounded-2xl shadow-md relative overflow-hidden h-fit flex flex-col">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-finwise-green opacity-20 rounded-full blur-2xl"></div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 bg-finwise-yellow/20 rounded-xl">
          <Sparkles className="text-finwise-yellow" size={24} />
        </div>
        <h3 className="text-xl font-bold text-finwise-yellow">FinWise AI Insights</h3>
      </div>
      
      <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl mb-6 flex-1 border border-white/5 relative z-10">
        {loading ? (
          <div className="flex space-x-2 animate-pulse items-center h-full">
            <div className="w-2 h-2 bg-finwise-yellow rounded-full"></div>
            <div className="w-2 h-2 bg-finwise-yellow rounded-full"></div>
            <div className="w-2 h-2 bg-finwise-yellow rounded-full"></div>
          </div>
        ) : (
          <p className="text-gray-100 leading-relaxed font-light whitespace-pre-wrap text-xs">{insight}</p>
        )}
      </div>
      
      <div className="mt-auto">
        <div className="flex flex-wrap gap-2 mb-4 relative z-10">
          {chips.map((chip, idx) => (
            <button 
              key={idx} 
              onClick={() => fetchInsight(chip)}
              className="text-xs bg-white/5 hover:bg-white/20 border border-white/10 px-3 py-1.5 rounded-full transition-colors text-finwise-mint"
            >
              {chip}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleCustomSubmit} className="relative z-10 flex gap-2">
          <input 
            type="text" 
            placeholder="Ask me anything..." 
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-finwise-yellow text-white placeholder-gray-400"
          />
          <button type="submit" disabled={!customPrompt.trim() || loading} className="bg-finwise-yellow text-finwise-navy p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50">
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIInsights;
