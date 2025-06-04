import { Request, Response } from 'express';
import { TimeLog } from '../models/TimeLog';

export const getTimeLogs = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const logs = await TimeLog.find({ userId });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs', error: err });
  }
};

export const createTimeLog = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const timeLog = new TimeLog({ ...req.body, userId });
    const saved = await timeLog.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create log', error: err });
  }
};

export const deleteTimeLog = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    await TimeLog.findOneAndDelete({ _id: id, userId });
    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete log', error: err });
  }
};
