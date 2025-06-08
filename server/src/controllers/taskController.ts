import { Request, Response } from 'express';
import { Task } from '../models/Task';

interface AuthRequest extends Request {
  user?: { userId: string };
}

export const getMyTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Missing userId' });

    const { title, description, tag, category } = req.body;
    const task = new Task({ title, description, tag, category: category || 'General', userId });
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: err });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;
    await Task.findOneAndDelete({ _id: id, userId });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err });
  }
};