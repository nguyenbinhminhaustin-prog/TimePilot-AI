import React, { useState } from 'react';
import { Plus, Trash2, Calendar, BookOpen, Clock, BrainCircuit } from 'lucide-react';
import { Course, StudentProfile } from '../types';
import { DIFFICULTY_LABELS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

interface DataInputProps {
  onAnalyze: (data: StudentProfile) => void;
  isAnalyzing: boolean;
}

const DataInput: React.FC<DataInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const { themeConfig } = useTheme();
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

  const handleDeadlineChange = (id: string, type: 'date' | 'time', value: string) => {
    setCourses(courses.map(c => {
      if (c.id !== id) return c;
      
      const currentDeadline = c.deadline || '';
      const [currentDate, currentTime] = currentDeadline.includes('T') 
        ? currentDeadline.split('T') 
        : [currentDeadline, '23:59'];

      let newDeadline = '';
      if (type === 'date') {
        newDeadline = value ? `${value}T${currentTime || '23:59'}` : '';
      } else {
        newDeadline = currentDate ? `${currentDate}T${value}` : '';
      }
      return { ...c, deadline: newDeadline };
    }));
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
    <div className="w-full max-w-5xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-stone-100 dark:border-slate-800 transition-colors duration-300">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Điền nhiệm vụ của bạn
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Nhập thông tin môn học, thời gian rảnh và deadline cụ thể.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Họ và tên</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-800 dark:text-slate-100 focus:ring-2 ${themeConfig.ring} focus:border-transparent outline-none transition shadow-sm`}
              placeholder="Nhập tên của bạn"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <BrainCircuit size={18} className="text-rose-500"/> Mức độ Stress ({stressLevel}/10)
            </label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Thoải mái</span>
              <span>Căng thẳng</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2`}>
              <Clock size={18} className={themeConfig.text}/> Thời gian rảnh/ngày (giờ)
            </label>
            <input 
              type="number" 
              min="0" 
              max="24" 
              value={freeTime}
              onChange={(e) => setFreeTime(parseFloat(e.target.value))}
              className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-800 dark:text-slate-100 focus:ring-2 ${themeConfig.ring} focus:border-transparent outline-none transition shadow-sm`}
            />
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <BookOpen size={22} className="text-amber-500"/> Danh sách môn học & Deadline
            </h3>
            <button 
              type="button" 
              onClick={addCourse}
              className={`px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 ${themeConfig.text} text-sm font-semibold rounded-lg transition flex items-center gap-2`}
            >
              <Plus size={18} /> Thêm môn
            </button>
          </div>

          {/* Desktop Headers */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-400 text-sm mb-2">
            <div className="col-span-4 flex items-center gap-2"><BookOpen size={16} className={themeConfig.text}/> Tên môn / Nhiệm vụ</div>
            <div className="col-span-2 flex items-center gap-2"><BrainCircuit size={16} className="text-rose-500"/> Độ khó</div>
            <div className="col-span-2 flex items-center gap-2"><Clock size={16} className="text-blue-500"/> Thời gian (h)</div>
            <div className="col-span-3 flex items-center gap-2"><Calendar size={16} className="text-amber-500"/> Hạn chót & Giờ nộp</div>
            <div className="col-span-1"></div>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {courses.map((course, index) => {
              const [datePart, timePart] = course.deadline ? course.deadline.split('T') : ['', '23:59'];
              
              return (
                <div key={course.id} className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all items-center group`}>
                  
                  {/* Name Input */}
                  <div className="md:col-span-4">
                    <label className={`md:hidden text-xs font-bold ${themeConfig.text} mb-1 flex items-center gap-1`}><BookOpen size={12}/> Tên môn học</label>
                    <input 
                      type="text" 
                      placeholder="Ví dụ: Ôn tập Toán..."
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                      className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-1 ${themeConfig.ring} focus:border-transparent outline-none transition`}
                      required
                    />
                  </div>

                  {/* Difficulty Select */}
                  <div className="md:col-span-2">
                    <label className="md:hidden text-xs font-bold text-rose-500 mb-1 flex items-center gap-1"><BrainCircuit size={12}/> Độ khó</label>
                    <select 
                      value={course.difficulty}
                      onChange={(e) => updateCourse(course.id, 'difficulty', parseInt(e.target.value))}
                      className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-700 dark:text-slate-300 focus:ring-1 ${themeConfig.ring} focus:border-transparent outline-none cursor-pointer`}
                    >
                      {Object.entries(DIFFICULTY_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v} ({k})</option>
                      ))}
                    </select>
                  </div>

                  {/* Estimated Hours Input */}
                  <div className="md:col-span-2">
                    <label className="md:hidden text-xs font-bold text-blue-500 mb-1 flex items-center gap-1"><Clock size={12}/> Thời gian (giờ)</label>
                    <input 
                      type="number"
                      placeholder="Giờ"
                      min="0.5"
                      step="0.5"
                      value={course.estimatedHours}
                      onChange={(e) => updateCourse(course.id, 'estimatedHours', parseFloat(e.target.value))}
                      className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-700 dark:text-slate-300 focus:ring-1 ${themeConfig.ring} focus:border-transparent outline-none`}
                    />
                  </div>

                  {/* Deadline Input (Date + Time) */}
                  <div className="md:col-span-3 flex gap-2">
                    <div className="flex-1">
                      <label className="md:hidden text-xs font-bold text-amber-500 mb-1 flex items-center gap-1"><Calendar size={12}/> Ngày</label>
                      <input 
                        type="date" 
                        value={datePart}
                        onChange={(e) => handleDeadlineChange(course.id, 'date', e.target.value)}
                        className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-700 dark:text-slate-300 focus:ring-1 ${themeConfig.ring} focus:border-transparent outline-none cursor-pointer`}
                        required
                      />
                    </div>
                    <div className="w-24">
                       <label className="md:hidden text-xs font-bold text-amber-500 mb-1 flex items-center gap-1"><Clock size={12}/> Giờ</label>
                       <input 
                        type="time" 
                        value={timePart || '23:59'}
                        onChange={(e) => handleDeadlineChange(course.id, 'time', e.target.value)}
                        className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-700 dark:text-slate-300 focus:ring-1 ${themeConfig.ring} focus:border-transparent outline-none cursor-pointer text-center`}
                      />
                    </div>
                  </div>

                  {/* Delete Action */}
                  <div className="md:col-span-1 flex justify-center items-center pt-2 md:pt-0">
                    {courses.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeCourse(course.id)}
                        className="text-slate-400 hover:text-rose-500 transition p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full"
                        title="Xóa nhiệm vụ này"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isAnalyzing}
          className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl transition-all transform hover:-translate-y-0.5
            ${isAnalyzing 
              ? 'bg-slate-400 cursor-not-allowed' 
              : `bg-gradient-to-r ${themeConfig.gradient} opacity-90 hover:opacity-100 shadow-slate-300 dark:shadow-slate-800`
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