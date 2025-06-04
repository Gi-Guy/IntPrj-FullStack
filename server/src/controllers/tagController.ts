import { Request, Response } from 'express';
import { Tag } from '../models/Tag';

export const getTags = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const tags = await Tag.find({ userId });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tags', error: err });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const tag = new Tag({ ...req.body, userId });
    const saved = await tag.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create tag', error: err });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    await Tag.findOneAndDelete({ _id: id, userId });
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete tag', error: err });
  }
};
