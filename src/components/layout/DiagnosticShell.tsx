import React, { ReactNode } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { DeviceSidebar } from './DeviceSidebar';
import { CapabilityBanner } from '../feedback/CapabilityBanner';

interface DiagnosticShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  bannerTopic?: 'polling' | 'chatter' | 'general' | 'keyboard';
  actions?: ReactNode;
}

export const DiagnosticShell: React.FC<DiagnosticShellProps> = ({
  children,
  title,
  subtitle,
  bannerTopic,
  actions,
}) => {
  return (
    <div className="flex flex-col lg:flex-row flex-1 w-full min-h-[calc(100vh-3.5rem)]">
      {/* Device Contextual Sidebar */}
      <DeviceSidebar />

      {/* Main Diagnostic Workspace */}
      <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
        <Breadcrumbs />

        {/* Page Title & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-sans">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>

        {bannerTopic && <CapabilityBanner topic={bannerTopic} />}

        {/* Diagnostic Stage Content */}
        <div className="space-y-6">{children}</div>
      </main>
    </div>
  );
};
