import { useState } from 'react';

interface CategoryFormProps {
  onAdd: (data: { name: string; color: string }) => void;
}

export default function CategoryForm({ onAdd }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#cccccc');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), color });
    setName('');
    setColor('#cccccc');
  };

  return (
    <form className="form" onSubmit={handleSubmit} style={{ maxWidth: '1000px', margin: '1rem auto' }}>
      <input
        type="text"
        placeholder="New Category"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <button type="submit" className="primary-button">Add</button>
    </form>
  );
}