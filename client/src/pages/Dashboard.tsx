import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskEditForm from '../components/TaskEditForm';
import TagForm from '../components/TagForm';
import TaskForm from '../components/TaskForm';
import CategoryBar from '../components/CategoryBar';
import '../styles/dashboard.scss';

export type Task = {
  _id: string;
  title: string;
  description: string;
  tag: string;
  category: string;
  status: 'todo' | 'in-progress' | 'done';
};

export type Tag = {
  _id: string;
  name: string;
  color: string;
};

export type Category = {
  _id: string;
  name: string;
  color?: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#cccccc');
  const [selectedCategory, setSelectedCategory] = useState('GENERAL');
  // const [selectedStatus, setSelectedStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');
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

  const handleAddTask = async (data: Omit<Task, '_id' | 'status'>) => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const res = await axios.post('/tasks', { ...data, status: 'todo' }, { headers });
      setTasks((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to add task', err);
    }
  };

  const handleAddTag = async (tagData: { name: string; color: string }) => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const res = await axios.post('/tags', tagData, { headers });
      setTags((prev) => [...prev, res.data]);
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

  const visibleTasks = filteredTasks.filter(task => task.status !== 'done');
  const completedTasks = filteredTasks.filter(task => task.status === 'done');

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      await axios.put(`/tasks/${taskId}`, { status: newStatus }, { headers });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

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

      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        newCategoryColor={newCategoryColor}
        setNewCategoryColor={setNewCategoryColor}
        onAdd={handleAddCategory}
        onDelete={handleDeleteCategory}
        showAddControls={true}
      />

      {showTaskForm && (
        <TaskForm
          tags={tags}
          categories={categories}
          onAdd={handleAddTask}
        />
      )}

      {showTagForm && (
        <TagForm onAdd={handleAddTag} />
      )}

      <div className="task-grid">
        {visibleTasks.map((task) => {
          const categoryColor = categories.find(c => c.name === task.category)?.color || '#ccc';
          return (
            <div key={task._id} className={`task-card ${task.status === 'done' ? 'done' : ''}`}>
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
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value as Task['status'])}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                    <button className="edit" onClick={() => setEditingTaskId(task._id)}>Edit</button>
                    <button className="danger" onClick={() => handleDelete(task._id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {completedTasks.length > 0 && (
        <>
          <h3>Completed Tasks</h3>
          <div className="task-grid completed">
            {completedTasks.map((task) => (
              <div key={task._id} className="task-card done">
                <h3>{task.title}</h3>
                <p>{task.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
