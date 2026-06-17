import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

const TransactionList = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return <div className="text-gray-500 text-center py-4">No transactions found.</div>;
  }

  return (
    <div className="space-y-4">
      {transactions.slice(0, 5).map(txn => (
        <div key={txn.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${txn.type === 'income' ? 'bg-finwise-green/10 text-finwise-green' : 'bg-finwise-red/10 text-finwise-red'}`}>
              {txn.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
            </div>
            <div>
              <p className="font-medium text-finwise-navy">{txn.note || 'Transaction'}</p>
              <p className="text-xs text-gray-500">{new Date(txn.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className={`font-semibold ${txn.type === 'income' ? 'text-finwise-green' : 'text-finwise-navy'}`}>
            {txn.type === 'income' ? '+' : '-'}₹{txn.amount}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
