import { Request, Response } from 'express';
import { User } from '../models/User';

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ fullName: user.fullName, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err });
  }
};
