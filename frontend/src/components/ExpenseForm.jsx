import { useState } from 'react';
import { motion } from 'framer-motion';
import { expenseService } from '../services/api';

const ExpenseForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    type: 'one-time',
    category: 'food'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    { value: 'food', label: 'Food', icon: '🍔' },
    { value: 'transport', label: 'Transport', icon: '🚗' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { value: 'utilities', label: 'Utilities', icon: '💡' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'other', label: 'Other', icon: '💸' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await expenseService.create(formData);
      setMessage('Expense recorded! 📝');
      setFormData({
        amount: '',
        description: '',
        type: 'one-time',
        category: 'food'
      });
      onSuccess();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="mr-2">💸</span> Add Expense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (₹)
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-danger focus:border-transparent"
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-danger focus:border-transparent"
            placeholder="e.g., Lunch at restaurant, Movie tickets"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="one-time"
                checked={formData.type === 'one-time'}
                onChange={handleChange}
                className="mr-2"
              />
              <span>One-time</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="recurring"
                checked={formData.type === 'recurring'}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Recurring</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(cat => (
              <label
                key={cat.value}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                  formData.category === cat.value
                    ? 'bg-danger bg-opacity-20 border-2 border-danger'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={formData.category === cat.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-2xl mr-2">{cat.icon}</span>
                <span className="text-sm font-medium">{cat.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-danger text-white font-semibold py-3 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Recording...' : 'Record Expense 💸'}
        </button>
      </form>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-3 rounded-lg text-center ${
            message.includes('recorded') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExpenseForm;