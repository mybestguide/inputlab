import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { useTheme } from '../hooks/useTheme';
import { ShieldCheck } from 'lucide-react';

export const RootLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-150">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      
      <div className="flex-1 flex flex-col">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </div>

      <footer className="border-t border-zinc-200 dark:border-zinc-850 py-4 px-6 text-center text-xs font-mono text-zinc-400 bg-white/50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero Tracking &bull; 100% Client-Side Memory Execution</span>
          </div>
          <div>
            <span>InputLab Diagnostics Engine v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
