import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import bookingRoutes from './routes/bookingRoutes';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// CORS configuration
app.use(cors({
  origin: [
    'https://booking-system25.vercel.app',
    'http://localhost:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Routes
app.use('/api', bookingRoutes);

// Add detailed logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Add MongoDB connection check endpoint
app.get('/api/db-status', (req, res) => {
  const status = mongoose.connection.readyState;
  let statusText = '';
  switch(status) {
    case 0: statusText = 'disconnected'; break;
    case 1: statusText = 'connected'; break;
    case 2: statusText = 'connecting'; break;
    case 3: statusText = 'disconnecting'; break;
  }
  
  res.status(200).json({
    success: status === 1,
    database: statusText,
    message: `MongoDB connection status: ${statusText}`
  });
});

// 404 handler 
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`DB Status: http://localhost:${PORT}/api/db-status`);
});