import { useState } from 'react';

type Props = {
  onAdd: (task: { title: string; description: string; tag: string; category: string }) => void;
  tags: { _id: string; name: string }[];
  categories: { _id: string; name: string }[];
};

export default function TaskForm({ onAdd, tags, categories }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [category, setCategory] = useState('GENERAL');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ title, description, tag, category });
    setTitle('');
    setDescription('');
    setTag('');
    setCategory('GENERAL');
  };

  return (
    <form className="form" onSubmit={handleSubmit} style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        rows={4}
      />
      <select value={tag} onChange={(e) => setTag(e.target.value)} required>
        <option value="" disabled>Select Tag</option>
        {tags.map((t) => (
          <option key={t._id} value={t.name}>{t.name}</option>
        ))}
      </select>
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="GENERAL">GENERAL</option>
        {categories.filter(c => c.name.toUpperCase() !== 'GENERAL').map((c) => (
          <option key={c._id} value={c.name}>{c.name}</option>
        ))}
      </select>
      <button type="submit" className="primary-button">Add Task</button>
    </form>
  );
}