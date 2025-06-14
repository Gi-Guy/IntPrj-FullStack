import { Request, Response } from 'express';
import { Task } from '../models/Task';
import { TimeLog } from '../models/TimeLog';
import { Types } from 'mongoose';

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

    const { title, description, tag, category, status } = req.body;
    const task = new Task({
      title,
      description,
      tag,
      category: category || 'General',
      status: status || 'todo',
      userId
    });
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
    await TimeLog.deleteMany({ taskId: id });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, tag, category, status } = req.body;
    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const previousStatus = task.status;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (tag !== undefined) task.tag = tag;
    if (category !== undefined) task.category = category;
    if (status !== undefined) task.status = status;

    if (previousStatus !== 'done' && status === 'done') {
      const now = new Date();
      await TimeLog.create({
        userId: task.userId as Types.ObjectId,
        taskId: task._id as Types.ObjectId,
        startTime: task.createdAt,
        endTime: now
      });
    } else if (previousStatus === 'done' && status !== 'done') {
      await TimeLog.deleteMany({ taskId: task._id });
    }

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err });
  }
};
