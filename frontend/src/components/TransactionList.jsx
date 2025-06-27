import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { incomeService, expenseService } from '../services/api';

const TransactionList = ({ type, refresh }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [type, refresh]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const service = type === 'income' ? incomeService : expenseService;
      const response = await service.getAll();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      employment: '💼',
      freelance: '💻',
      investment: '📈',
      gift: '🎁',
      food: '🍔',
      transport: '🚗',
      entertainment: '🎬',
      utilities: '💡',
      shopping: '🛍️',
      health: '🏥',
      education: '📚',
      other: type === 'income' ? '💰' : '💸'
    };
    return icons[category] || '💵';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">{type === 'income' ? '💰' : '💸'}</span> 
        Recent {type === 'income' ? 'Income' : 'Expenses'}
      </h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No {type === 'income' ? 'income' : 'expenses'} recorded yet!
        </p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.slice().reverse().map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg ${
                type === 'income' ? 'bg-green-50' : 'bg-red-50'
              } hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">
                    {getCategoryIcon(transaction.category)}
                  </span>
                  <div>
                    <p className="font-semibold">
                      {transaction.source || transaction.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString()} • 
                      <span className="ml-1 capitalize">{transaction.type}</span>
                    </p>
                  </div>
                </div>
                <p className={`text-xl font-bold ${
                  type === 'income' ? 'text-secondary' : 'text-danger'
                }`}>
                  {type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TransactionList;