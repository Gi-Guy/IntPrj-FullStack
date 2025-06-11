import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

  const formatDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return `${hrs}h ${rem}m`;
  };

  const getTaskTitle = (id: string) => tasks.find(t => t._id === id)?.title || '-';
  const getTaskCategory = (id: string) => tasks.find(t => t._id === id)?.category || '-';

  return (
    <div className="page">
      <h2>Task Analytics</h2>
      <table className="analytics-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Start</th>
            <th>End</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {timeLogs.map((log) => (
            <tr key={log._id}>
              <td>{getTaskTitle(log.taskId)}</td>
              <td>{getTaskCategory(log.taskId)}</td>
              <td>{new Date(log.startTime).toLocaleString()}</td>
              <td>{new Date(log.endTime).toLocaleString()}</td>
              <td>{formatDuration(log.startTime, log.endTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
