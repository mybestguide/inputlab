import React from 'react';
import { cn } from '../../lib/utils/cn';

interface MouseSilhouetteProps {
  activeButtons: number; // bitmask of active buttons (1=L, 2=R, 4=M, 8=Back, 16=Fwd)
  buttonCounts?: Record<number, number>;
  className?: string;
}

export const MouseSilhouette: React.FC<MouseSilhouetteProps> = ({
  activeButtons,
  buttonCounts = {},
  className,
}) => {
  const isLeft = (activeButtons & 1) !== 0;
  const isRight = (activeButtons & 2) !== 0;
  const isMiddle = (activeButtons & 4) !== 0;
  const isBack = (activeButtons & 8) !== 0;
  const isForward = (activeButtons & 16) !== 0;

  return (
    <div className={cn('flex flex-col items-center select-none', className)}>
      <svg
        viewBox="0 0 200 320"
        className="w-48 h-72 drop-shadow-md transition-all duration-75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Mouse Outer Body Shell */}
        <path
          d="M 40 100 C 40 30, 160 30, 160 100 L 160 220 C 160 290, 40 290, 40 220 Z"
          className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700 stroke-2"
        />

        {/* Left Click Button (Button 0) */}
        <path
          d="M 42 100 C 42 45, 96 42, 96 42 L 96 125 L 42 125 Z"
          className={cn(
            'transition-colors duration-75 cursor-pointer stroke-zinc-400 dark:stroke-zinc-600 stroke-1',
            isLeft
              ? 'fill-sky-500 dark:fill-sky-500'
              : 'fill-zinc-200 dark:fill-zinc-800 hover:fill-zinc-300 dark:hover:fill-zinc-750'
          )}
        />
        <text
          x="68"
          y="90"
          className={cn(
            'text-[11px] font-mono font-semibold transition-colors',
            isLeft ? 'fill-white' : 'fill-zinc-600 dark:fill-zinc-400'
          )}
          textAnchor="middle"
        >
          L ({buttonCounts[0] || 0})
        </text>

        {/* Right Click Button (Button 2) */}
        <path
          d="M 158 100 C 158 45, 104 42, 104 42 L 104 125 L 158 125 Z"
          className={cn(
            'transition-colors duration-75 cursor-pointer stroke-zinc-400 dark:stroke-zinc-600 stroke-1',
            isRight
              ? 'fill-sky-500 dark:fill-sky-500'
              : 'fill-zinc-200 dark:fill-zinc-800 hover:fill-zinc-300 dark:hover:fill-zinc-750'
          )}
        />
        <text
          x="132"
          y="90"
          className={cn(
            'text-[11px] font-mono font-semibold transition-colors',
            isRight ? 'fill-white' : 'fill-zinc-600 dark:fill-zinc-400'
          )}
          textAnchor="middle"
        >
          R ({buttonCounts[2] || 0})
        </text>

        {/* Middle Wheel Button (Button 1) */}
        <rect
          x="94"
          y="58"
          width="12"
          height="42"
          rx="6"
          className={cn(
            'transition-colors duration-75 cursor-pointer stroke-zinc-400 dark:stroke-zinc-600 stroke-1',
            isMiddle
              ? 'fill-amber-500 dark:fill-amber-500'
              : 'fill-zinc-300 dark:fill-zinc-700 hover:fill-zinc-400 dark:hover:fill-zinc-600'
          )}
        />

        {/* Side Back Button (Button 3) */}
        <path
          d="M 37 145 C 33 145, 33 175, 37 175 L 41 175 L 41 145 Z"
          className={cn(
            'transition-colors duration-75 stroke-zinc-400 dark:stroke-zinc-600 stroke-1',
            isBack
              ? 'fill-emerald-500 dark:fill-emerald-500'
              : 'fill-zinc-300 dark:fill-zinc-800'
          )}
        />

        {/* Side Forward Button (Button 4) */}
        <path
          d="M 37 115 C 33 115, 33 140, 37 140 L 41 140 L 41 115 Z"
          className={cn(
            'transition-colors duration-75 stroke-zinc-400 dark:stroke-zinc-600 stroke-1',
            isForward
              ? 'fill-emerald-500 dark:fill-emerald-500'
              : 'fill-zinc-300 dark:fill-zinc-800'
          )}
        />

        {/* Center Palm Logo / Badge */}
        <circle
          cx="100"
          cy="205"
          r="16"
          className="stroke-zinc-300 dark:stroke-zinc-700 fill-zinc-50 dark:fill-zinc-950 stroke-1"
        />
        <text
          x="100"
          y="209"
          className="text-[9px] font-mono font-bold fill-zinc-400 dark:fill-zinc-500 text-center"
          textAnchor="middle"
        >
          INPUT
        </text>
      </svg>

      {/* Button Bitmask & Legend */}
      <div className="mt-3 flex flex-wrap gap-2 justify-center text-xs font-mono">
        <span className={cn('px-2 py-0.5 rounded border transition-colors', isLeft ? 'bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 border-sky-800 dark:border-sky-300 font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700')}>
          L: {buttonCounts[0] || 0}
        </span>
        <span className={cn('px-2 py-0.5 rounded border transition-colors', isMiddle ? 'bg-amber-500 dark:bg-amber-400 text-zinc-950 dark:text-zinc-950 border-amber-600 dark:border-amber-300 font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700')}>
          M: {buttonCounts[1] || 0}
        </span>
        <span className={cn('px-2 py-0.5 rounded border transition-colors', isRight ? 'bg-sky-700 dark:bg-sky-400 text-white dark:text-zinc-950 border-sky-800 dark:border-sky-300 font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700')}>
          R: {buttonCounts[2] || 0}
        </span>
        <span className={cn('px-2 py-0.5 rounded border transition-colors', isBack ? 'bg-emerald-700 dark:bg-emerald-400 text-white dark:text-zinc-950 border-emerald-800 dark:border-emerald-300 font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700')}>
          Back: {buttonCounts[3] || 0}
        </span>
        <span className={cn('px-2 py-0.5 rounded border transition-colors', isForward ? 'bg-emerald-700 dark:bg-emerald-400 text-white dark:text-zinc-950 border-emerald-800 dark:border-emerald-300 font-bold' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700')}>
          Fwd: {buttonCounts[4] || 0}
        </span>
      </div>
    </div>
  );
};
