import React, { createContext, useState, ReactNode } from 'react';
import { LightColors, DarkColors, ThemeColors } from '@/constants/colors';

export interface ThemeContextType {
  isDarkMode: boolean;
  theme: 'light' | 'dark';
  activeColors: ThemeColors;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialDarkMode?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialDarkMode = false,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(initialDarkMode);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const setDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  const activeColors = isDarkMode ? DarkColors : LightColors;
  const theme = isDarkMode ? 'dark' : 'light';

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        theme,
        activeColors,
        toggleDarkMode,
        setDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
