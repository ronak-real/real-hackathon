import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { advisorService } from '../services/api';
import JethalalMascot from './JethalalMascot';

const FinancialAdvisor = () => {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'shopping',
    description: ''
  });
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showJethalal, setShowJethalal] = useState(false);

  const categories = [
    { value: 'food', label: 'Food', icon: '🍔' },
    { value: 'transport', label: 'Transport', icon: '🚗' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'luxury', label: 'Luxury', icon: '💎' },
    { value: 'gadgets', label: 'Gadgets', icon: '📱' },
    { value: 'other', label: 'Other', icon: '💸' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowJethalal(false);
    setAdvice(null);

    try {
      const response = await advisorService.getAdvice({
        expenseAmount: parseFloat(formData.amount),
        expenseCategory: formData.category,
        description: formData.description
      });
      
      setAdvice(response.data);
      setTimeout(() => setShowJethalal(true), 500);
    } catch (error) {
      console.error('Error getting advice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getJethalalExpression = (emotion) => {
    switch (emotion) {
      case 'happy':
        return '😄';
      case 'worried':
        return '😟';
      case 'shocked':
        return '😱';
      default:
        return '🤔';
    }
  };

  const getBackgroundEffect = (severity) => {
    switch (severity) {
      case 'success':
        return 'bg-gradient-to-br from-green-100 to-yellow-100';
      case 'warning':
        return 'bg-gradient-to-br from-yellow-100 to-orange-100';
      case 'danger':
        return 'bg-gradient-to-br from-red-100 to-pink-100';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border-2 border-purple-200"
      >
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple to-purple-dark bg-clip-text text-transparent mb-6 flex items-center justify-center">
          <span className="mr-2 text-4xl animate-float">🤔</span> Financial Advisor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How much do you want to spend? (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all bg-white/80"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What do you want to spend on?
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all bg-white/80"
              placeholder="e.g., New phone, Weekend trip, Restaurant dinner"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categories.map(cat => (
                <label
                  key={cat.value}
                  className={`flex flex-col items-center p-4 rounded-2xl cursor-pointer transition-all transform hover:scale-105 ${
                    formData.category === cat.value
                      ? 'bg-gradient-to-br from-purple to-purple-dark text-white shadow-lg scale-105'
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-purple-300'
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
                  <span className="text-3xl mb-1">{cat.icon}</span>
                  <span className="text-xs font-bold">{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary via-yellow-400 to-orange-400 text-gray-800 font-bold py-4 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? 'Analyzing your finances...' : 'Get Financial Advice 🎭'}
          </button>
        </form>
      </motion.div>

      <AnimatePresence>
        {showJethalal && advice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`rounded-3xl shadow-2xl p-6 md:p-8 ${getBackgroundEffect(advice.severity)} border-2 ${
              advice.severity === 'success' ? 'border-green-300' : 
              advice.severity === 'warning' ? 'border-yellow-300' : 
              'border-red-300'
            }`}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <JethalalMascot emotion={advice.emotion} size="xlarge" />

              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/95 backdrop-blur rounded-2xl p-5 shadow-xl relative border-2 border-purple-200"
                >
                  <div className="absolute -left-4 top-4 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent"></div>
                  <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple to-purple-dark bg-clip-text text-transparent italic">
                    "{advice.advice}"
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur rounded-2xl p-4 border-2 border-purple-200"
                >
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">
                    Financial Health Check:
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      💰 Current Balance: ₹{advice.financialHealth.currentBalance.toLocaleString()}
                    </p>
                    <p>
                      📊 Expense Ratio: {advice.financialHealth.expenseRatio}%
                    </p>
                    <p className={`font-semibold ${
                      advice.financialHealth.canAfford ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {advice.financialHealth.canAfford ? '✅ You can afford this!' : '❌ Not recommended!'}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {advice.severity === 'success' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center mt-4"
              >
                <span className="text-4xl animate-bounce-slow">🎉</span>
                <span className="text-4xl animate-bounce-slow" style={{ animationDelay: '0.2s' }}>🎊</span>
                <span className="text-4xl animate-bounce-slow" style={{ animationDelay: '0.4s' }}>🎉</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinancialAdvisor;