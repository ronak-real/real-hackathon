import { motion } from 'framer-motion';
import JethalalMascot from './JethalalMascot';

const Dashboard = ({ data }) => {
  if (!data) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600 text-lg">Loading your financial data...</p>
      </div>
    );
  }

  const { totalIncome, totalExpenses, savings, savingsRate, recentTransactions, goals } = data;

  const getSavingsColor = () => {
    if (savings < 0) return 'from-danger to-danger-dark';
    if (savingsRate < 20) return 'from-warning to-warning-dark';
    return 'from-secondary to-secondary-dark';
  };

  const statCards = [
    {
      title: 'Total Income',
      value: totalIncome,
      icon: '💰',
      gradient: 'from-secondary to-secondary-dark',
      shadowColor: 'shadow-neon-green'
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: '💸',
      gradient: 'from-danger to-danger-dark',
      shadowColor: 'shadow-red-400'
    },
    {
      title: 'Savings',
      value: Math.abs(savings),
      suffix: savings < 0 ? ' (Deficit)' : '',
      icon: '🏦',
      gradient: getSavingsColor(),
      shadowColor: savings >= 0 ? 'shadow-neon-green' : 'shadow-red-400'
    },
    {
      title: 'Savings Rate',
      value: savingsRate,
      suffix: '%',
      icon: '📈',
      gradient: getSavingsColor(),
      shadowColor: savingsRate > 20 ? 'shadow-neon-green' : 'shadow-yellow-400'
    }
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-br ${stat.gradient} rounded-3xl shadow-xl ${stat.shadowColor} p-6 text-white transform transition-all hover:shadow-2xl`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white/80 text-xs md:text-sm font-semibold uppercase tracking-wider">
                  {stat.title}
                </h3>
                <p className="text-2xl md:text-3xl font-bold mt-2">
                  ₹{stat.value.toLocaleString()}{stat.suffix}
                </p>
              </div>
              <span className="text-4xl md:text-5xl opacity-80 animate-pulse">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200"
        >
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple to-purple-dark bg-clip-text text-transparent mb-6 flex items-center">
            <span className="mr-2 text-3xl">📜</span> Recent Transactions
          </h2>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl block mb-4">📭</span>
              <p className="text-gray-500 text-lg">No transactions yet!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={`${transaction.type}_${transaction.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-2xl border-2 ${
                    transaction.type === 'income' 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
                      : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-300'
                  } hover:shadow-lg transition-all`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {transaction.source || transaction.description}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className={`text-lg md:text-xl font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-accent-light"
        >
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent mb-6 flex items-center">
            <span className="mr-2 text-3xl">🎯</span> Financial Goals
          </h2>
          {goals.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl block mb-4 animate-wiggle">🎯</span>
              <p className="text-gray-500 text-lg">No goals set yet!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {goals.map(goal => {
                const progress = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <div key={goal.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-5 border-2 border-blue-200 hover:shadow-lg transition-all">
                    <h3 className="font-semibold text-lg text-gray-800">{goal.title}</h3>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-2">
                        <span>₹{goal.currentAmount} / ₹{goal.targetAmount}</span>
                        <span className="font-bold text-accent-dark">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-4 bg-gradient-to-r from-accent to-accent-dark rounded-full relative"
                        >
                          {progress >= 50 && (
                            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                              {progress.toFixed(0)}%
                            </span>
                          )}
                        </motion.div>
                      </div>
                    </div>
                    {goal.deadline && (
                      <p className="text-xs md:text-sm text-gray-500 mt-2">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-primary via-yellow-400 to-orange-400 rounded-3xl shadow-2xl p-6 md:p-10 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center">
            Financial Wisdom
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <JethalalMascot 
              emotion={savingsRate > 30 ? 'happy' : savingsRate > 10 ? 'worried' : 'shocked'} 
              size="large" 
            />
            <div className="max-w-lg">
              <p className="text-lg md:text-xl text-gray-800 italic font-medium">
                {savingsRate > 30
                  ? '"Wah wah wah! Tumhara savings rate ekdum solid hai! Party karne ka time aa gaya!"'
                  : savingsRate > 10
                  ? '"Thik hai, thik hai... savings ho rahi hai, par thoda aur kar sakte ho!"'
                  : '"Arre bhai! Savings kahan hai? Paisa bachana seekho, warna Daya bhabhi se daant padegi!"'}
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <span className="text-4xl animate-bounce">💡</span>
            <span className="text-4xl animate-bounce" style={{animationDelay: '0.2s'}}>💰</span>
            <span className="text-4xl animate-bounce" style={{animationDelay: '0.4s'}}>🚀</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;