import { Request, Response } from 'express';
import { Task } from '../models/Task';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const task = new Task({ ...req.body, userId });
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: err });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    await Task.findOneAndDelete({ _id: id, userId });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err });
  }
};