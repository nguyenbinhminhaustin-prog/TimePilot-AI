import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DailyPlan } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface PressureChartProps {
  data: DailyPlan[];
}

const PressureChart: React.FC<PressureChartProps> = ({ data }) => {
  const { mode, themeConfig } = useTheme();
  
  const chartData = data.map(day => ({
    name: day.day,
    stress: day.stressScore,
  }));

  const getBarColor = (score: number) => {
    if (score < 40) return '#10b981'; // Emerald 500
    if (score < 70) return '#f59e0b'; // Amber 500
    return '#f43f5e'; // Rose 500
  };

  const axisColor = mode === 'dark' ? '#94a3b8' : '#64748b';
  const tooltipBg = mode === 'dark' ? '#1e293b' : '#fff';
  const tooltipBorder = mode === 'dark' ? '#334155' : '#e2e8f0';
  const tooltipText = mode === 'dark' ? '#f1f5f9' : '#1e293b';

  return (
    <div className="w-full h-[350px] bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <h3 className={`text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 pl-2 border-l-4 ${themeConfig.border.replace('border-', 'border-l-')}`}>Bản đồ Áp lực (Stress Map)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis 
            dataKey="name" 
            stroke={axisColor}
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis 
            stroke={axisColor}
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              borderColor: tooltipBorder, 
              color: tooltipText, 
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            cursor={{ fill: mode === 'dark' ? '#334155' : '#f1f5f9' }}
          />
          <Bar dataKey="stress" radius={[6, 6, 0, 0]} barSize={40}>
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