import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/global.scss';

type Task = {
  _id: string;
  title: string;
  description: string;
  tag: string;
};

type Tag = {
  _id: string;
  name: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState('');

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
      const res = await axios.get('/tasks', {
        headers,
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const res = await axios.get('/tags', {
        headers,
      });
      setTags(res.data);
    } catch (err) {
      console.error('Failed to fetch tags', err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchTags();
  }, [fetchTasks, fetchTags]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const res = await axios.post(
        '/tasks',
        { title, description, tag },
        { headers }
      );
      setTasks((prev) => [...prev, res.data]);
      setTitle('');
      setDescription('');
      setTag('');
    } catch (err) {
      console.error('Failed to add task', err);
    }
  };

  const handleAddTag = async () => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      const res = await axios.post(
        '/tags',
        { name: newTag },
        { headers }
      );
      setTags((prev) => [...prev, res.data]);
      setNewTag('');
    } catch (err) {
      console.error('Failed to add tag', err);
    }
  };

  return (
    <div className="page">
      <nav className="navbar">
        <h2>My Tasks</h2>
        <button className="primary-button" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <form className="form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select value={tag} onChange={(e) => setTag(e.target.value)} required>
          <option value="" disabled>
            Select Tag
          </option>
          {tags.map((t) => (
            <option key={t._id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
        <button type="submit" className="primary-button">
          Add Task
        </button>
      </form>

      <div className="form">
        <input
          type="text"
          placeholder="New Tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <button className="primary-button" onClick={handleAddTag}>
          Add Tag
        </button>
      </div>

      <div className="task-grid">
        {tasks.map((task) => (
          <div key={task._id} className="task-card">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <span className="tag">{task.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
