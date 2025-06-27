import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import IncomeForm from './components/IncomeForm';
import ExpenseForm from './components/ExpenseForm';
import GoalForm from './components/GoalForm';
import TransactionList from './components/TransactionList';
import GoalsList from './components/GoalsList';
import FinancialAdvisor from './components/FinancialAdvisor';
import JethalalMascot from './components/JethalalMascot';
import Login from './components/Login';
import { dashboardService } from './services/api';
import { authService } from './services/auth';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [refreshTrigger, user]);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getSummary();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleDataUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setDashboardData(null);
    setActiveTab('dashboard');
  };

  // Show login screen if user is not authenticated
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', color: 'bg-gradient-to-r from-purple to-purple-dark' },
    { id: 'income', label: 'Add Income', icon: '💰', color: 'bg-gradient-to-r from-secondary to-secondary-dark' },
    { id: 'expense', label: 'Add Expense', icon: '💸', color: 'bg-gradient-to-r from-danger to-danger-dark' },
    { id: 'goals', label: 'Goals', icon: '🎯', color: 'bg-gradient-to-r from-accent to-accent-dark' },
    { id: 'advisor', label: 'Financial Advisor', icon: '🤔', color: 'bg-gradient-to-r from-primary to-primary-dark' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-gradient-to-r from-primary via-primary-dark to-orange-500 shadow-2xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <JethalalMascot emotion="happy" size="small" />
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-800 text-center font-display animate-wiggle">
                SpendWise - The Fun Financial Advisor 💵
              </h1>
              <p className="text-center text-gray-700 mt-2 text-sm md:text-base">
                Manage your money with wisdom and humor!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <JethalalMascot emotion="happy" size="small" />
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm font-semibold text-gray-800">
                  Welcome, {user.name}!
                </p>
                <button
                  onClick={handleLogout}
                  className="mt-2 px-4 py-2 bg-white/90 text-gray-800 rounded-full font-semibold hover:bg-white shadow-lg transition-all transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b-4 border-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 py-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-110 ${
                  activeTab === tab.id
                    ? `${tab.color} text-white shadow-lg scale-105`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-1 md:gap-2">
                  <span className="text-xl md:text-2xl animate-bounce-slow">{tab.icon}</span>
                  <span className="text-xs md:text-sm font-bold">{tab.label}</span>
                </span>
                {activeTab === tab.id && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-current border-r-[10px] border-r-transparent"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard data={dashboardData} />
          )}
          
          {activeTab === 'income' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              <IncomeForm onSuccess={handleDataUpdate} />
              <TransactionList type="income" refresh={refreshTrigger} />
            </div>
          )}
          
          {activeTab === 'expense' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              <ExpenseForm onSuccess={handleDataUpdate} />
              <TransactionList type="expense" refresh={refreshTrigger} />
            </div>
          )}
          
          {activeTab === 'goals' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              <GoalForm onSuccess={handleDataUpdate} />
              <GoalsList refresh={refreshTrigger} onFundSuccess={handleDataUpdate} />
            </div>
          )}
          
          {activeTab === 'advisor' && (
            <FinancialAdvisor />
          )}
        </div>
      </main>

      <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm md:text-base animate-pulse">
            © 2025 SpendWise - Made with <span className="text-red-500 text-xl">❤️</span> and lots of "Hey Maa Mataji!"
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <span className="text-2xl animate-float">💰</span>
            <span className="text-2xl animate-float" style={{animationDelay: '0.5s'}}>📈</span>
            <span className="text-2xl animate-float" style={{animationDelay: '1s'}}>🎯</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;