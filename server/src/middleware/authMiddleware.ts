// server/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { userId: string };
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (typeof decoded === 'object' && 'userId' in decoded) {
      req.user = { userId: (decoded as any).userId };
      next();
    } else {
      res.status(403).json({ message: 'Token structure invalid' });
    }
  } catch (err) {
    res.status(403).json({ message: 'Token invalid or expired' });
  }
};
