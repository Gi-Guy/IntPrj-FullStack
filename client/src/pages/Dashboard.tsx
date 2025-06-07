import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/global.scss';

type Task = {
  _id: string;
  title: string;
  description: string;
  tag: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="page">
      <nav className="navbar">
        <h2>My Tasks</h2>
        <button className="primary-button" onClick={handleLogout}>Logout</button>
      </nav>
      <div className="task-grid">
        {tasks.map(task => (
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
