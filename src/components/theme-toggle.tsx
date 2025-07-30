'use client';

import { useTheme } from './providers/theme-provider';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  const handleClick = () => {
    toggleTheme();
  };

  // Show a placeholder while mounting to prevent layout shift
  if (!mounted) {
    return (
      <div className="p-2 rounded-lg border border-gray-200 bg-white shadow-sm w-10 h-10" />
    );
  }

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      ) : (
        <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
}