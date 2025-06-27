const request = require('supertest');
const { app, db } = require('./server');

// Reset database before each test
beforeEach(() => {
  db.users = [
    { id: 'user_1', username: 'demo', password: 'demo123', email: 'demo@spendwise.com', name: 'Demo User' }
  ];
  db.income = [];
  db.expenses = [];
  db.goals = [];
  db.idCounters = { users: 2, income: 1, expenses: 1, goals: 1 };
});

describe('SpendWise API Tests', () => {
  describe('Health Check', () => {
    test('GET /api/health should return OK status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
    });
  });

  describe('Authentication Endpoints', () => {
    test('POST /api/auth/login should authenticate valid user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'demo', password: 'demo123' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 'user_1');
      expect(response.body).toHaveProperty('username', 'demo');
      expect(response.body).not.toHaveProperty('password');
    });

    test('POST /api/auth/login should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'demo', password: 'wrong' });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid credentials');
    });

    test('POST /api/auth/register should create new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          password: 'password123',
          email: 'new@user.com',
          name: 'New User'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 'user_2');
      expect(response.body).toHaveProperty('username', 'newuser');
      expect(response.body).not.toHaveProperty('password');
      expect(db.users.length).toBe(2);
    });

    test('Protected endpoints should require authentication', async () => {
      const response = await request(app).get('/api/income');
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Authentication required');
    });
  });

  describe('Income Endpoints', () => {
    test('POST /api/income should create new income entry', async () => {
      const incomeData = {
        amount: 5000,
        source: 'Salary',
        type: 'recurring',
        category: 'employment'
      };
      
      const response = await request(app)
        .post('/api/income')
        .set('x-user-id', 'user_1')
        .send(incomeData);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.amount).toBe(5000);
      expect(db.income.length).toBe(1);
    });

    test('GET /api/income should return all income entries', async () => {
      db.income = [
        { id: 'income_1', userId: 'user_1', amount: 5000, source: 'Salary' },
        { id: 'income_2', userId: 'user_1', amount: 1000, source: 'Freelance' }
      ];
      
      const response = await request(app)
        .get('/api/income')
        .set('x-user-id', 'user_1');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe('Expense Endpoints', () => {
    test('POST /api/expense should create new expense entry', async () => {
      const expenseData = {
        amount: 500,
        description: 'Groceries',
        type: 'one-time',
        category: 'food'
      };
      
      const response = await request(app)
        .post('/api/expense')
        .set('x-user-id', 'user_1')
        .send(expenseData);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.amount).toBe(500);
      expect(db.expenses.length).toBe(1);
    });

    test('GET /api/expenses should return all expense entries', async () => {
      db.expenses = [
        { id: 'expense_1', userId: 'user_1', amount: 500, description: 'Groceries' },
        { id: 'expense_2', userId: 'user_1', amount: 200, description: 'Transport' }
      ];
      
      const response = await request(app)
        .get('/api/expenses')
        .set('x-user-id', 'user_1');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });

  describe('Goals Endpoints', () => {
    test('POST /api/goals should create new goal', async () => {
      const goalData = {
        title: 'Emergency Fund',
        targetAmount: 10000,
        category: 'savings',
        deadline: '2024-12-31'
      };
      
      const response = await request(app)
        .post('/api/goals')
        .set('x-user-id', 'user_1')
        .send(goalData);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.targetAmount).toBe(10000);
      expect(response.body.currentAmount).toBe(0);
    });

    test('PATCH /api/goals/:id/fund should add funds to goal', async () => {
      // First add some income
      await request(app)
        .post('/api/income')
        .set('x-user-id', 'user_1')
        .send({ amount: 10000, source: 'Salary', type: 'one-time', category: 'employment' });
      
      // Create a goal
      const goalData = {
        title: 'Vacation Fund',
        targetAmount: 5000,
        category: 'travel',
        deadline: '2024-06-30'
      };
      
      const createResponse = await request(app)
        .post('/api/goals')
        .set('x-user-id', 'user_1')
        .send(goalData);
      
      const goalId = createResponse.body.id;
      
      // Now add funds
      const fundResponse = await request(app)
        .patch(`/api/goals/${goalId}/fund`)
        .set('x-user-id', 'user_1')
        .send({ amount: 1000 });
      
      expect(fundResponse.status).toBe(200);
      expect(fundResponse.body.currentAmount).toBe(1000);
      expect(fundResponse.body.id).toBe(goalId);
      
      // Verify expense was created
      const expenses = await request(app)
        .get('/api/expenses')
        .set('x-user-id', 'user_1');
      const goalExpense = expenses.body.find(e => e.description.includes('Vacation Fund'));
      expect(goalExpense).toBeDefined();
      expect(goalExpense.amount).toBe(1000);
    });

    test('PATCH /api/goals/:id/fund should return 404 for non-existent goal', async () => {
      const response = await request(app)
        .patch('/api/goals/invalid_id/fund')
        .set('x-user-id', 'user_1')
        .send({ amount: 1000 });
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Goal not found');
    });

    test('PATCH /api/goals/:id/fund should return 400 for invalid amount', async () => {
      // First create a goal
      const goalData = {
        title: 'Test Goal',
        targetAmount: 5000,
        category: 'savings'
      };
      
      const createResponse = await request(app)
        .post('/api/goals')
        .set('x-user-id', 'user_1')
        .send(goalData);
      
      const goalId = createResponse.body.id;
      
      // Try to add negative amount
      const fundResponse = await request(app)
        .patch(`/api/goals/${goalId}/fund`)
        .set('x-user-id', 'user_1')
        .send({ amount: -100 });
      
      expect(fundResponse.status).toBe(400);
      expect(fundResponse.body).toHaveProperty('error', 'Amount must be positive');
    });

    test('PATCH /api/goals/:id/fund should return 400 for insufficient balance', async () => {
      // Create a goal with no income
      const goalData = {
        title: 'Big Goal',
        targetAmount: 10000,
        category: 'savings'
      };
      
      const createResponse = await request(app)
        .post('/api/goals')
        .set('x-user-id', 'user_1')
        .send(goalData);
      
      const goalId = createResponse.body.id;
      
      // Try to add funds without income
      const fundResponse = await request(app)
        .patch(`/api/goals/${goalId}/fund`)
        .set('x-user-id', 'user_1')
        .send({ amount: 5000 });
      
      expect(fundResponse.status).toBe(400);
      expect(fundResponse.body).toHaveProperty('error', 'Insufficient balance');
    });
  });

  describe('Dashboard Endpoint', () => {
    test('GET /api/dashboard should return financial summary', async () => {
      db.income = [{ id: 'income_1', userId: 'user_1', amount: 5000, date: new Date().toISOString() }];
      db.expenses = [{ id: 'expense_1', userId: 'user_1', amount: 1000, date: new Date().toISOString() }];
      db.goals = [{ id: 'goal_1', userId: 'user_1', title: 'Savings', targetAmount: 10000, currentAmount: 0 }];
      
      const response = await request(app)
        .get('/api/dashboard')
        .set('x-user-id', 'user_1');
      
      expect(response.status).toBe(200);
      expect(response.body.totalIncome).toBe(5000);
      expect(response.body.totalExpenses).toBe(1000);
      expect(response.body.savings).toBe(4000);
      expect(response.body.savingsRate).toBe('80.00');
      expect(response.body.goals.length).toBe(1);
    });
  });

  describe('Advisor Endpoint', () => {
    test('POST /api/advice should return encouraging advice for affordable expense', async () => {
      db.income = [{ id: 'income_1', userId: 'user_1', amount: 5000 }];
      db.expenses = [{ id: 'expense_1', userId: 'user_1', amount: 1000 }];
      
      const response = await request(app)
        .post('/api/advice')
        .set('x-user-id', 'user_1')
        .send({
          expenseAmount: 500,
          expenseCategory: 'entertainment',
          description: 'Movie tickets'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.emotion).toBe('happy');
      expect(response.body.severity).toBe('success');
      expect(response.body.financialHealth.canAfford).toBe(true);
    });

    test('POST /api/advice should return discouraging advice for unaffordable expense', async () => {
      db.income = [{ id: 'income_1', userId: 'user_1', amount: 1000 }];
      db.expenses = [{ id: 'expense_1', userId: 'user_1', amount: 900 }];
      
      const response = await request(app)
        .post('/api/advice')
        .set('x-user-id', 'user_1')
        .send({
          expenseAmount: 500,
          expenseCategory: 'luxury',
          description: 'New gadget'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.emotion).toBe('shocked');
      expect(response.body.severity).toBe('danger');
      expect(response.body.financialHealth.canAfford).toBe(false);
    });

    test('POST /api/advice should return cautious advice for borderline expense', async () => {
      db.income = [{ id: 'income_1', userId: 'user_1', amount: 3000 }];
      db.expenses = [{ id: 'expense_1', userId: 'user_1', amount: 2000 }];
      
      const response = await request(app)
        .post('/api/advice')
        .set('x-user-id', 'user_1')
        .send({
          expenseAmount: 400,
          expenseCategory: 'shopping',
          description: 'New clothes'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.emotion).toBe('worried');
      expect(response.body.severity).toBe('warning');
    });
  });
});