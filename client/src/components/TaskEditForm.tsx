// client/src/components/TaskEditForm.tsx

import { useState } from 'react';

interface TaskEditFormProps {
  task: {
    _id: string;
    title: string;
    description: string;
    tag: string;
    category: string;
  };
  tags: { _id: string; name: string; color: string }[];
  categories: { _id: string; name: string; color?: string }[];
  onCancel: () => void;
  onSave: (updatedTask: any) => void;
}

export default function TaskEditForm({ task, tags, categories, onCancel, onSave }: TaskEditFormProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [tag, setTag] = useState(task.tag);
  const [category, setCategory] = useState(task.category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...task, title, description, tag, category });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
        rows={10}
        style={{ resize: 'vertical' }}
      />
      <select value={tag} onChange={(e) => setTag(e.target.value)}>
        <option value="">Select Tag</option>
        {tags.map((t) => (
          <option key={t._id} value={t.name}>{t.name}</option>
        ))}
      </select>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="GENERAL">GENERAL</option>
        {categories.map((c) => (
          <option key={c._id} value={c.name}>{c.name}</option>
        ))}
      </select>
      <div className="form-toggle-buttons">
        <button type="submit" className="primary-button">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}