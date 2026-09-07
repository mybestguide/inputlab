import React from 'react';
import { cn } from '../../lib/utils/cn';

interface KeyDef {
  code: string;
  label: string;
  sub?: string;
  width?: number; // relative width unit (1 = normal 1u, 1.5 = tab, etc.)
}

const TKL_ROWS: KeyDef[][] = [
  // Function Row
  [
    { code: 'Escape', label: 'Esc', width: 1 },
    { code: 'F1', label: 'F1' },
    { code: 'F2', label: 'F2' },
    { code: 'F3', label: 'F3' },
    { code: 'F4', label: 'F4' },
    { code: 'F5', label: 'F5' },
    { code: 'F6', label: 'F6' },
    { code: 'F7', label: 'F7' },
    { code: 'F8', label: 'F8' },
    { code: 'F9', label: 'F9' },
    { code: 'F10', label: 'F10' },
    { code: 'F11', label: 'F11' },
    { code: 'F12', label: 'F12' },
    { code: 'PrintScreen', label: 'PrtSc' },
    { code: 'ScrollLock', label: 'ScrLk' },
    { code: 'Pause', label: 'Pause' },
  ],
  // Number Row
  [
    { code: 'Backquote', label: '~', sub: '`' },
    { code: 'Digit1', label: '!', sub: '1' },
    { code: 'Digit2', label: '@', sub: '2' },
    { code: 'Digit3', label: '#', sub: '3' },
    { code: 'Digit4', label: '$', sub: '4' },
    { code: 'Digit5', label: '%', sub: '5' },
    { code: 'Digit6', label: '^', sub: '6' },
    { code: 'Digit7', label: '&', sub: '7' },
    { code: 'Digit8', label: '*', sub: '8' },
    { code: 'Digit9', label: '(', sub: '9' },
    { code: 'Digit0', label: ')', sub: '0' },
    { code: 'Minus', label: '_', sub: '-' },
    { code: 'Equal', label: '+', sub: '=' },
    { code: 'Backspace', label: 'Backspace', width: 2 },
    { code: 'Insert', label: 'Ins' },
    { code: 'Home', label: 'Home' },
    { code: 'PageUp', label: 'PgUp' },
  ],
  // Tab / QWERTY Row
  [
    { code: 'Tab', label: 'Tab', width: 1.5 },
    { code: 'KeyQ', label: 'Q' },
    { code: 'KeyW', label: 'W' },
    { code: 'KeyE', label: 'E' },
    { code: 'KeyR', label: 'R' },
    { code: 'KeyT', label: 'T' },
    { code: 'KeyY', label: 'Y' },
    { code: 'KeyU', label: 'U' },
    { code: 'KeyI', label: 'I' },
    { code: 'KeyO', label: 'O' },
    { code: 'KeyP', label: 'P' },
    { code: 'BracketLeft', label: '{', sub: '[' },
    { code: 'BracketRight', label: '}', sub: ']' },
    { code: 'Backslash', label: '|', sub: '\\', width: 1.5 },
    { code: 'Delete', label: 'Del' },
    { code: 'End', label: 'End' },
    { code: 'PageDown', label: 'PgDn' },
  ],
  // Caps / Home Row
  [
    { code: 'CapsLock', label: 'Caps Lock', width: 1.75 },
    { code: 'KeyA', label: 'A' },
    { code: 'KeyS', label: 'S' },
    { code: 'KeyD', label: 'D' },
    { code: 'KeyF', label: 'F' },
    { code: 'KeyG', label: 'G' },
    { code: 'KeyH', label: 'H' },
    { code: 'KeyJ', label: 'J' },
    { code: 'KeyK', label: 'K' },
    { code: 'KeyL', label: 'L' },
    { code: 'Semicolon', label: ':', sub: ';' },
    { code: 'Quote', label: '"', sub: "'" },
    { code: 'Enter', label: 'Enter', width: 2.25 },
  ],
  // Shift / Bottom Row
  [
    { code: 'ShiftLeft', label: 'Shift', width: 2.25 },
    { code: 'KeyZ', label: 'Z' },
    { code: 'KeyX', label: 'X' },
    { code: 'KeyC', label: 'C' },
    { code: 'KeyV', label: 'V' },
    { code: 'KeyB', label: 'B' },
    { code: 'KeyN', label: 'N' },
    { code: 'KeyM', label: 'M' },
    { code: 'Comma', label: '<', sub: ',' },
    { code: 'Period', label: '>', sub: '.' },
    { code: 'Slash', label: '?', sub: '/' },
    { code: 'ShiftRight', label: 'Shift', width: 2.75 },
    { code: 'ArrowUp', label: '▲' },
  ],
  // Bottom Modifier Row
  [
    { code: 'ControlLeft', label: 'Ctrl', width: 1.25 },
    { code: 'MetaLeft', label: 'Win', width: 1.25 },
    { code: 'AltLeft', label: 'Alt', width: 1.25 },
    { code: 'Space', label: 'Spacebar', width: 6.25 },
    { code: 'AltRight', label: 'Alt', width: 1.25 },
    { code: 'MetaRight', label: 'Win', width: 1.25 },
    { code: 'ContextMenu', label: 'Menu', width: 1.25 },
    { code: 'ControlRight', label: 'Ctrl', width: 1.25 },
    { code: 'ArrowLeft', label: '◀' },
    { code: 'ArrowDown', label: '▼' },
    { code: 'ArrowRight', label: '▶' },
  ],
];

interface VirtualKeyboardProps {
  activeKeys: Set<string>;
  testedKeys: Set<string>;
  onKeyClick?: (code: string) => void;
  className?: string;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKeys,
  testedKeys,
  onKeyClick,
  className,
}) => {
  return (
    <div className={cn('flex flex-col', className)}>
      {/* Mobile Swipe Hint */}
      <div className="flex sm:hidden items-center justify-between text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mb-1.5 px-1">
        <span>ANSI 87-Key Matrix</span>
        <span className="text-sky-600 dark:text-sky-400 font-medium">↔ Pan to view full board</span>
      </div>

      <div className="p-3 sm:p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-inner overflow-x-auto select-none no-scrollbar">
        <div className="flex flex-col gap-1 sm:gap-1.5 min-w-[640px] sm:min-w-[760px]">
          {TKL_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1 sm:gap-1.5 justify-start items-center">
              {row.map((key) => {
                const isActive = activeKeys.has(key.code);
                const isTested = testedKeys.has(key.code);

                return (
                  <button
                    key={key.code}
                    type="button"
                    onClick={() => onKeyClick?.(key.code)}
                    style={{
                      flexGrow: key.width || 1,
                      flexShrink: 0,
                      minWidth: key.width ? `${key.width * 2.1}rem` : '2.1rem',
                    }}
                    className={cn(
                      'h-9 sm:h-10 px-1 flex flex-col items-center justify-center rounded text-[10px] sm:text-xs font-mono font-medium transition-all duration-75 border shadow-xs select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none',
                      isActive
                        ? 'bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 font-bold border-sky-800 dark:border-sky-300 ring-2 ring-sky-500 dark:ring-sky-400 scale-[0.97]'
                        : isTested
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:border-emerald-400'
                        : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                    )}
                    title={`Physical Scancode: ${key.code}`}
                    aria-label={`Key ${key.label}, code ${key.code}`}
                  >
                    {key.sub && (
                      <span className="text-[8px] sm:text-[9px] opacity-70 leading-none">{key.label}</span>
                    )}
                    <span className="leading-tight truncate">{key.sub ? key.sub : key.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
