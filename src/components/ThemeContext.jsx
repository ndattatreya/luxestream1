import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme toggle button component
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div style={{ marginLeft: '73vw' }}>
    <button
      onClick={toggleTheme}
      style={{
        padding: '8px 16px', 
        borderRadius: '6px',
        border: 'none',
        background: theme === 'dark' ? '#222' : '#eee',
        color: theme === 'dark' ? '#fff' : '#222',
        cursor: 'pointer',
      }}
      aria-label="Toggle dark/light mode"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
    </div>
  );
};