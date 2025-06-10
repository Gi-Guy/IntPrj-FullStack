
import { useState } from 'react';

interface TagFormProps {
  onAdd: (tag: { name: string; color: string }) => void;
}

export default function TagForm({ onAdd }: TagFormProps) {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName || !newTagColor) return;
    onAdd({ name: newTagName, color: newTagColor });
    setNewTagName('');
    setNewTagColor('');
  };

  return (
    <form className="form" onSubmit={handleSubmit} style={{ maxWidth: '1000px', margin: '1rem auto' }}>
      <input
        type="text"
        placeholder="New Tag"
        value={newTagName}
        onChange={(e) => setNewTagName(e.target.value)}
      />
      <select value={newTagColor} onChange={(e) => setNewTagColor(e.target.value)}>
        <option value="">Select Color</option>
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
        <option value="yellow">Yellow</option>
      </select>
      <button className="primary-button" type="submit">Add Tag</button>
    </form>
  );
}