import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { useTheme } from '../hooks/useTheme';
import { ShieldCheck, Mouse, Keyboard } from 'lucide-react';

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

      <footer className="border-t border-zinc-200 dark:border-zinc-850 bg-white/70 dark:bg-zinc-950/70 pt-10 pb-8 px-4 sm:px-6 text-xs text-zinc-500 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Overview */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 font-bold text-sm text-zinc-900 dark:text-white">
              <div className="w-6 h-6 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-mono font-bold text-xs">
                IL
              </div>
              <span>InputLab</span>
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed font-normal">
              Free, browser-based diagnostic tools for checking keyboard keys, mouse buttons, clicks, scrolling, and input responsiveness online without installing software.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>100% Client-Side Privacy</span>
            </div>
          </div>

          {/* Col 2: Mouse Testing Tools */}
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
              <Mouse className="w-3.5 h-3.5 text-sky-500" />
              Mouse Testing
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/mouse" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  Online Mouse Test
                </Link>
              </li>
              <li>
                <Link to="/mouse/buttons" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  5-Button Inspector
                </Link>
              </li>
              <li>
                <Link to="/mouse/chatter" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  Double-Click Chatter Detector
                </Link>
              </li>
              <li>
                <Link to="/mouse/scroll" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  Scroll Wheel Encoder Test
                </Link>
              </li>
              <li>
                <Link to="/mouse/click" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  Click &amp; Hold Timing
                </Link>
              </li>
              <li>
                <Link to="/mouse/cps" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  CPS Click Speed Benchmark
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Keyboard Testing Tools */}
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
              <Keyboard className="w-3.5 h-3.5 text-sky-500" />
              Keyboard Testing
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/keyboard" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  Online Keyboard Tester
                </Link>
              </li>
              <li>
                <Link to="/keyboard/matrix" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  Key Matrix Inspector
                </Link>
              </li>
              <li>
                <Link to="/keyboard/rollover" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  N-Key Rollover (NKRO)
                </Link>
              </li>
              <li>
                <Link to="/keyboard/anti-ghosting" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  Anti-Ghosting Triads
                </Link>
              </li>
              <li>
                <Link to="/keyboard/chatter" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  Key Switch Chatter
                </Link>
              </li>
              <li>
                <Link to="/keyboard/gaming-wasd" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  WASD Gaming Cluster
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Documentation */}
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white text-xs uppercase tracking-wider mb-3 font-mono">
              Resources &amp; System
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  InputLab Homepage
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  Measurement Methodology &amp; Science
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
                  About &amp; Browser API Audit
                </Link>
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-400">
              Compatible with Chrome, Firefox, Safari, Edge, and Opera on Windows, macOS, Linux, and ChromeOS.
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-zinc-200 dark:border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-zinc-400">
          <div>
            <span>&copy; {new Date().getFullYear()} InputLab &bull; All input testing runs locally in browser volatile memory</span>
          </div>
          <div>
            <span>InputLab Diagnostics Engine v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
