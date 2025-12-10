import React, { useState } from 'react';
import { Rocket, Moon, Sun, Palette } from 'lucide-react';
import DataInput from './components/DataInput';
import Dashboard from './components/Dashboard';
import { AIAnalysisResult, StudentProfile, ThemeColor } from './types';
import { analyzeSchedule, adjustSchedule } from './services/geminiService';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { THEME_COLORS } from './constants';

const ThemeSelector: React.FC = () => {
  const { mode, toggleMode, color, setColor } = useTheme();
  const [showPalette, setShowPalette] = useState(false);

  return (
    <div className="flex items-center gap-3">
      {/* Color Picker */}
      <div className="relative">
        <button 
          onClick={() => setShowPalette(!showPalette)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 transition"
          title="Chọn màu chủ đạo"
        >
          <Palette size={20} />
        </button>
        {showPalette && (
          <div className="absolute right-0 top-full mt-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-2 z-50 min-w-[120px]">
            {(Object.keys(THEME_COLORS) as ThemeColor[]).map((c) => (
              <button
                key={c}
                onClick={() => { setColor(c); setShowPalette(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition
                  ${color === c 
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
              >
                <span className={`w-3 h-3 rounded-full ${THEME_COLORS[c].primary}`}></span>
                {THEME_COLORS[c].name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mode Toggle */}
      <button 
        onClick={toggleMode}
        className="p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 transition"
        title={mode === 'light' ? 'Chuyển sang Chế độ tối' : 'Chuyển sang Chế độ sáng'}
      >
        {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </div>
  );
};

const MainApp: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentProfile | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mode, themeConfig } = useTheme();

  const handleAnalysis = async (data: StudentProfile) => {
    setLoading(true);
    setError(null);
    
    // Inject current real-time date
    const profileWithDate: StudentProfile = {
      ...data,
      currentDate: new Date().toLocaleDateString('vi-VN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) + ` (YYYY-MM-DD: ${new Date().toISOString().split('T')[0]})`
    };

    setStudentData(profileWithDate);
    
    try {
      const result = await analyzeSchedule(profileWithDate);
      setAnalysisResult(result);
    } catch (err) {
      setError("Có lỗi xảy ra khi kết nối với AI. Vui lòng kiểm tra lại API Key hoặc thử lại sau.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustment = async (feedback: string) => {
    if (!studentData || !analysisResult) return;
    
    setIsAdjusting(true);
    setError(null);
    try {
      const newResult = await adjustSchedule(studentData, analysisResult, feedback);
      setAnalysisResult(newResult);
    } catch (err) {
      setError("Không thể điều chỉnh lịch trình lúc này. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setIsAdjusting(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setStudentData(null);
    setError(null);
  };

  return (
    <div className={`min-h-screen font-sans pb-20 transition-colors duration-300 ${mode === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-[#faebd7] text-slate-800'}`}>
      {/* Navbar */}
      <nav className={`border-b sticky top-0 z-50 shadow-sm backdrop-blur-md transition-colors duration-300 ${mode === 'dark' ? 'bg-slate-950/90 border-slate-800' : 'bg-[#faebd7]/90 border-stone-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
              <div className={`p-2 bg-gradient-to-br rounded-lg shadow-lg shadow-black/10 ${themeConfig.gradient}`}>
                <Rocket className="text-white h-6 w-6" />
              </div>
              <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${themeConfig.gradient}`}>
                TimePilot AI
              </span>
            </div>
            
            <div className="flex items-center gap-4">
               <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block font-medium">Trợ lý học tập thông minh</span>
               <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-2"></div>
               <ThemeSelector />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg flex items-center justify-center shadow-sm">
            {error}
          </div>
        )}

        {!analysisResult ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
            <DataInput onAnalyze={handleAnalysis} isAnalyzing={loading} />
          </div>
        ) : (
          <Dashboard 
            result={analysisResult} 
            studentName={studentData?.name || "Bạn"} 
            onReset={handleReset}
            onAdjust={handleAdjustment}
            isAdjusting={isAdjusting}
          />
        )}
      </main>
      
      {/* Footer */}
      <footer className={`fixed bottom-0 w-full border-t py-4 text-center text-xs z-40 transition-colors duration-300 ${mode === 'dark' ? 'bg-slate-950/95 border-slate-800 text-slate-500' : 'bg-[#faebd7]/95 border-stone-200 text-slate-500'}`}>
        <p>© 2024 TimePilot AI. Powered by Google Gemini 2.5 Flash.</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
};

export default App;