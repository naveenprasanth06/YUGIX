const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const settingsRoutes = require('./routes/settings');

// Initialize Express app
const app = express();
app.use(morgan('dev'));
// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow both Vite and React default ports
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    // Default local MongoDB connection string
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yugixx';
    
    console.log('Attempting to connect to MongoDB at:', mongoURI);
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('Please make sure:');
    console.log('1. MongoDB is installed on your PC');
    console.log('2. MongoDB service is running');
    console.log('3. You can connect to MongoDB using mongosh');
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', authRoutes);
app.use('/api', dashboardRoutes);
app.use('/api/settings',settingsRoutes)

// Basic route to test server
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}); 