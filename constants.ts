import { ThemeColor, ThemeConfig } from './types';

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Rất dễ",
  2: "Dễ",
  3: "Trung bình",
  4: "Khó",
  5: "Rất khó"
};

export const MOCK_INITIAL_DATA = {
  name: "Học sinh A",
  stressLevel: 5,
  freeTimePerDay: 4,
  courses: [
    { id: '1', name: "Toán Cao Cấp", difficulty: 5, deadline: "2024-06-20", estimatedHours: 10 },
    { id: '2', name: "Lịch Sử Đảng", difficulty: 3, deadline: "2024-06-18", estimatedHours: 5 },
  ]
};

export const THEME_COLORS: Record<ThemeColor, ThemeConfig> = {
  emerald: {
    name: "Emerald",
    primary: "bg-emerald-600",
    hover: "hover:bg-emerald-700",
    text: "text-emerald-600",
    bgLight: "bg-emerald-50",
    border: "border-emerald-200",
    ring: "focus:ring-emerald-500",
    gradient: "from-emerald-600 to-teal-600"
  },
  blue: {
    name: "Blue",
    primary: "bg-blue-600",
    hover: "hover:bg-blue-700",
    text: "text-blue-600",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    ring: "focus:ring-blue-500",
    gradient: "from-blue-600 to-indigo-600"
  },
  rose: {
    name: "Rose",
    primary: "bg-rose-600",
    hover: "hover:bg-rose-700",
    text: "text-rose-600",
    bgLight: "bg-rose-50",
    border: "border-rose-200",
    ring: "focus:ring-rose-500",
    gradient: "from-rose-600 to-pink-600"
  },
  violet: {
    name: "Violet",
    primary: "bg-violet-600",
    hover: "hover:bg-violet-700",
    text: "text-violet-600",
    bgLight: "bg-violet-50",
    border: "border-violet-200",
    ring: "focus:ring-violet-500",
    gradient: "from-violet-600 to-purple-600"
  },
  amber: {
    name: "Amber",
    primary: "bg-amber-600",
    hover: "hover:bg-amber-700",
    text: "text-amber-600",
    bgLight: "bg-amber-50",
    border: "border-amber-200",
    ring: "focus:ring-amber-500",
    gradient: "from-amber-600 to-orange-600"
  }
};