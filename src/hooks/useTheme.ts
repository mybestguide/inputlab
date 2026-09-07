import { useState, useEffect } from 'react';
import { loadSettings, saveSettings } from '../core/storage/localStorageAdapter';

export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const stored = loadSettings().theme;
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    saveSettings({ theme });
  }, [theme]);

  // Synchronize across tabs/windows if storage updates
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'inputlab_settings_v1' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.theme === 'dark' || parsed.theme === 'light') {
            setTheme(parsed.theme);
          }
        } catch {
          // ignore parsing error
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme, setTheme };
}

