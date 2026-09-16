import React, { createContext, useContext, useEffect } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme: Theme = 'light';

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.add('light');
    root.classList.remove('dark');
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
    body.style.backgroundColor = '#f8fafc';
    body.style.color = '#0f172a';

    try {
      localStorage.setItem('jessica_rosa_theme', 'light');
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = () => {
    // Locked to light mode
  };

  const setTheme = () => {
    // Locked to light mode
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

