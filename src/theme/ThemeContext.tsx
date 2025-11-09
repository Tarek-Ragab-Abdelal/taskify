/* eslint-disable react/hook-use-state */
import React, { createContext, useContext, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, Colors, ColorTheme, FontSize } from './colors';
import { createTypography, Typography } from './typography';

interface ThemeContextType {
  theme: ColorTheme;
  colors: Colors;
  isDark: boolean;
  fontSize: FontSize;
  typography: Typography;
  toggleTheme: () => void;
  setTheme: (theme: ColorTheme) => void;
  setFontSize: (fontSize: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ColorTheme>('system');
  const [fontSize, setFontSize] = useState<FontSize>('small');

  // Determine the effective theme based on system preference
  const getEffectiveTheme = (currentTheme: ColorTheme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return currentTheme === 'dark' ? 'dark' : 'light';
  };

  const effectiveTheme = getEffectiveTheme(theme);
  const isDark = effectiveTheme === 'dark';
  const colors = isDark ? darkColors : lightColors;
  const typography = createTypography(fontSize);

  const toggleTheme = () => {
    setThemeState(prevTheme => {
      switch (prevTheme) {
        case 'light':
          return 'dark';
        case 'dark':
          return 'system';
        case 'system':
          return 'light';
        default:
          return 'light';
      }
    });
  };

  const setTheme = (newTheme: ColorTheme) => {
    setThemeState(newTheme);
  };

  const value = useMemo((): ThemeContextType => ({
    theme,
    colors,
    isDark,
    fontSize,
    typography,
    toggleTheme,
    setTheme,
    setFontSize,
  }), [theme, colors, isDark, fontSize, typography, toggleTheme, setTheme, setFontSize]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};