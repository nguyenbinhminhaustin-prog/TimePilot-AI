import React from 'react';
import { DailyPlan, TaskType } from '../types';
import { Clock, Book, Coffee, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SmartTimelineProps {
  plans: DailyPlan[];
}

const SmartTimeline: React.FC<SmartTimelineProps> = ({ plans }) => {
  
  const getIcon = (type: TaskType) => {
    switch (type) {
      case TaskType.STUDY: return <Book size={16} className="text-blue-400" />;
      case TaskType.BREAK: return <Coffee size={16} className="text-green-400" />;
      case TaskType.DEADLINE: return <AlertCircle size={16} className="text-red-400" />;
      case TaskType.CLASS: return <Clock size={16} className="text-purple-400" />;
      default: return <CheckCircle2 size={16} className="text-slate-400" />;
    }
  };

  const getCardStyle = (type: TaskType) => {
    switch (type) {
      case TaskType.DEADLINE: return "border-l-4 border-l-red-500 bg-red-500/10";
      case TaskType.BREAK: return "border-l-4 border-l-green-500 bg-green-500/10";
      case TaskType.STUDY: return "border-l-4 border-l-blue-500 bg-blue-500/10";
      default: return "border-l-4 border-l-purple-500 bg-purple-500/10";
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white sticky top-0 bg-slate-950 py-2 z-10">Lịch Trình Tối Ưu</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((day, index) => (
          <div key={index} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
            <div className={`p-3 font-medium flex justify-between items-center ${
              day.stressScore > 75 ? 'bg-red-900/30 text-red-200' : 'bg-slate-800 text-slate-200'
            }`}>
              <span>{day.day}</span>
              <span className="text-xs opacity-70">{day.date}</span>
            </div>
            
            <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
              {day.tasks.length === 0 ? (
                <div className="text-slate-500 text-center text-sm py-4">Ngày nghỉ ngơi</div>
              ) : (
                day.tasks.map((task, i) => (
                  <div key={i} className={`p-3 rounded-lg text-sm flex gap-3 ${getCardStyle(task.type as TaskType)}`}>
                    <div className="mt-0.5">{getIcon(task.type as TaskType)}</div>
                    <div>
                      <div className="font-semibold text-slate-200">{task.time}</div>
                      <div className="text-slate-300">{task.activity}</div>
                      <div className="text-xs text-slate-500 mt-1">{task.durationMinutes} phút</div>
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
