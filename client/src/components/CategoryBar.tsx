
import type { Category } from '../pages/Dashboard';

type Props = {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  newCategoryName: string;
  setNewCategoryName: (val: string) => void;
  newCategoryColor: string;
  setNewCategoryColor: (val: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  showAddControls?: boolean;
};

export default function CategoryBar({
  categories,
  selectedCategory,
  setSelectedCategory,
  newCategoryName,
  setNewCategoryName,
  newCategoryColor,
  setNewCategoryColor,
  onAdd,
  onDelete,
  showAddControls = true
}: Props) {
  return (
    <div className="category-bar">
      <button
        className={selectedCategory === 'GENERAL' ? 'selected' : ''}
        onClick={() => setSelectedCategory('GENERAL')}
        style={{ backgroundColor: '#999' }}
      >
        GENERAL
      </button>
      {categories
        .filter((c) => c.name.toUpperCase() !== 'GENERAL')
        .map((cat) => (
          <div key={cat._id} className="category-item">
            <button
              className={selectedCategory === cat.name ? 'selected' : ''}
              onClick={() => setSelectedCategory(cat.name)}
              style={{ backgroundColor: cat.color || '#ccc' }}
            >
              {cat.name}
            </button>
            <button className="edit" onClick={() => onDelete(cat._id)}>❌</button>
          </div>
        ))}

      {showAddControls && (
        <div className="category-add">
          <input
            type="text"
            placeholder="New Category"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <input
            type="color"
            value={newCategoryColor}
            onChange={(e) => setNewCategoryColor(e.target.value)}
          />
          <button className="primary-button" onClick={onAdd}>Add</button>
        </div>
      )}
    </div>
  );
}