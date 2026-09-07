/**
 * InputLab Design Tokens
 * Monochromatic cool undertone palette with instrument cyan accent
 * and strict physical metrology typography and spacing rules.
 */

export const colors = {
  light: {
    surfaceCanvas: '#F8FAFC',
    surfacePanel: '#FFFFFF',
    surfaceElevated: '#F1F5F9',
    surfaceSunken: '#E2E8F0',
    borderSubtle: '#E2E8F0',
    borderProminent: '#CBD5E1',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    accentPrimary: '#0284C7',
    accentSubtle: '#E0F2FE',
    statusPass: '#059669',
    statusWarning: '#D97706',
    statusDefect: '#DC2626',
  },
  dark: {
    surfaceCanvas: '#0B0F17',
    surfacePanel: '#111726',
    surfaceElevated: '#182234',
    surfaceSunken: '#070A10',
    borderSubtle: '#1E293B',
    borderProminent: '#334155',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#475569',
    accentPrimary: '#38BDF8',
    accentSubtle: '#0C2B45',
    statusPass: '#34D399',
    statusWarning: '#FBBF24',
    statusDefect: '#F87171',
  },
} as const;

export const spacing = {
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  12: '3rem',    // 48px
} as const;

export const radius = {
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  full: '9999px',
} as const;

export const typography = {
  fontSans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontMono: "'JetBrains Mono', monospace",
  scale: {
    displayLg: { size: '2.25rem', lineHeight: '2.75rem', weight: 700 },
    heading1: { size: '1.5rem', lineHeight: '2rem', weight: 700 },
    heading2: { size: '1.125rem', lineHeight: '1.625rem', weight: 600 },
    headingMono: { size: '0.875rem', lineHeight: '1.25rem', weight: 700 },
    bodyBase: { size: '0.9375rem', lineHeight: '1.5rem', weight: 400 },
    bodySm: { size: '0.8125rem', lineHeight: '1.25rem', weight: 400 },
    dataMono: { size: '0.8125rem', lineHeight: '1.125rem', weight: 500 },
    dataMonoXs: { size: '0.6875rem', lineHeight: '1rem', weight: 600 },
  },
} as const;

export type ThemeMode = 'light' | 'dark' | 'system';
