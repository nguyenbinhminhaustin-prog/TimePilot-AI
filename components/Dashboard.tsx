import React, { useState } from 'react';
import { AIAnalysisResult } from '../types';
import PressureChart from './PressureChart';
import SmartTimeline from './SmartTimeline';
import { AlertTriangle, Lightbulb, ArrowLeft, MessageSquarePlus, X, Send } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardProps {
  result: AIAnalysisResult;
  studentName: string;
  onReset: () => void;
  onAdjust: (feedback: string) => void;
  isAdjusting: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ result, studentName, onReset, onAdjust, isAdjusting }) => {
  const { themeConfig } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      onAdjust(feedback);
      setShowModal(false);
      setFeedback("");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative">
      {/* Loading Overlay for Adjusting */}
      {isAdjusting && (
        <div className="absolute inset-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-4">
             <div className={`w-10 h-10 border-4 border-slate-200 dark:border-slate-700 border-t-current ${themeConfig.text} rounded-full animate-spin`}></div>
             <p className={`${themeConfig.text} font-medium animate-pulse`}>Đang tối ưu lại lịch trình...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Xin chào, <span className={themeConfig.text}>{studentName}</span> 👋</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Dưới đây là kế hoạch hành động tối ưu cho tuần này.</p>
        </div>
        <div className="flex gap-3">
            <button 
            onClick={() => setShowModal(true)}
            disabled={isAdjusting}
            className={`flex items-center gap-2 px-5 py-2.5 ${themeConfig.primary} ${themeConfig.hover} text-white rounded-lg transition shadow-lg opacity-90 hover:opacity-100 font-medium disabled:opacity-50`}
            >
            <MessageSquarePlus size={18} /> Điều chỉnh Lịch
            </button>
            <button 
            onClick={onReset}
            disabled={isAdjusting}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition font-medium shadow-sm disabled:opacity-50"
            >
            <ArrowLeft size={18} /> Nhập lại
            </button>
        </div>
      </div>

      {/* Adjustment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl transform transition-all scale-100 opacity-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <MessageSquarePlus size={22} className={themeConfig.text}/> Phản hồi cho AI
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleAdjustSubmit} className="p-5">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Lịch học quá dày? Hay bạn muốn dành ngày thứ 7 để nghỉ ngơi? Hãy cho TimePilot biết để điều chỉnh ngay.
              </p>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Ví dụ: Thứ 3 mình bận việc gia đình, hãy chuyển bớt bài tập sang thứ 4..."
                className={`w-full h-32 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 ${themeConfig.ring} focus:border-transparent outline-none resize-none mb-5`}
                autoFocus
              ></textarea>
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition font-medium"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  disabled={!feedback.trim()}
                  className={`px-5 py-2.5 ${themeConfig.primary} ${themeConfig.hover} text-white rounded-lg transition flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium`}
                >
                  <Send size={18} /> Gửi yêu cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Analysis */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg shadow-indigo-100/50 dark:shadow-none">
          <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-2 mb-3">
            <Lightbulb size={20} className="text-indigo-500 dark:text-indigo-400"/> Phân Tích Tổng Quan
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            {result.overallAnalysis}
          </p>
        </div>

        {/* High Pressure Alert */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg shadow-rose-100/50 dark:shadow-none">
          <h3 className="text-lg font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2 mb-3">
            <AlertTriangle size={20} className="text-rose-500 dark:text-rose-400"/> Cảnh Báo Quá Tải
          </h3>
          {result.highPressureDays.length > 0 ? (
             <div className="space-y-2">
               <p className="text-slate-600 dark:text-slate-300 text-sm">Cần chú ý đặc biệt vào các ngày:</p>
               <div className="flex flex-wrap gap-2">
                 {result.highPressureDays.map(day => (
                   <span key={day} className="px-2.5 py-1 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-xs font-semibold rounded-md border border-rose-100 dark:border-rose-800">
                     {day}
                   </span>
                 ))}
               </div>
               <p className="text-slate-400 text-xs mt-2">Hệ thống đã tự động chèn thêm thời gian nghỉ ngơi.</p>
             </div>
          ) : (
            <p className={`${themeConfig.text} text-sm`}>Lịch trình hiện tại khá cân bằng. Không có ngày nào quá tải nghiêm trọng.</p>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-100 dark:shadow-none">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">Gợi Ý Học Tập</h3>
          <ul className="space-y-2.5">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-300 items-start">
                <span className={`${themeConfig.text} mt-1.5 text-lg`}>•</span>
                <span className="mt-0.5">{rec}</span>
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