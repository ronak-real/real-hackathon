const { connectDB, getDB } = require('./mongodb');
const crypto = require('crypto');

// In-memory fallback storage
const memoryDB = {
  users: [
    { _id: 'user_1', id: 'user_1', username: 'demo', password: 'demo123', email: 'demo@spendwise.com', name: 'Demo User' }
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

class DatabaseAdapter {
  constructor() {
    this.db = null;
    this.isMongoConnected = false;
  }

  async connect() {
    this.db = await connectDB();
    this.isMongoConnected = !!this.db;
    
    if (this.isMongoConnected) {
      // Initialize demo user in MongoDB if not exists
      await this.initializeDemoUser();
    }
    
    return this;
  }

  async initializeDemoUser() {
    try {
      const usersCollection = this.db.collection('users');
      const demoUser = await usersCollection.findOne({ username: 'demo' });
      
      if (!demoUser) {
        await usersCollection.insertOne({
          _id: 'user_1',
          id: 'user_1',
          username: 'demo',
          password: 'demo123',
          email: 'demo@spendwise.com',
          name: 'Demo User'
        });
        console.log('Demo user created in MongoDB');
      }
    } catch (error) {
      console.error('Error initializing demo user:', error);
    }
  }

  generateId(type) {
    if (this.isMongoConnected) {
      return `${type}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    } else {
      const id = `${type}_${memoryDB.idCounters[type]++}`;
      return id;
    }
  }

  // User operations
  async findUser(query) {
    if (this.isMongoConnected) {
      const user = await this.db.collection('users').findOne(query);
      return user;
    } else {
      return memoryDB.users.find(u => 
        Object.entries(query).every(([key, value]) => u[key] === value)
      );
    }
  }

  async createUser(userData) {
    const newUser = {
      ...userData,
      _id: userData.id,
      createdAt: new Date()
    };

    if (this.isMongoConnected) {
      await this.db.collection('users').insertOne(newUser);
    } else {
      memoryDB.users.push(newUser);
    }
    
    return newUser;
  }

  async getUsersByQuery(query = {}) {
    if (this.isMongoConnected) {
      return await this.db.collection('users').find(query).toArray();
    } else {
      return memoryDB.users.filter(u => 
        Object.entries(query).every(([key, value]) => u[key] === value)
      );
    }
  }

  // Income operations
  async getIncome(userId) {
    if (this.isMongoConnected) {
      return await this.db.collection('income').find({ userId }).toArray();
    } else {
      return memoryDB.income.filter(i => i.userId === userId);
    }
  }

  async createIncome(incomeData) {
    const newIncome = {
      ...incomeData,
      _id: incomeData.id,
      createdAt: new Date()
    };

    if (this.isMongoConnected) {
      await this.db.collection('income').insertOne(newIncome);
    } else {
      memoryDB.income.push(newIncome);
    }
    
    return newIncome;
  }

  // Expense operations
  async getExpenses(userId) {
    if (this.isMongoConnected) {
      return await this.db.collection('expenses').find({ userId }).toArray();
    } else {
      return memoryDB.expenses.filter(e => e.userId === userId);
    }
  }

  async createExpense(expenseData) {
    const newExpense = {
      ...expenseData,
      _id: expenseData.id,
      createdAt: new Date()
    };

    if (this.isMongoConnected) {
      await this.db.collection('expenses').insertOne(newExpense);
    } else {
      memoryDB.expenses.push(newExpense);
    }
    
    return newExpense;
  }

  // Goals operations
  async getGoals(userId) {
    if (this.isMongoConnected) {
      return await this.db.collection('goals').find({ userId }).toArray();
    } else {
      return memoryDB.goals.filter(g => g.userId === userId);
    }
  }

  async getGoal(goalId, userId) {
    if (this.isMongoConnected) {
      return await this.db.collection('goals').findOne({ _id: goalId, userId });
    } else {
      return memoryDB.goals.find(g => g.id === goalId && g.userId === userId);
    }
  }

  async createGoal(goalData) {
    const newGoal = {
      ...goalData,
      _id: goalData.id,
      createdAt: new Date()
    };

    if (this.isMongoConnected) {
      await this.db.collection('goals').insertOne(newGoal);
    } else {
      memoryDB.goals.push(newGoal);
    }
    
    return newGoal;
  }

  async updateGoal(goalId, userId, updateData) {
    if (this.isMongoConnected) {
      const result = await this.db.collection('goals').findOneAndUpdate(
        { _id: goalId, userId },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      return result.value;
    } else {
      const goal = memoryDB.goals.find(g => g.id === goalId && g.userId === userId);
      if (goal) {
        Object.assign(goal, updateData);
        return goal;
      }
      return null;
    }
  }

  // Get database status
  getStatus() {
    return {
      type: this.isMongoConnected ? 'MongoDB' : 'In-Memory',
      connected: this.isMongoConnected,
      message: this.isMongoConnected 
        ? 'Connected to MongoDB Atlas' 
        : 'Using in-memory storage (data will be lost on restart)'
    };
  }
}

// Create singleton instance
const dbAdapter = new DatabaseAdapter();

module.exports = dbAdapter;