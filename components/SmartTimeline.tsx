import React from 'react';
import { DailyPlan, TaskType } from '../types';
import { Clock, Book, Coffee, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SmartTimelineProps {
  plans: DailyPlan[];
}

const SmartTimeline: React.FC<SmartTimelineProps> = ({ plans }) => {
  const { themeConfig } = useTheme();
  
  const getIcon = (type: TaskType) => {
    switch (type) {
      case TaskType.STUDY: return <Book size={18} className="text-blue-600 dark:text-blue-400" />;
      case TaskType.BREAK: return <Coffee size={18} className={`${themeConfig.text}`} />;
      case TaskType.DEADLINE: return <AlertCircle size={18} className="text-rose-600 dark:text-rose-400" />;
      case TaskType.CLASS: return <Clock size={18} className="text-purple-600 dark:text-purple-400" />;
      default: return <CheckCircle2 size={18} className="text-slate-500 dark:text-slate-400" />;
    }
  };

  const getCardStyle = (type: TaskType) => {
    switch (type) {
      case TaskType.DEADLINE: return "border-l-4 border-l-rose-500 bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-100/50 dark:hover:bg-rose-900/20";
      case TaskType.BREAK: return `border-l-4 ${themeConfig.border} ${themeConfig.bgLight} dark:bg-slate-800 hover:opacity-90`; // Use theme color for break
      case TaskType.STUDY: return "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100/50 dark:hover:bg-blue-900/20";
      default: return "border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100/50 dark:hover:bg-purple-900/20";
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 sticky top-0 bg-transparent py-3 z-10 flex items-center gap-2">
        <span className={`w-2 h-8 ${themeConfig.primary} rounded-full`}></span>
        Lịch Trình Tối Ưu
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((day, index) => (
          <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform duration-300">
            <div className={`p-4 font-bold flex justify-between items-center ${
              day.stressScore > 75 ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}>
              <span className="text-lg">{day.day}</span>
              <span className="text-sm font-normal opacity-70 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-600">{day.date}</span>
            </div>
            
            <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
              {day.tasks.length === 0 ? (
                <div className="text-slate-400 text-center text-sm py-8 italic bg-slate-50/50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                    Thư giãn & Nghỉ ngơi trọn vẹn
                </div>
              ) : (
                day.tasks.map((task, i) => (
                  <div key={i} className={`p-3.5 rounded-lg text-sm flex gap-3 transition-colors shadow-sm ${getCardStyle(task.type as TaskType)}`}>
                    <div className="mt-0.5">{getIcon(task.type as TaskType)}</div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">{task.time}</div>
                      <div className="text-slate-700 dark:text-slate-300 font-medium">{task.activity}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{task.durationMinutes} phút</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartTimeline;