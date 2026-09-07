export * from './device';
export * from './environment';
export * from './events';
export * from './metrics';
export * from './results';

export type DiagnosticStatus = 'pass' | 'warning' | 'defect' | 'neutral';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface DiagnosticBannerProps {
  title: string;
  subtitle: string;
  topic?: string;
  status?: DiagnosticStatus;
}
