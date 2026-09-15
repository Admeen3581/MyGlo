import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '@/context/ThemeContext';
import { LightColors, DarkColors, ThemeColors } from '@/constants/colors';

export interface UseThemeResult extends Omit<ThemeContextType, 'activeColors'> {
  activeColors: ThemeColors;
}

export const useTheme = (customDarkMode?: boolean): UseThemeResult => {
  const context = useContext(ThemeContext);
  const isDarkMode = customDarkMode !== undefined ? customDarkMode : (context?.isDarkMode ?? false);
  const activeColors = isDarkMode ? DarkColors : LightColors;

  return {
    isDarkMode,
    theme: isDarkMode ? 'dark' : 'light',
    activeColors,
    toggleDarkMode: context?.toggleDarkMode ?? (() => {}),
    setDarkMode: context?.setDarkMode ?? (() => {}),
    isLoadingTheme: context?.isLoadingTheme ?? false,
  };
};
