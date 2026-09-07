import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none cursor-pointer select-none';

    const variantStyles = {
      primary: 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold dark:bg-sky-400 dark:hover:bg-sky-300 dark:active:bg-sky-200 dark:text-zinc-950 dark:hover:text-zinc-950 border border-transparent shadow-xs',
      secondary: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 active:bg-zinc-300 dark:active:bg-zinc-650 border border-zinc-200 dark:border-zinc-700',
      outline: 'bg-transparent text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 active:bg-zinc-200 dark:active:bg-zinc-700 border border-zinc-300 dark:border-zinc-700 shadow-xs',
      ghost: 'bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 active:bg-zinc-200 dark:active:bg-zinc-700 border border-transparent',
      destructive: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold dark:bg-rose-600 dark:hover:bg-rose-700 dark:active:bg-rose-800 dark:text-white border border-transparent shadow-xs',
    };

    const sizeStyles = {
      sm: 'h-8 px-3 rounded-md text-xs',
      md: 'h-9 px-4 rounded-lg text-xs', // 2x padding ratio (h-9 is 36px, px-4 is 16px)
      lg: 'h-11 px-6 rounded-lg text-sm',
      icon: 'h-9 w-9 p-0 rounded-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
