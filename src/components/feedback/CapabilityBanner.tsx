import React, { useState } from 'react';
import { Info, X, ExternalLink } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface CapabilityBannerProps {
  topic?: 'polling' | 'chatter' | 'general' | 'keyboard';
}

export const CapabilityBanner: React.FC<CapabilityBannerProps> = ({ topic = 'general' }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const content = {
    polling: {
      title: 'Browser Measurement Reality: Event Dispatch vs. Hardware Polling',
      text: 'Web browsers dispatch pointer events synchronized with OS thread ticks and display compositors. Even with high-polling mice (1000Hz - 8000Hz), effective browser dispatch rate is capped. Do not mistake browser dispatch rate for hardware USB limits.',
      link: '/learn/polling-rates',
    },
    chatter: {
      title: 'Evaluating Switch Chatter & Bounce',
      text: 'Physical switches exhibit electrical contact bounce. InputLab detects intervals below 80ms (and particularly <30ms) to identify failing switches. High-speed human clicking rarely drops below 70-80ms.',
      link: '/learn/switch-chatter',
    },
    keyboard: {
      title: 'Browser Metrology Disclosure: Input Event Delivery vs. Physical Matrix Circuits',
      text: 'Web browsers receive W3C KeyboardEvents via OS HID pipelines. The browser measures delivery timestamps and concurrent active keys, but cannot directly probe PCB traces, switch actuation depth, or hardware anti-ghosting diodes.',
      link: '/learn',
    },
    general: {
      title: 'InputLab Scientific Transparency Notice',
      text: 'All diagnostics run 100% client-side in browser memory. Browser APIs can measure event arrival timestamps, button bitmasks, and relative movement deltas, but cannot verify physical switch actuation force, optical sensor DPI, or hardware firmware debounce.',
      link: '/learn',
    },
  }[topic];

  return (
    <div className="mb-5 p-3.5 sm:p-4 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/60 dark:bg-sky-950/20 text-xs text-sky-950 dark:text-sky-200 flex items-start justify-between gap-3">
      <div className="flex items-start gap-2.5">
        <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <span className="font-semibold font-mono">{content.title}</span>
          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
            {content.text}
          </p>
          <NavLink
            to={content.link}
            className="inline-flex items-center gap-1 font-medium text-sky-700 dark:text-sky-400 hover:underline mt-0.5"
          >
            <span>Read full methodology documentation</span>
            <ExternalLink className="w-3 h-3" />
          </NavLink>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss banner"
        className="p-1 rounded text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
