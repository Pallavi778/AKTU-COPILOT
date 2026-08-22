const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorMiddleware');


// Connect to Database
connectDB();

const app = express();
app.use(cors({
  origin: [
    // 'https://aktu-copilot.vercel.app'
    'https://aktu-copilot.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// app.options('*', cors());
// // Add this line right after to handle preflight:
// app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files (uploaded PDFs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AKTU Academic Copilot API Server' });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

server.on('close', () => {
  console.log('❌ SERVER CLOSED');
});

process.on('exit', (code) => {
  console.log(`❌ Process exit event with code: ${code}`);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
});