import React, { useState } from 'react';
import { Rocket, FileClock } from 'lucide-react';
import DataInput from './components/DataInput';
import Dashboard from './components/Dashboard';
import { AIAnalysisResult, StudentProfile } from './types';
import { analyzeSchedule } from './services/geminiService';

const App: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentProfile | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (data: StudentProfile) => {
    setLoading(true);
    setError(null);
    setStudentData(data);
    try {
      const result = await analyzeSchedule(data);
      setAnalysisResult(result);
    } catch (err) {
      setError("Có lỗi xảy ra khi kết nối với AI. Vui lòng kiểm tra lại API Key hoặc thử lại sau.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setStudentData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-20">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20">
                <Rocket className="text-white h-6 w-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                TimePilot AI
              </span>
            </div>
            <div className="flex items-center space-x-4">
               <span className="text-sm text-slate-400 hidden sm:block">Trợ lý học tập thông minh</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg flex items-center justify-center">
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
          />
        )}
      </main>
      
      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        <p>© 2024 TimePilot AI. Powered by Google Gemini 2.5 Flash.</p>
      </footer>
    </div>
  );
};

export default App;
