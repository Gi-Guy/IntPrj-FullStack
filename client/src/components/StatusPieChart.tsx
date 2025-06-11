import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  data: { name: string; value: number }[];
}

const COLORS = [
  getComputedStyle(document.documentElement).getPropertyValue('--analytics-color-1').trim(),
  getComputedStyle(document.documentElement).getPropertyValue('--analytics-color-2').trim(),
  getComputedStyle(document.documentElement).getPropertyValue('--analytics-color-3').trim(),
];

export default function StatusPieChart({ data }: Props) {
  return (
    <div className="analytics-pie-container">
      <h3>Status</h3>
      <div className="analytics-pie-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="40%"
              labelLine={false}
              outerRadius={100}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
