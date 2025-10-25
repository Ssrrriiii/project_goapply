import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route imports
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';

const app: Application = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});