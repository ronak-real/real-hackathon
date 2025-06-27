import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { goalService } from '../services/api';

const GoalsList = ({ refresh, onFundSuccess }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFundModal, setShowFundModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [fundAmount, setFundAmount] = useState('');
  const [fundingLoading, setFundingLoading] = useState(false);
  const [fundError, setFundError] = useState('');

  useEffect(() => {
    fetchGoals();
  }, [refresh]);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await goalService.getAll();
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!selectedGoal || !fundAmount) return;

    setFundingLoading(true);
    setFundError('');
    try {
      await goalService.addFunds(selectedGoal.id, parseFloat(fundAmount));
      setShowFundModal(false);
      setFundAmount('');
      setSelectedGoal(null);
      fetchGoals(); // Refresh goals list
      if (onFundSuccess) {
        onFundSuccess(); // Trigger dashboard refresh
      }
    } catch (error) {
      console.error('Error adding funds:', error);
      if (error.response?.data?.error) {
        setFundError(error.response.data.error);
      } else {
        setFundError('Failed to add funds. Please try again.');
      }
    } finally {
      setFundingLoading(false);
    }
  };

  const openFundModal = (goal) => {
    setSelectedGoal(goal);
    setShowFundModal(true);
    setFundError('');
  };

  const getCategoryIcon = (category) => {
    const icons = {
      savings: '💰',
      emergency: '🚨',
      travel: '✈️',
      purchase: '🏠',
      investment: '📈',
      education: '🎓',
      other: '🎯'
    };
    return icons[category] || '🎯';
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return 'from-red-400 to-orange-400';
    if (progress < 70) return 'from-yellow-400 to-primary';
    return 'from-primary to-secondary';
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-accent-light"
      >
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent mb-6 flex items-center justify-center">
          <span className="mr-2 text-4xl animate-pulse">🎯</span> Your Financial Goals
        </h2>

        {goals.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl block mb-4 animate-wiggle">🎯</span>
            <p className="text-gray-500 text-lg">No goals set yet! Create your first financial goal.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {goals.map((goal, index) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const daysRemaining = getDaysRemaining(goal.deadline);
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-r from-white to-blue-50 rounded-2xl p-5 border-2 border-blue-200 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">
                        {getCategoryIcon(goal.category)}
                      </span>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{goal.title}</h3>
                        <p className="text-sm text-gray-600">
                          Target: ₹{goal.targetAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {daysRemaining !== null && (
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${
                          daysRemaining < 30 ? 'text-danger' : 'text-gray-600'
                        }`}>
                          {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue!'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        ₹{goal.currentAmount.toLocaleString()} saved
                      </span>
                      <span className="font-semibold">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-4 bg-gradient-to-r ${getProgressColor(progress)} rounded-full relative`}
                      >
                        {progress >= 50 && (
                          <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                            {progress.toFixed(0)}%
                          </span>
                        )}
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <p className="text-sm text-gray-500">
                      ₹{(goal.targetAmount - goal.currentAmount).toLocaleString()} to go
                    </p>
                    {progress >= 100 ? (
                      <span className="text-sm font-semibold text-secondary animate-pulse">
                        Goal Achieved! 🎉
                      </span>
                    ) : (
                      <button
                        onClick={() => openFundModal(goal)}
                        className="bg-gradient-to-r from-accent to-accent-dark text-white px-4 py-2 rounded-xl text-sm font-bold hover:shadow-lg transform hover:scale-105 transition-all"
                      >
                        Add Funds 💸
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Fund Modal */}
      <AnimatePresence>
        {showFundModal && selectedGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowFundModal(false);
                setFundAmount('');
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Add Funds to Goal 💰
              </h3>
              
              <div className="mb-6 text-center">
                <p className="text-lg font-semibold text-gray-700">{selectedGoal.title}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Current: ₹{selectedGoal.currentAmount.toLocaleString()} / ₹{selectedGoal.targetAmount.toLocaleString()}
                </p>
              </div>

              <form onSubmit={handleAddFunds} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Add (₹)
                  </label>
                  <input
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    required
                    min="1"
                    max={selectedGoal.targetAmount - selectedGoal.currentAmount}
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-accent-light rounded-xl focus:ring-4 focus:ring-accent-light focus:border-accent transition-all text-lg"
                    placeholder="Enter amount"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: ₹{(selectedGoal.targetAmount - selectedGoal.currentAmount).toLocaleString()}
                  </p>
                  {fundError && (
                    <p className="text-xs text-red-600 mt-1 font-semibold">
                      {fundError}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFundModal(false);
                      setFundAmount('');
                      setFundError('');
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={fundingLoading}
                    className="flex-1 bg-gradient-to-r from-accent to-accent-dark text-white font-semibold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {fundingLoading ? 'Adding...' : 'Add Funds 💸'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GoalsList;