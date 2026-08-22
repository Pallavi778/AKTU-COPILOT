const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    // "Mongoose, connect my Node.js application to this MongoDB database."
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aktu-copilot', {
      serverSelectionTimeoutMS: 3000 // Timeout in 3 seconds to avoid blocking startup,
      //"When Mongoose is trying to find/select a MongoDB server, don't keep trying beyond this configured timeout."
    });
    console.log(`MongoDB Host: ${conn.connection.host}`);
console.log(`MongoDB Database: ${conn.connection.name}`);
    isConnected = true;
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`);
    console.log('⚠️ Running server in DATABASE-LESS IN-MEMORY FALLBACK MODE. Data will be saved in RAM.');
    isConnected = false;
  }
};

const getStatus = () => isConnected;

module.exports = { connectDB, getStatus };
