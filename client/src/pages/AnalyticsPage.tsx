import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StatusPieChart from '../components/StatusPieChart';
import AnalyticsTable from '../components/AnalyticsTable';
import '../styles/analytics.scss';

interface TimeLog {
  _id: string;
  taskId: string;
  startTime: string;
  endTime: string;
}

interface Task {
  _id: string;
  title: string;
  category: string;
  status: 'todo' | 'in-progress' | 'done';
}

export default function AnalyticsPage() {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    const fetchData = async () => {
      const headers = getAuthHeader();
      if (!headers) return;

      try {
        const [logsRes, tasksRes] = await Promise.all([
          axios.get('/timelogs', { headers }),
          axios.get('/tasks', { headers })
        ]);

        setTimeLogs(logsRes.data);
        setTasks(tasksRes.data);
      } catch (err) {
        console.error('Failed to fetch analytics data', err);
      }
    };

    fetchData();
  }, []);

  const pieData = ['todo', 'in-progress', 'done'].map(status => ({
    name: status,
    value: tasks.filter(t => t.status === status).length
  }));

  return (
    <div className="page">
      <h2>Task Analytics</h2>
      <StatusPieChart data={pieData} />
      <AnalyticsTable timeLogs={timeLogs} tasks={tasks} />
    </div>
  );
}
