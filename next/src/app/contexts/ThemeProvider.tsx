import { getCookie, setCookie } from 'cookies-next';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { ThemeContextType, ThemeType } from '@/types/common';
import { disableAnimation } from '@/utils/helpers/disableAnimation';

export const maxAge = 60 * 60 * 24 * 7;

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider = ({ children, clearTransition = false }) => {
  const theme = getCookie('theme')?.toString() || ThemeType.LIGHT;
  const [isDarkMode, setIsDarkMode] = useState(theme === ThemeType.DARK);

  const handleChangeTheme = (state: boolean) => {
    const selectedTheme = state ? ThemeType.DARK : ThemeType.LIGHT;
    if (clearTransition) {
      disableAnimation();
    }

    setIsDarkMode(state);
    setCookie('theme', selectedTheme, { maxAge });

    document.body.classList.toggle('dark-theme', state);
  };

  useEffect(() => {
    document.body.classList.toggle('dark-theme', isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, handleChangeTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export { ThemeProvider, useTheme };
