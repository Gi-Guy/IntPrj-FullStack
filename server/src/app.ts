import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
// Import routes
import authRoutes from './routes/auth';
import tasksRoutes from './routes/tasks';
import categoriesRoutes from './routes/categories';
import tagsRoutes from './routes/tags';
import timeLogsRoutes from './routes/timeLogs';
import taskRoutes from './routes/taskRoutes';
import { authenticate } from './middleware/authMiddleware';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// apps
app.use('/api/categories', authenticate, categoriesRoutes);
app.use('/api/tasks', authenticate, taskRoutes);
app.use('/api/tags', authenticate, tagsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/timeLogs', timeLogsRoutes);
app.use('/api/tasks', taskRoutes);
app.use('api/categories', categoriesRoutes);
//app.use('/api/tasks', tasksRoutes);
//app.use('/api/tasks', taskRoutes);

app.get('/', (_req, res) => {
  res.send('API is running...');
});

const MONGO_URI = process.env.MONGO_URI || '';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

export default app;