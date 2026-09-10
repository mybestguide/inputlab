import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  MousePointer, 
  Layers, 
  Clock, 
  Zap, 
  RotateCw, 
  Gauge, 
  Move,
  Keyboard as KeyboardIcon,
  ShieldCheck,
  Grid,
  Hash,
  Gamepad2,
  Sliders,
  Maximize2,
  ChevronDown,
  ChevronUp,
  LayoutGrid
} from 'lucide-react';
import { cn } from '../../lib/utils/cn';

interface SidebarItem {
  to: string;
  label: string;
  short?: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: string;
}

interface SidebarCategory {
  category: string;
  items: SidebarItem[];
}

export const DeviceSidebar: React.FC = () => {
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const isMouse = location.pathname.startsWith('/mouse');
  const isKeyboard = location.pathname.startsWith('/keyboard');

  if (!isMouse && !isKeyboard) {
    return null;
  }

  const mouseRoutes: SidebarCategory[] = [
    {
      category: 'Switch & Actuation',
      items: [
        { to: '/mouse', label: 'Overview & Bench', short: 'Overview', icon: MousePointer, exact: true },
        { to: '/mouse/buttons', label: '5-Button Inspector', short: '5-Button', icon: Layers },
        { to: '/mouse/click', label: 'Click & Hold Latency', short: 'Latency', icon: Clock },
        { to: '/mouse/chatter', label: 'Double-Click Chatter', short: 'Chatter', icon: Zap, badge: 'Crucial' },
      ],
    },
    {
      category: 'Mechanical & Motion',
      items: [
        { to: '/mouse/scroll', label: 'Scroll Wheel Encoder', short: 'Scroll', icon: RotateCw },
        { to: '/mouse/motion', label: 'Pointer Event Rate', short: 'Motion', icon: Move },
      ],
    },
    {
      category: 'Cadence & Speed',
      items: [
        { to: '/mouse/cps', label: 'CPS Speed Benchmark', short: 'CPS', icon: Gauge },
      ],
    },
  ];

  const keyboardRoutes: SidebarCategory[] = [
    {
      category: 'Matrix & Actuation',
      items: [
        { to: '/keyboard', label: '1. Keyboard Test', short: 'Overview', icon: KeyboardIcon, exact: true },
        { to: '/keyboard/matrix', label: '2. Key Tester', short: 'Matrix', icon: Grid },
        { to: '/keyboard/modifiers', label: '8. Modifier Key Test', short: 'Modifiers', icon: Sliders },
      ],
    },
    {
      category: 'Rollover & Anti-Ghosting',
      items: [
        { to: '/keyboard/rollover', label: '3. Key Rollover Test', short: 'Rollover', icon: Hash, badge: 'NKRO' },
        { to: '/keyboard/anti-ghosting', label: '4. Anti-Ghosting Test', short: 'Anti-Ghost', icon: ShieldCheck },
      ],
    },
    {
      category: 'Switch & Cluster Dynamics',
      items: [
        { to: '/keyboard/chatter', label: '5. Key Response Test', short: 'Response', icon: Zap },
        { to: '/keyboard/gaming-wasd', label: '6. WASD Test', short: 'WASD', icon: Gamepad2 },
        { to: '/keyboard/spacebar', label: '7. Spacebar Test', short: 'Spacebar', icon: Maximize2 },
      ],
    },
  ];

  const sections = isMouse ? mouseRoutes : keyboardRoutes;
  const allItems = sections.flatMap(sec => sec.items);
  const currentItem = allItems.find(item => 
    item.exact ? location.pathname === item.to : location.pathname === item.to
  ) || allItems[0];
  const CurrentIcon = currentItem.icon;

  return (
    <aside 
      aria-label="Device Test Navigation"
      className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/40 p-3 sm:p-4"
    >
      {/* Mobile / Tablet View (< lg): Active Test Header + Swipeable Quick Carousel + Drawer */}
      <div className="lg:hidden flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <CurrentIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-zinc-400 block uppercase tracking-wider leading-none">
                {isMouse ? 'Mouse Suite' : 'Keyboard Suite'}
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate block mt-0.5">
                {currentItem.label}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileDrawerOpen(prev => !prev)}
            aria-expanded={mobileDrawerOpen}
            aria-label="Toggle all tests menu"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 min-h-[44px] shrink-0 cursor-pointer shadow-xs transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span className="hidden sm:inline">All Tests</span>
            {mobileDrawerOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            )}
          </button>
        </div>

        {/* Swipeable Quick Carousel */}
        <div 
          role="tablist"
          aria-label="Quick test selector"
          className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar select-none"
        >
          {allItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? location.pathname === item.to : location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                role="tab"
                aria-selected={isActive}
                onClick={() => setMobileDrawerOpen(false)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium shrink-0 min-h-[40px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                  isActive
                    ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 font-bold border border-sky-300 dark:border-sky-800 shadow-xs'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                )}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">{item.short || item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Expanded Drawer for Mobile */}
        {mobileDrawerOpen && (
          <div className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg mt-1 space-y-3 animate-in fade-in duration-100">
            {sections.map((sec, sIdx) => (
              <div key={sIdx}>
                <h4 className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5 px-1">
                  {sec.category}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.exact ? location.pathname === item.to : location.pathname === item.to;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.exact}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={cn(
                          'flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                          isActive
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold border border-sky-300 dark:border-sky-800'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100'
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon className="w-4 h-4 shrink-0 text-zinc-500" />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop View (>= lg): Categorized Vertical Tree */}
      <div className="hidden lg:flex flex-col gap-4">
        {sections.map((sec, sIdx) => (
          <div key={sIdx}>
            <h3 className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 px-2.5">
              {sec.category}
            </h3>
            <div className="flex flex-col gap-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? location.pathname === item.to
                  : location.pathname === item.to;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    className={cn(
                      'flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
                      isActive
                        ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 font-semibold border border-sky-200 dark:border-sky-800'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100'
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
