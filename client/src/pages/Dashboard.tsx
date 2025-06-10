import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskEditForm from '../components/TaskEditForm';
import '../styles/dashboard.scss';

type Task = {
  _id: string;
  title: string;
  description: string;
  tag: string;
  category: string;
};

type Tag = {
  _id: string;
  name: string;
  color: string;
};

type Category = {
  _id: string;
  name: string;
  color?: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState('GENERAL');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#cccccc');
  const [selectedCategory, setSelectedCategory] = useState('GENERAL');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchTasks = useCallback(async () => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const res = await axios.get('/tasks', { headers });
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const res = await axios.get('/tags', { headers });
      setTags(res.data);
    } catch (err) {
      console.error('Failed to fetch tags', err);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const res = await axios.get('/categories', { headers });
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchTags();
    fetchCategories();
  }, [fetchTasks, fetchTags, fetchCategories]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const res = await axios.post('/tasks', { title, description, tag, category }, { headers });
      setTasks((prev) => [...prev, res.data]);
      setTitle('');
      setDescription('');
      setTag('');
      setCategory('GENERAL');
    } catch (err) {
      console.error('Failed to add task', err);
    }
  };

  const handleAddTag = async () => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const res = await axios.post('/tags', { name: newTagName, color: newTagColor }, { headers });
      setTags((prev) => [...prev, res.data]);
      setNewTagName('');
      setNewTagColor('');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        alert('Tag already exists.');
      } else {
        console.error('Failed to add tag', err);
      }
    }
  };

  const handleAddCategory = async () => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const color = newCategoryColor || '#cccccc';
      const res = await axios.post('/categories', { name: newCategoryName, color }, { headers });
      if (res.data) {
        setCategories((prev) => [...prev, res.data]);
      }
      setNewCategoryName('');
      setNewCategoryColor('#cccccc');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || 'Unknown error';
        alert(`Failed to add category: ${msg}`);
      } else {
        console.error('Failed to add category', err);
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      await axios.delete(`/categories/${id}`, { headers });
      fetchCategories();
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete category', err);
    }
  };

  const getTagColorClass = (tagName: string) => {
    const tag = tags.find((t) => t.name === tagName);
    if (!tag || typeof tag.color !== 'string') return '';
    return `tag-${tag.color.toLowerCase()}`;
  };

  const filteredTasks = selectedCategory === 'GENERAL'
    ? tasks
    : tasks.filter(task => task.category === selectedCategory);

  async function handleDelete(_id: string): Promise<void> {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      await axios.delete(`/tasks/${_id}`, { headers });
      setTasks((prev) => prev.filter(task => task._id !== _id));
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  }

  async function handleUpdateTask(updatedTask: Task): Promise<void> {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      await axios.put(`/tasks/${updatedTask._id}`, updatedTask, { headers });
      setTasks((prev) => prev.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
      setEditingTaskId(null);
    } catch (err) {
      console.error('Failed to update task', err);
    }
  }

  return (
    <div className="page">
      <nav className="navbar">
        <h2>My Tasks</h2>
        <button className="primary-button" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="form-toggle-buttons">
        <button className="primary-button" onClick={() => setShowTaskForm(s => !s)}>
          {showTaskForm ? 'Close Task Form' : 'Add Task'}
        </button>
        <button className="primary-button" onClick={() => setShowTagForm(s => !s)}>
          {showTagForm ? 'Close Tag Form' : 'Add Tag'}
        </button>
      </div>

      <div className="category-bar">
        <button
          className={selectedCategory === 'GENERAL' ? 'selected' : ''}
          onClick={() => setSelectedCategory('GENERAL')}
          style={{ backgroundColor: '#999' }}
        >
          GENERAL
        </button>
        {categories.filter(c => c.name.toUpperCase() !== 'GENERAL').map(cat => (
          <div key={cat._id} className="category-item">
            <button
              className={selectedCategory === cat.name ? 'selected' : ''}
              onClick={() => setSelectedCategory(cat.name)}
              style={{ backgroundColor: cat.color || '#ccc' }}
            >
              {cat.name}
            </button>
            <button className="edit" onClick={() => handleDeleteCategory(cat._id)}>❌</button>
          </div>
        ))}
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
        <button className="primary-button" onClick={handleAddCategory}>Add</button>
      </div>

      <form className={`form ${!showTaskForm ? 'collapsed' : ''}`} onSubmit={handleAddTask} style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
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

      <div className={`form ${!showTagForm ? 'collapsed' : ''}`} style={{ maxWidth: '1000px', margin: '1rem auto' }}>
        <input type="text" placeholder="New Tag" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} />
        <select value={newTagColor} onChange={(e) => setNewTagColor(e.target.value)}>
          <option value="">Select Color</option>
          <option value="red">Red</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
          <option value="yellow">Yellow</option>
        </select>
        <button className="primary-button" onClick={handleAddTag}>Add Tag</button>
      </div>

      <div className="task-grid">
        {filteredTasks.map((task) => {
          const categoryColor = categories.find(c => c.name === task.category)?.color || '#ccc';
          return (
            <div key={task._id} className="task-card">
              {editingTaskId === task._id ? (
                <TaskEditForm
                  task={task}
                  tags={tags}
                  categories={categories}
                  onCancel={() => setEditingTaskId(null)}
                  onSave={handleUpdateTask}
                />
              ) : (
                <>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <span className={`tag ${getTagColorClass(task.tag)}`}>{task.tag}</span>
                  <span className="tag category" style={{ backgroundColor: categoryColor }}>{task.category}</span>
                  <div className="task-actions">
                    <button className="edit" onClick={() => setEditingTaskId(task._id)}>Edit</button>
                    <button className="danger" onClick={() => handleDelete(task._id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}