const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
const db = {
  users: [
    // Default demo user
    { id: 'user_1', username: 'demo', password: 'demo123', email: 'demo@spendwise.com', name: 'Demo User' }
  ],
  income: [],
  expenses: [],
  goals: [],
  idCounters: {
    users: 2,
    income: 1,
    expenses: 1,
    goals: 1
  }
};

// Simple auth middleware
const authenticateUser = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'Invalid user' });
  }
  
  req.userId = userId;
  req.user = user;
  next();
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SpendWise API is running!' });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({
    id: user.id,
    username: user.username,
    name: user.name
  });
});

app.post('/api/auth/register', (req, res) => {
  const { username, password, email, name } = req.body;
  
  // Validation
  if (!username || !password || !email || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Check if username or email exists
  if (db.users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  
  const newUser = {
    id: `user_${db.idCounters.users++}`,
    username,
    password,
    email,
    name
  };
  
  db.users.push(newUser);
  
  res.status(201).json({
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    name: newUser.name
  });
});

// Income routes (protected)
app.get('/api/income', authenticateUser, (req, res) => {
  const userIncome = db.income.filter(i => i.userId === req.userId);
  res.json(userIncome);
});

app.post('/api/income', authenticateUser, (req, res) => {
  const { amount, source, type, category } = req.body;
  const newIncome = {
    id: `income_${db.idCounters.income++}`,
    userId: req.userId,
    amount: parseFloat(amount),
    source,
    type,
    category,
    date: new Date().toISOString()
  };
  db.income.push(newIncome);
  res.status(201).json(newIncome);
});

// Expense routes (protected)
app.get('/api/expenses', authenticateUser, (req, res) => {
  const userExpenses = db.expenses.filter(e => e.userId === req.userId);
  res.json(userExpenses);
});

app.post('/api/expense', authenticateUser, (req, res) => {
  const { amount, description, type, category } = req.body;
  const newExpense = {
    id: `expense_${db.idCounters.expenses++}`,
    userId: req.userId,
    amount: parseFloat(amount),
    description,
    type,
    category,
    date: new Date().toISOString()
  };
  db.expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// Goals routes (protected)
app.get('/api/goals', authenticateUser, (req, res) => {
  const userGoals = db.goals.filter(g => g.userId === req.userId);
  res.json(userGoals);
});

app.post('/api/goals', authenticateUser, (req, res) => {
  const { title, targetAmount, category, deadline } = req.body;
  const newGoal = {
    id: `goal_${db.idCounters.goals++}`,
    userId: req.userId,
    title,
    targetAmount: parseFloat(targetAmount),
    currentAmount: 0,
    category,
    deadline,
    createdAt: new Date().toISOString()
  };
  db.goals.push(newGoal);
  res.status(201).json(newGoal);
});

// Add funds to goal (protected)
app.patch('/api/goals/:id/fund', authenticateUser, (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  
  const goal = db.goals.find(g => g.id === id && g.userId === req.userId);
  if (!goal) {
    return res.status(404).json({ error: 'Goal not found' });
  }
  
  const fundAmount = parseFloat(amount);
  if (fundAmount <= 0) {
    return res.status(400).json({ error: 'Amount must be positive' });
  }
  
  // Check if user has enough balance
  const userIncome = db.income.filter(i => i.userId === req.userId);
  const userExpenses = db.expenses.filter(e => e.userId === req.userId);
  const userGoals = db.goals.filter(g => g.userId === req.userId);
  
  const totalIncome = userIncome.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalGoalFunds = userGoals.reduce((sum, g) => sum + g.currentAmount, 0) - goal.currentAmount;
  const availableBalance = totalIncome - totalExpenses - totalGoalFunds;
  
  if (fundAmount > availableBalance) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }
  
  // Update goal amount
  goal.currentAmount += fundAmount;
  
  // Add this as an expense for tracking
  const fundExpense = {
    id: `expense_${db.idCounters.expenses++}`,
    userId: req.userId,
    amount: fundAmount,
    description: `Goal contribution: ${goal.title}`,
    type: 'one-time',
    category: 'savings',
    date: new Date().toISOString()
  };
  db.expenses.push(fundExpense);
  
  res.json(goal);
});

// Dashboard summary (protected)
app.get('/api/dashboard', authenticateUser, (req, res) => {
  const userIncome = db.income.filter(i => i.userId === req.userId);
  const userExpenses = db.expenses.filter(e => e.userId === req.userId);
  const userGoals = db.goals.filter(g => g.userId === req.userId);
  
  const totalIncome = userIncome.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savings = totalIncome - totalExpenses;
  
  res.json({
    totalIncome,
    totalExpenses,
    savings,
    savingsRate: totalIncome > 0 ? (savings / totalIncome * 100).toFixed(2) : 0,
    recentTransactions: [
      ...userIncome.slice(-5).map(i => ({ ...i, type: 'income' })),
      ...userExpenses.slice(-5).map(e => ({ ...e, type: 'expense' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10),
    goals: userGoals
  });
});

// Financial Advisor endpoint (protected)
app.post('/api/advice', authenticateUser, (req, res) => {
  const { expenseAmount, expenseCategory, description } = req.body;
  
  // Calculate financial health for the user
  const userIncome = db.income.filter(i => i.userId === req.userId);
  const userExpenses = db.expenses.filter(e => e.userId === req.userId);
  
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
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SpendWise backend running on port ${PORT}`);
  });
}

module.exports = { app, db };