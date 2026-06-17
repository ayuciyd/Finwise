import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ArrowUpRight, ArrowDownRight, Search, Plus } from 'lucide-react';
import api from '../utils/api';
import AddTransactionModal from '../components/AddTransactionModal';
import { AuthContext } from '../context/AuthContext';
import LoggedInNavbar from '../components/LoggedInNavbar';


const Transactions = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7)); // "YYYY-MM"
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
      try {
        const [txRes, catRes] = await Promise.all([
          api.get('/transactions'),
          api.get('/categories')
        ]);
        setTransactions(txRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  const getUniqueMonths = () => {
    const months = new Set();
    const current = new Date().toISOString().substring(0, 7);
    months.add(current);
    transactions.forEach(tx => {
      if (tx.date) months.add(tx.date.substring(0, 7));
    });
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  };

  const uniqueMonths = getUniqueMonths();

  const filteredTx = transactions.filter(tx => {
    const matchesMonth = tx.date && tx.date.substring(0, 7) === selectedMonth;
    const matchesSearch = (tx.note || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.amount.toString().includes(searchTerm);
    return matchesMonth && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-finwise-mint/30 font-poppins">
      <LoggedInNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-finwise-navy">Transactions</h1>
          <button onClick={() => setIsModalOpen(true)} className="mt-4 md:mt-0 bg-finwise-green text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-finwise-medium transition-colors flex items-center gap-2 shadow-sm">
            <Plus size={16} /> Add Transaction
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-finwise-green/10 shadow-[0_8px_30px_rgba(27,94,59,0.06)] hover:shadow-[0_12px_36px_rgba(27,94,59,0.12)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
              <Search className="text-gray-400 shrink-0" size={20} />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="outline-none text-sm w-full"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
              <span className="text-xs text-gray-500 font-semibold">Filter Month:</span>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)} 
                className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-finwise-green cursor-pointer border border-gray-200"
              >
                {uniqueMonths.map(m => {
                  const date = new Date(m + "-02");
                  const label = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                  return <option key={m} value={m}>{label}</option>;
                })}
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-8 text-gray-500">Loading...</td></tr>
                ) : filteredTx.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-8 text-gray-500">No transactions found.</td></tr>
                ) : (
                  filteredTx.map(tx => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-finwise-green/10 text-finwise-green' : 'bg-finwise-red/10 text-finwise-red'}`}>
                          {tx.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{tx.note || 'Untitled'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-bold ${tx.type === 'income' ? 'text-finwise-green' : 'text-finwise-navy'}`}>
                          {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
        categories={categories} 
      />
    </div>
  );
};

export default Transactions;
