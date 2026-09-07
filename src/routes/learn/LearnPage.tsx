import React from 'react';
import { Breadcrumbs } from '../../components/layout/Breadcrumbs';
import { BookOpen, Cpu, Zap, Shield, Clock } from 'lucide-react';

export default function LearnPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumbs />

      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-sans">
          Measurement Methodology & Hardware Science
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Rigorous technical explanations of physical peripheral mechanics, electrical contacts, and browser API boundaries.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-sans">
        {/* Article 1: Polling Rates */}
        <article className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="flex items-center gap-2.5 font-mono text-xs font-bold text-sky-600 dark:text-sky-400 uppercase mb-2">
            <Cpu className="w-4 h-4" />
            <span>Article 01 &bull; USB vs. Browser Telemetry</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
            Why Browsers Cannot Directly Verify 1000Hz - 8000Hz Hardware Polling Rates
          </h2>
          <div className="space-y-3 text-zinc-600 dark:text-zinc-400">
            <p>
              A high-end gaming mouse may poll its optical sensor and USB transceiver at 1,000 Hz, 4,000 Hz, or 8,000 Hz (sending HID reports every 1 ms down to 125 &mu;s). However, web applications do not run on bare metal; they run within an OS process managed by a browser rendering engine (Chromium, Gecko, or WebKit).
            </p>
            <p>
              In modern browsers, standard <code className="font-mono px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">pointermove</code> events are synchronized with the browser&rsquo;s event loop and display refresh rate (e.g. 60Hz, 144Hz, or 240Hz). Even if the operating system receives 1,000 USB packets per second, the browser coalesces these reports into a single DOM event per animation frame unless the <code className="font-mono px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">getCoalescedEvents()</code> API is explicitly called.
            </p>
            <div className="p-3.5 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900 font-mono text-xs text-sky-950 dark:text-sky-300">
              Key takeaway: Any web tool claiming to &ldquo;verify true 8000Hz mouse hardware&rdquo; in pure JavaScript is misleading. Browsers measure <em>event delivery cadence</em>, not internal USB microcontroller bus clocking.
            </div>
          </div>
        </article>

        {/* Article 2: Switch Chatter */}
        <article className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="flex items-center gap-2.5 font-mono text-xs font-bold text-amber-600 dark:text-amber-400 uppercase mb-2">
            <Zap className="w-4 h-4" />
            <span>Article 02 &bull; Contact Mechanics</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
            Switch Chatter: The Physics of Electrical Contact Bounce
          </h2>
          <div className="space-y-3 text-zinc-600 dark:text-zinc-400">
            <p>
              Mechanical switches (such as Omron, Kailh, or Cherry MX switches) use physical metal leaf springs that strike stationary contact points. When actuated, elastic collision dynamics cause the contacts to rebound and bounce off each other several times across a span of 1 to 5 milliseconds before establishing stable contact.
            </p>
            <p>
              To prevent these bounces from registering as rapid multiple clicks, peripheral firmwares implement a <strong>debounce algorithm</strong> (e.g., deferring release or ignoring pulses within an 8-12ms window). Over time, atmospheric oxidation, fretting wear, and spring fatigue widen the bounce window. When the bounce duration exceeds the firmware&rsquo;s debounce threshold, the host OS receives an unwanted &ldquo;double-click&rdquo;.
            </p>
            <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 font-mono text-xs text-amber-950 dark:text-amber-300">
              InputLab Methodology: Deliberate single clicks with interval arrival times below 80ms (and particularly &lt;30ms) strongly indicate physical contact chatter, as human neuromuscular motor units rarely cycle faster than 75ms.
            </div>
          </div>
        </article>

        {/* Article 3: Spectre Mitigations */}
        <article className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="flex items-center gap-2.5 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2">
            <Clock className="w-4 h-4" />
            <span>Article 03 &bull; Browser Security Architecture</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
            Web Timing Precision: Spectre Mitigations & Performance.now()
          </h2>
          <div className="space-y-3 text-zinc-600 dark:text-zinc-400">
            <p>
              Following the discovery of speculative execution side-channel attacks (Spectre and Meltdown), major browser vendors intentionally reduced the resolution of <code className="font-mono px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">performance.now()</code>.
            </p>
            <p>
              While hardware timers offer sub-microsecond precision, modern browsers quantize timestamps to increments between 20 &mu;s and 1,000 &mu;s (1 ms) and may inject pseudorandom micro-jitter to thwart cache timing attacks. InputLab accounts for this quantization across all statistical summaries and histograms.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
