const { MongoClient } = require('mongodb');

let client;
let db;

const connectDB = async () => {
  try {
    if (db) return db;
    
    // Use MongoDB URI from environment variable or fallback to in-memory
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.log('No MongoDB URI found, using in-memory storage');
      return null;
    }
    
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    await client.connect();
    console.log('Connected to MongoDB');
    
    db = client.db('spendwise');
    
    // Create indexes
    await createIndexes();
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return null;
  }
};

const createIndexes = async () => {
  try {
    // Users collection indexes
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    
    // Other collections indexes
    await db.collection('income').createIndex({ userId: 1 });
    await db.collection('expenses').createIndex({ userId: 1 });
    await db.collection('goals').createIndex({ userId: 1 });
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

const getDB = () => db;

const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
};

module.exports = {
  connectDB,
  getDB,
  closeDB
};