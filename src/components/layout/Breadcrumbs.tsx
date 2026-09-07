import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS: Record<string, string> = {
  mouse: 'Mouse Diagnostics',
  buttons: '5-Button Inspector',
  click: 'Click & Hold Latency',
  chatter: 'Double-Click & Chatter Detector',
  scroll: 'Scroll Wheel Encoder Test',
  cps: 'CPS Speed Benchmark',
  motion: 'Pointer Event Rate',
  keyboard: 'Keyboard Diagnostics',
  matrix: 'Full Scancode Matrix',
  rollover: 'Key Rollover (KRO)',
  'anti-ghosting': 'Anti-Ghosting (Triads)',
  'gaming-wasd': 'WASD Gaming Cluster',
  spacebar: 'Spacebar Stabilizer',
  modifiers: 'Modifier & Lock States',
  learn: 'Hardware & Browser Methodology',
  'polling-rates': 'Browser vs. Hardware Polling Rates',
  'switch-chatter': 'Understanding Switch Chatter',
  'browser-timing': 'Web Timing Precision & Spectre',
  about: 'About InputLab',
  system: 'Browser System Audit',
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumbs" className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-xs font-mono text-zinc-400 dark:text-zinc-500 mb-4 select-none">
      <NavLink to="/mouse" className="hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500 rounded px-1 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">InputLab</span>
      </NavLink>

      {segments.map((seg, idx) => {
        const isLast = idx === segments.length - 1;
        const url = '/' + segments.slice(0, idx + 1).join('/');
        const label = ROUTE_LABELS[seg] || seg;

        return (
          <React.Fragment key={url}>
            <ChevronRight className="w-3 h-3 opacity-50 shrink-0" />
            {isLast ? (
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate" aria-current="page">
                {label}
              </span>
            ) : (
              <NavLink to={url} className="hover:text-zinc-900 dark:hover:text-zinc-100 truncate focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500 rounded px-1 transition-colors">
                {label}
              </NavLink>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
