import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, resolvedTheme, toggleTheme, setThemeMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = () => {
    if (theme === 'system') {
      return <Monitor className="h-5 w-5" />;
    }
    return resolvedTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />;
  };

  const getModeLabel = () => {
    if (theme === 'light') return 'Light';
    if (theme === 'dark') return 'Dark';
    return 'System';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Theme selector"
      >
        {getIcon()}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setThemeMode('light');
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === 'light' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Sun className="h-4 w-4" />
              <span>Light Mode</span>
              {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
            </button>
            <button
              onClick={() => {
                setThemeMode('dark');
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === 'dark' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
              {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
            </button>
            <button
              onClick={() => {
                setThemeMode('system');
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                theme === 'system' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Monitor className="h-4 w-4" />
              <span>System Mode</span>
              {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;