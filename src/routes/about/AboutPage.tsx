import React from 'react';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { useBrowserCapabilities } from '../../hooks/useBrowserCapabilities';
import { ShieldCheck, Cpu, HardDrive, Lock, EyeOff, Activity } from 'lucide-react';

export default function AboutPage() {
  const { capabilities } = useBrowserCapabilities();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumbs />

      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-sans">
          About InputLab
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Precision, client-side input peripheral diagnostic bench engineered with scientific transparency.
        </p>
      </div>

      <div className="space-y-8">
        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <Lock className="w-6 h-6 text-sky-500 mb-2" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1 font-mono">
              100% Client-Side Privacy
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Every keystroke, click coordinate, and timing timestamp is processed solely in browser volatile RAM. No data ever leaves your computer.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <ShieldCheck className="w-6 h-6 text-emerald-500 mb-2" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1 font-mono">
              Scientific Transparency
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              We never fabricate unsupported measurements. If an API cannot reliably verify a physical attribute (like optical DPI or bare-metal polling rate), we clearly explain why.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <Cpu className="w-6 h-6 text-amber-500 mb-2" />
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1 font-mono">
              Zero Garbage Collection Stalls
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Engineered with static circular buffers and bounded arrays to ensure smooth event loops without memory leaks or micro-stutters during testing.
            </p>
          </div>
        </div>

        {/* Live Browser Environment Audit Table */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
            <Activity className="w-4 h-4 text-sky-500" />
            <span>Host Browser Diagnostic Environment Audit</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex justify-between items-center">
              <span className="text-zinc-500">Estimated Display Refresh:</span>
              <strong className="text-zinc-900 dark:text-white">{capabilities?.estimatedDisplayHz ?? '...'} Hz</strong>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex justify-between items-center">
              <span className="text-zinc-500">Pointer Events Specification:</span>
              <strong className="text-zinc-900 dark:text-white">Level {capabilities?.pointerEventLevel ?? 2}</strong>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex justify-between items-center">
              <span className="text-zinc-500">Pointer Lock API:</span>
              <strong className={capabilities?.supportsPointerLock ? 'text-emerald-500' : 'text-zinc-400'}>
                {capabilities?.supportsPointerLock ? 'Supported' : 'Unavailable'}
              </strong>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex justify-between items-center">
              <span className="text-zinc-500">Pointer Coalescing API:</span>
              <strong className={capabilities?.supportsCoalescedEvents ? 'text-emerald-500' : 'text-zinc-400'}>
                {capabilities?.supportsCoalescedEvents ? 'Supported' : 'Unavailable'}
              </strong>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex justify-between items-center">
              <span className="text-zinc-500">Timer Resolution (Quantized):</span>
              <strong className="text-zinc-900 dark:text-white">~{capabilities?.timerPrecisionMs ?? 1} ms</strong>
            </div>

            <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex justify-between items-center">
              <span className="text-zinc-500">Sandboxed Iframe Container:</span>
              <strong className="text-zinc-900 dark:text-white">{capabilities?.isIframe ? 'Yes (Embedded)' : 'No (Top Window)'}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
