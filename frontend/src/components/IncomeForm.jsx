import { useState } from 'react';
import { motion } from 'framer-motion';
import { incomeService } from '../services/api';

const IncomeForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    type: 'one-time',
    category: 'employment'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    { value: 'employment', label: 'Employment', icon: '💼' },
    { value: 'freelance', label: 'Freelance', icon: '💻' },
    { value: 'investment', label: 'Investment', icon: '📈' },
    { value: 'gift', label: 'Gift', icon: '🎁' },
    { value: 'other', label: 'Other', icon: '💰' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await incomeService.create(formData);
      setMessage('Income added successfully! 🎉');
      setFormData({
        amount: '',
        source: '',
        type: 'one-time',
        category: 'employment'
      });
      onSuccess();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding income. Please try again.');
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
      className="bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-green-200"
    >
      <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-secondary to-secondary-dark bg-clip-text text-transparent mb-6 flex items-center justify-center">
        <span className="mr-2 text-4xl animate-bounce">💰</span> Add Income
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
            className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all bg-white/80 backdrop-blur text-lg"
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Source
          </label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="e.g., Monthly Salary, Freelance Project"
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map(cat => (
              <label
                key={cat.value}
                className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all transform hover:scale-105 ${
                  formData.category === cat.value
                    ? 'bg-gradient-to-r from-secondary to-secondary-dark text-white shadow-lg scale-105'
                    : 'bg-gradient-to-r from-gray-50 to-green-50 border-2 border-gray-200 hover:border-green-300'
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
                <span className="text-3xl mr-2">{cat.icon}</span>
                <span className="text-sm font-bold">{cat.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-secondary to-secondary-dark text-white font-bold py-4 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? 'Adding...' : 'Add Income 💵'}
        </button>
      </form>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-3 rounded-lg text-center ${
            message.includes('successfully') 
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

export default IncomeForm;