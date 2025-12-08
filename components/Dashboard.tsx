import React from 'react';
import { AIAnalysisResult, StudentProfile } from '../types';
import PressureChart from './PressureChart';
import SmartTimeline from './SmartTimeline';
import { AlertTriangle, Lightbulb, RefreshCcw, ArrowLeft } from 'lucide-react';

interface DashboardProps {
  result: AIAnalysisResult;
  studentName: string;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ result, studentName, onReset }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Xin chào, <span className="text-cyan-400">{studentName}</span> 👋</h2>
          <p className="text-slate-400 mt-1">Dưới đây là kế hoạch hành động tối ưu cho tuần này.</p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
        >
          <ArrowLeft size={16} /> Nhập lại dữ liệu
        </button>
      </div>

      {/* AI Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Analysis */}
        <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 p-6 rounded-xl border border-indigo-500/30">
          <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2 mb-3">
            <Lightbulb size={20} /> Phân Tích Tổng Quan
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {result.overallAnalysis}
          </p>
        </div>

        {/* High Pressure Alert */}
        <div className="bg-gradient-to-br from-red-900/30 to-slate-900 p-6 rounded-xl border border-red-500/30">
          <h3 className="text-lg font-semibold text-red-300 flex items-center gap-2 mb-3">
            <AlertTriangle size={20} /> Cảnh Báo Quá Tải
          </h3>
          {result.highPressureDays.length > 0 ? (
             <div className="space-y-2">
               <p className="text-slate-300 text-sm">Cần chú ý đặc biệt vào các ngày:</p>
               <div className="flex flex-wrap gap-2">
                 {result.highPressureDays.map(day => (
                   <span key={day} className="px-2 py-1 bg-red-500/20 text-red-200 text-xs rounded border border-red-500/50">
                     {day}
                   </span>
                 ))}
               </div>
               <p className="text-slate-400 text-xs mt-2">Hệ thống đã tự động chèn thêm thời gian nghỉ ngơi vào những ngày này.</p>
             </div>
          ) : (
            <p className="text-green-400 text-sm">Lịch trình hiện tại khá cân bằng. Không có ngày nào quá tải nghiêm trọng.</p>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold text-cyan-300 mb-3">Gợi Ý Học Tập</h3>
          <ul className="space-y-2">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-2 text-sm text-slate-300">
                <span className="text-cyan-500">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Charts & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
           <PressureChart data={result.dailyPlans} />
        </div>
        <div className="lg:col-span-3">
           <SmartTimeline plans={result.dailyPlans} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
