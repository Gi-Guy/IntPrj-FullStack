import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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
