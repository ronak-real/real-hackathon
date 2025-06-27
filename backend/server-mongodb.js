const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dbAdapter = require('./db/adapter');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database connection
let dbInitialized = false;

const initializeDB = async () => {
  if (!dbInitialized) {
    await dbAdapter.connect();
    dbInitialized = true;
    console.log('Database initialized:', dbAdapter.getStatus());
  }
};

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://real-hackathon-fe.vercel.app',
      'https://spendwise-fe.vercel.app',
    ];
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-user-id'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Ensure DB is initialized before handling requests
app.use(async (req, res, next) => {
  await initializeDB();
  next();
});

// Simple auth middleware
const authenticateUser = async (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const user = await dbAdapter.findUser({ id: userId });
  if (!user) {
    return res.status(401).json({ error: 'Invalid user' });
  }
  
  req.userId = userId;
  req.user = user;
  next();
};

// Routes
app.get('/api/health', (req, res) => {
  const dbStatus = dbAdapter.getStatus();
  res.json({ 
    status: 'OK', 
    message: 'SpendWise API is running!',
    database: dbStatus
  });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await dbAdapter.findUser({ username, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({
      id: user.id,
      username: user.username,
      name: user.name
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, email, name } = req.body;
    
    // Validation
    if (!username || !password || !email || !name) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if username exists
    const existingUser = await dbAdapter.findUser({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Check if email exists
    const existingEmail = await dbAdapter.findUser({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const userId = dbAdapter.generateId('users');
    const newUser = await dbAdapter.createUser({
      id: userId,
      username,
      password,
      email,
      name
    });
    
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Income routes (protected)
app.get('/api/income', authenticateUser, async (req, res) => {
  try {
    const userIncome = await dbAdapter.getIncome(req.userId);
    res.json(userIncome);
  } catch (error) {
    console.error('Get income error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/income', authenticateUser, async (req, res) => {
  try {
    const { amount, source, type, category } = req.body;
    const incomeId = dbAdapter.generateId('income');
    
    const newIncome = await dbAdapter.createIncome({
      id: incomeId,
      userId: req.userId,
      amount: parseFloat(amount),
      source,
      type,
      category,
      date: new Date().toISOString()
    });
    
    res.status(201).json(newIncome);
  } catch (error) {
    console.error('Create income error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Expense routes (protected)
app.get('/api/expenses', authenticateUser, async (req, res) => {
  try {
    const userExpenses = await dbAdapter.getExpenses(req.userId);
    res.json(userExpenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/expense', authenticateUser, async (req, res) => {
  try {
    const { amount, description, type, category } = req.body;
    const expenseId = dbAdapter.generateId('expenses');
    
    const newExpense = await dbAdapter.createExpense({
      id: expenseId,
      userId: req.userId,
      amount: parseFloat(amount),
      description,
      type,
      category,
      date: new Date().toISOString()
    });
    
    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Goals routes (protected)
app.get('/api/goals', authenticateUser, async (req, res) => {
  try {
    const userGoals = await dbAdapter.getGoals(req.userId);
    res.json(userGoals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/goals', authenticateUser, async (req, res) => {
  try {
    const { title, targetAmount, category, deadline } = req.body;
    const goalId = dbAdapter.generateId('goals');
    
    const newGoal = await dbAdapter.createGoal({
      id: goalId,
      userId: req.userId,
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      category,
      deadline,
      createdAt: new Date().toISOString()
    });
    
    res.status(201).json(newGoal);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add funds to goal (protected)
app.patch('/api/goals/:id/fund', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    
    const goal = await dbAdapter.getGoal(id, req.userId);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    const fundAmount = parseFloat(amount);
    if (fundAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }
    
    // Check if user has enough balance
    const userIncome = await dbAdapter.getIncome(req.userId);
    const userExpenses = await dbAdapter.getExpenses(req.userId);
    const userGoals = await dbAdapter.getGoals(req.userId);
    
    const totalIncome = userIncome.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalGoalFunds = userGoals.reduce((sum, g) => sum + g.currentAmount, 0) - goal.currentAmount;
    const availableBalance = totalIncome - totalExpenses - totalGoalFunds;
    
    if (fundAmount > availableBalance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    // Update goal amount
    const updatedGoal = await dbAdapter.updateGoal(id, req.userId, {
      currentAmount: goal.currentAmount + fundAmount
    });
    
    // Add this as an expense for tracking
    const expenseId = dbAdapter.generateId('expenses');
    await dbAdapter.createExpense({
      id: expenseId,
      userId: req.userId,
      amount: fundAmount,
      description: `Goal contribution: ${goal.title}`,
      type: 'one-time',
      category: 'savings',
      date: new Date().toISOString()
    });
    
    res.json(updatedGoal);
  } catch (error) {
    console.error('Fund goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dashboard summary (protected)
app.get('/api/dashboard', authenticateUser, async (req, res) => {
  try {
    const userIncome = await dbAdapter.getIncome(req.userId);
    const userExpenses = await dbAdapter.getExpenses(req.userId);
    const userGoals = await dbAdapter.getGoals(req.userId);
    
    const totalIncome = userIncome.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const savings = totalIncome - totalExpenses;
    
    // Calculate category-wise analytics
    const incomeByCategory = userIncome.reduce((acc, inc) => {
      const category = inc.category || 'other';
      acc[category] = (acc[category] || 0) + inc.amount;
      return acc;
    }, {});
    
    const expenseByCategory = userExpenses.reduce((acc, exp) => {
      const category = exp.category || 'other';
      acc[category] = (acc[category] || 0) + exp.amount;
      return acc;
    }, {});
    
    res.json({
      totalIncome,
      totalExpenses,
      savings,
      savingsRate: totalIncome > 0 ? (savings / totalIncome * 100).toFixed(2) : 0,
      recentTransactions: [
        ...userIncome.slice(-5).map(i => ({ ...i, type: 'income' })),
        ...userExpenses.slice(-5).map(e => ({ ...e, type: 'expense' }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10),
      goals: userGoals,
      analytics: {
        incomeByCategory,
        expenseByCategory
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Financial Advisor endpoint (protected)
app.post('/api/advice', authenticateUser, async (req, res) => {
  try {
    const { expenseAmount, expenseCategory, description } = req.body;
    
    // Calculate financial health for the user
    const userIncome = await dbAdapter.getIncome(req.userId);
    const userExpenses = await dbAdapter.getExpenses(req.userId);
    
    const totalIncome = userIncome.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const currentBalance = totalIncome - totalExpenses;
    const expenseRatio = totalIncome > 0 ? (totalExpenses + expenseAmount) / totalIncome : 1;
    
    let advice, emotion, severity;
    
    // Decision logic
    if (currentBalance <= 0 || expenseAmount > currentBalance * 0.5) {
      // Discouraging
      emotion = 'shocked';
      severity = 'danger';
      const messages = [
        "Nahiiii! Ye paisa mat udao! Bankrupt ho jaoge! Bilkul nahi!",
        "Hey maa mataji! Itna kharcha? Account mein paisa hi nahi hai!",
        "Nonsense! Ye kya bakwas kar rahe ho? Savings ka kya hoga?"
      ];
      advice = messages[Math.floor(Math.random() * messages.length)];
    } else if (expenseRatio > 0.7 || expenseAmount > currentBalance * 0.2) {
      // Cautious
      emotion = 'worried';
      severity = 'warning';
      const messages = [
        "Thoda ruko... mahine ka aadha gaya hai, thoda bachke! Babuchak mat bano!",
        "Hmm... kar to sakte ho, par phir month end mein Maggi khani padegi!",
        "Arre Tapu ke papa! Budget tight hai... soch samajh ke karo!"
      ];
      advice = messages[Math.floor(Math.random() * messages.length)];
    } else {
      // Encouraging
      emotion = 'happy';
      severity = 'success';
      const messages = [
        "Ae bhai! Tumhara budget ekdum sahi hai! Ye expense kar sakte ho! Party karo!",
        "Wah wah wah! Paisa bacha ke rakha hai tune! Le le ye wala item, tension mat le!",
        "Arre champion! Tu to ekdum financially stable hai! Ye choti si cheez to le hi sakta hai!"
      ];
      advice = messages[Math.floor(Math.random() * messages.length)];
    }
    
    res.json({
      advice,
      emotion,
      severity,
      financialHealth: {
        currentBalance,
        expenseRatio: (expenseRatio * 100).toFixed(2),
        canAfford: severity === 'success'
      }
    });
  } catch (error) {
    console.error('Advice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
if (require.main === module) {
  app.listen(PORT, async () => {
    await initializeDB();
    console.log(`SpendWise backend running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
// Also export for testing
module.exports.app = app;
module.exports.dbAdapter = dbAdapter;