import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode, ThemeColor, ThemeConfig } from '../types';
import { THEME_COLORS } from '../constants';

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  themeConfig: ThemeConfig;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [color, setColor] = useState<ThemeColor>('emerald');

  useEffect(() => {
    const root = window.document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]);

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ 
      mode, 
      color, 
      themeConfig: THEME_COLORS[color], 
      setMode, 
      setColor, 
      toggleMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};