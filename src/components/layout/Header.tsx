import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Mouse, Keyboard, BookOpen, Info, Moon, Sun, Volume2, VolumeX, Activity, Menu, X, ShieldCheck } from 'lucide-react';
import { useBrowserCapabilities } from '../../hooks/useBrowserCapabilities';
import { loadSettings, saveSettings } from '../../core/storage/localStorageAdapter';
import { cn } from '../../lib/utils/cn';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const { capabilities } = useBrowserCapabilities();
  const [sound, setSound] = useState(() => loadSettings().soundEnabled);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    saveSettings({ soundEnabled: next });
  };

  const navItems = [
    { to: '/mouse', label: 'Mouse Diagnostics', shortLabel: 'Mouse', icon: Mouse },
    { to: '/keyboard', label: 'Keyboard Diagnostics', shortLabel: 'Keyboard', icon: Keyboard },
    { to: '/learn', label: 'Methodology & Science', shortLabel: 'Learn', icon: BookOpen },
    { to: '/about', label: 'About & System Audit', shortLabel: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Identity */}
        <NavLink
          to="/mouse"
          aria-label="InputLab Home"
          className="flex items-center gap-2.5 group shrink-0 min-h-[44px] py-1"
        >
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-mono font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            IL
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-white flex items-center gap-1.5">
              InputLab
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-normal">
                v1.0
              </span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline leading-none">
              Precision Peripheral Bench
            </span>
          </div>
        </NavLink>

        {/* Primary Desktop Navigation Pillars */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs'
                      : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-850'
                  )
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.shortLabel}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Controls: Telemetry, Audio, Theme, and Mobile Menu Toggle */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Refresh Rate Badge (Desktop) */}
          {capabilities && (
            <div
              title={`Detected Display Refresh: ${capabilities.estimatedDisplayHz} Hz | Timer Precision: ~${capabilities.timerPrecisionMs} ms`}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400"
            >
              <Activity className="w-3 h-3 text-emerald-500" />
              <span>{capabilities.estimatedDisplayHz} Hz</span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={sound ? 'Disable sound effects' : 'Enable sound effects'}
            title={sound ? 'Audio feedback enabled' : 'Audio feedback muted'}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer ml-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-label="Mobile Navigation Menu"
          className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 px-3 block mb-2">
              Diagnostic Suites
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                      isActive
                        ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                    )
                  }
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center text-zinc-600 dark:text-zinc-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </div>

          {/* Quick System Telemetry in Mobile Menu */}
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-850 flex items-center justify-between text-xs font-mono text-zinc-500 px-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Client-Side RAM</span>
            </div>
            {capabilities && (
              <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span>{capabilities.estimatedDisplayHz} Hz</span>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
