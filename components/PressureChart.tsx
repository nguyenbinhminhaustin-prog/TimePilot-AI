import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DailyPlan } from '../types';

interface PressureChartProps {
  data: DailyPlan[];
}

const PressureChart: React.FC<PressureChartProps> = ({ data }) => {
  const chartData = data.map(day => ({
    name: day.day,
    stress: day.stressScore,
  }));

  const getBarColor = (score: number) => {
    if (score < 40) return '#4ade80'; // Green
    if (score < 70) return '#facc15'; // Yellow
    return '#f87171'; // Red
  };

  return (
    <div className="w-full h-[300px] bg-slate-900 p-4 rounded-xl border border-slate-800">
      <h3 className="text-lg font-semibold text-white mb-4">Bản đồ Áp lực (Stress Map)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
            cursor={{ fill: 'transparent' }}
          />
          <Bar dataKey="stress" radius={[4, 4, 0, 0]} barSize={40}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.stress)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PressureChart;
