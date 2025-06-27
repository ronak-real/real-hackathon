import { useState } from 'react';
import { motion } from 'framer-motion';
import { goalService } from '../services/api';

const GoalForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    category: 'savings',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    { value: 'savings', label: 'General Savings', icon: '💰' },
    { value: 'emergency', label: 'Emergency Fund', icon: '🚨' },
    { value: 'travel', label: 'Travel', icon: '✈️' },
    { value: 'purchase', label: 'Big Purchase', icon: '🏠' },
    { value: 'investment', label: 'Investment', icon: '📈' },
    { value: 'education', label: 'Education', icon: '🎓' },
    { value: 'other', label: 'Other', icon: '🎯' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await goalService.create(formData);
      setMessage('Goal created successfully! 🎯');
      setFormData({
        title: '',
        targetAmount: '',
        category: 'savings',
        deadline: ''
      });
      onSuccess();
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error creating goal. Please try again.');
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
        <span className="mr-2">🎯</span> Set Financial Goal
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goal Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="e.g., Emergency Fund, Europe Trip"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Amount (₹)
          </label>
          <input
            type="number"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Enter target amount"
          />
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
                    ? 'bg-accent bg-opacity-20 border-2 border-accent'
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Date (Optional)
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white font-semibold py-3 rounded-lg hover:bg-opacity-90 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Goal 🎯'}
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

export default GoalForm;