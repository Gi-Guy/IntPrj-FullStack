

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

interface Props {
  timeLogs: TimeLog[];
  tasks: Task[];
}

export default function AnalyticsTable({ timeLogs, tasks }: Props) {
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
  );
}
