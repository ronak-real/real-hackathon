import { useState } from 'react';
import { motion } from 'framer-motion';
import { authService } from '../services/auth';
import JethalalMascot from './JethalalMascot';

const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let user;
      if (isSignup) {
        // Validation
        if (!formData.username || !formData.password || !formData.email || !formData.name) {
          setError('All fields are required');
          setLoading(false);
          return;
        }
        user = await authService.register(formData);
      } else {
        if (!formData.username || !formData.password) {
          setError('Username and password are required');
          setLoading(false);
          return;
        }
        user = await authService.login(formData.username, formData.password);
      }
      onLogin(user);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setFormData({
      username: '',
      password: '',
      email: '',
      name: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="flex justify-center mb-4"
          >
            <JethalalMascot emotion="happy" size="large" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">
            SpendWise
          </h1>
          <p className="text-gray-600 mt-2">The Fun Financial Advisor</p>
        </div>

        {/* Login/Signup Form */}
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 border-2 border-purple-200"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {isSignup ? 'Create Account' : 'Welcome Back!'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                  placeholder="Enter your name"
                />
              </div>
            )}

            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary via-yellow-400 to-orange-400 text-gray-800 font-bold py-4 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Login')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={toggleMode}
                className="ml-2 text-purple font-semibold hover:underline"
              >
                {isSignup ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </div>

          {!isSignup && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
              <p className="text-sm text-gray-700 text-center">
                <strong>Demo Account:</strong><br />
                Username: demo<br />
                Password: demo123
              </p>
            </div>
          )}
        </motion.div>

        {/* Jethalal Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-600 italic">
            "Paisa bachana seekho, warna pachtaoge!" - Jethalal
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;