export interface Course {
  id: string;
  name: string;
  difficulty: number; // 1-5
  deadline: string; // YYYY-MM-DD
  estimatedHours: number;
}

export interface StudentProfile {
  name: string;
  stressLevel: number; // 1-10
  freeTimePerDay: number; // Hours
  courses: Course[];
  currentDate?: string; // Format: YYYY-MM-DD or readable string
}

export enum TaskType {
  STUDY = 'STUDY',
  BREAK = 'BREAK',
  DEADLINE = 'DEADLINE',
  CLASS = 'CLASS'
}

export interface ScheduledTask {
  time: string;
  activity: string;
  type: TaskType;
  durationMinutes: number;
}

export interface DailyPlan {
  day: string; // "Thứ 2", "Thứ 3", etc.
  date: string;
  stressScore: number;
  tasks: ScheduledTask[];
}

export interface AIAnalysisResult {
  dailyPlans: DailyPlan[];
  overallAnalysis: string;
  recommendations: string[];
  highPressureDays: string[];
}

export type ThemeMode = 'light' | 'dark';
export type ThemeColor = 'emerald' | 'blue' | 'rose' | 'violet' | 'amber';

export interface ThemeConfig {
  name: string;
  primary: string;
  hover: string;
  text: string;
  bgLight: string;
  border: string;
  ring: string;
  gradient: string;
}