import React, { useState } from 'react';
import { Plus, Trash2, Calendar, BookOpen, Clock, BrainCircuit } from 'lucide-react';
import { Course, StudentProfile } from '../types';
import { DIFFICULTY_LABELS } from '../constants';

interface DataInputProps {
  onAnalyze: (data: StudentProfile) => void;
  isAnalyzing: boolean;
}

const DataInput: React.FC<DataInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const [name, setName] = useState('');
  const [stressLevel, setStressLevel] = useState(5);
  const [freeTime, setFreeTime] = useState(4);
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', difficulty: 3, deadline: '', estimatedHours: 2 }
  ]);

  const addCourse = () => {
    setCourses([...courses, { 
      id: Date.now().toString(), 
      name: '', 
      difficulty: 3, 
      deadline: '', 
      estimatedHours: 2 
    }]);
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze({
      name,
      stressLevel,
      freeTimePerDay: freeTime,
      courses: courses.filter(c => c.name.trim() !== '')
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-900 rounded-xl shadow-2xl border border-slate-800">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
          Thiết Lập Dữ Liệu
        </h2>
        <p className="text-slate-400">Nhập thông tin môn học để TimePilot tối ưu lịch trình cho bạn.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Họ và tên</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition"
              placeholder="Nhập tên của bạn"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <BrainCircuit size={16} className="text-pink-400"/> Mức độ Stress ({stressLevel}/10)
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Thoải mái</span>
              <span>Căng thẳng</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Clock size={16} className="text-green-400"/> Thời gian rảnh/ngày (giờ)
            </label>
            <input 
              type="number" 
              min="0" 
              max="24" 
              value={freeTime}
              onChange={(e) => setFreeTime(parseFloat(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-green-500 outline-none transition"
            />
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BookOpen size={20} className="text-yellow-400"/> Danh sách môn học & Deadline
            </h3>
            <button 
              type="button" 
              onClick={addCourse}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-sm font-medium rounded-lg transition flex items-center gap-1"
            >
              <Plus size={16} /> Thêm môn
            </button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {courses.map((course, index) => (
              <div key={course.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-cyan-500/30 transition">
                <div className="md:col-span-4">
                  <input 
                    type="text" 
                    placeholder="Tên môn học / Nhiệm vụ"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                    className="w-full bg-transparent border-b border-slate-600 focus:border-cyan-500 text-white p-1 outline-none"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                   <select 
                    value={course.difficulty}
                    onChange={(e) => updateCourse(course.id, 'difficulty', parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-sm text-slate-300"
                   >
                     {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
                       <option key={k} value={k}>{v} ({k})</option>
                     ))}
                   </select>
                </div>
                <div className="md:col-span-2">
                   <input 
                    type="number"
                    placeholder="Giờ học"
                    min="1"
                    value={course.estimatedHours}
                    onChange={(e) => updateCourse(course.id, 'estimatedHours', parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-sm text-slate-300"
                   />
                </div>
                <div className="md:col-span-2">
                  <input 
                    type="date" 
                    value={course.deadline}
                    onChange={(e) => updateCourse(course.id, 'deadline', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-sm text-slate-300"
                    required
                  />
                </div>
                <div className="md:col-span-1 flex justify-center items-center">
                  {courses.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeCourse(course.id)}
                      className="text-slate-500 hover:text-red-400 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isAnalyzing}
          className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform hover:scale-[1.02] 
            ${isAnalyzing 
              ? 'bg-slate-700 cursor-not-allowed' 
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-900/20'
            }`}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-3">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Đang phân tích & tối ưu...
            </span>
          ) : 'Kích hoạt TimePilot AI'}
        </button>
      </form>
    </div>
  );
};

export default DataInput;
