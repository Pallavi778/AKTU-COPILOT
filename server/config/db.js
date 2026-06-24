const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aktu-copilot', {
      serverSelectionTimeoutMS: 3000 // Timeout in 3 seconds to avoid blocking startup
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`);
    console.log('⚠️ Running server in DATABASE-LESS IN-MEMORY FALLBACK MODE. Data will be saved in RAM.');
    isConnected = false;
  }
};

const getStatus = () => isConnected;

module.exports = { connectDB, getStatus };
