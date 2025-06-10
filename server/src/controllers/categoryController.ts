import { Request, Response } from 'express';
import { Category } from '../models/Category';
import { Task } from '../models/Task';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const categories = await Category.find({ userId });

    const generalCategory = { _id: 'general-default', name: 'GENERAL' };
    const result = [generalCategory, ...categories];

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: err });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, color } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Category name is required' });
    }

    if (name === 'GENERAL') {
      return res.status(400).json({ message: 'GENERAL is a reserved category' });
    }

    const exists = await Category.findOne({ name, userId });
    if (exists) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    const category = new Category({ name, userId, color });
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create category', error: err });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const categoryDoc = await Category.findOneAndDelete({ _id: id, userId }).lean();
    if (!categoryDoc) return res.status(404).json({ message: 'Category not found' });

    if (categoryDoc.name === 'GENERAL') {
      return res.status(400).json({ message: 'Cannot delete GENERAL category' });
    }
    await Task.updateMany({ userId, category: categoryDoc.name }, { $set: { category: 'GENERAL' } });

    res.json({ message: 'Category deleted and tasks reassigned to GENERAL' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category', error: err });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { name, color } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Category name is required' });
    }

    if (name === 'GENERAL') {
      return res.status(400).json({ message: 'GENERAL is a reserved category' });
    }

    const existing = await Category.findOne({ name, userId });
    if (existing && existing._id.toString() !== id) {
      return res.status(409).json({ message: 'Another category with the same name already exists' });
    }

    const updated = await Category.findOneAndUpdate(
      { _id: id, userId },
      { name, color },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Category not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update category', error: err });
  }
};
