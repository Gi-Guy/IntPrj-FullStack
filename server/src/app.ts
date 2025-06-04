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

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// apps
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/timeLogs', timeLogsRoutes);

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