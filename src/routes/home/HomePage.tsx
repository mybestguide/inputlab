import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Mouse,
  Keyboard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sliders,
  Layers,
  RotateCw,
  Gauge,
  Cpu,
  HelpCircle,
  HardDrive,
  RefreshCw,
  AlertTriangle,
  Monitor,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface QuickInputEvent {
  type: 'key' | 'mouse';
  title: string;
  detail: string;
  timestamp: string;
}

export default function HomePage() {
  // Interactive Quick Sandbox State
  const [recentInputs, setRecentInputs] = useState<QuickInputEvent[]>([]);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const sandboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input or if focused elsewhere outside
      setActiveKey(e.code);
      const timeStr = new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 } as any);
      
      setRecentInputs((prev) => [
        {
          type: 'key',
          title: `Key: ${e.key === ' ' ? 'Space' : e.key}`,
          detail: `Code: ${e.code} | KeyCode: ${e.keyCode}`,
          timestamp: timeStr,
        },
        ...prev.slice(0, 4),
      ]);
    };

    const handleKeyUp = () => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleSandboxMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveButton(e.button);
    const buttonNames = ['Left Button', 'Middle Button', 'Right Button', 'Back Button (4)', 'Forward Button (5)'];
    const bName = buttonNames[e.button] || `Button ${e.button}`;
    const timeStr = new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 } as any);

    setRecentInputs((prev) => [
      {
        type: 'mouse',
        title: `Click: ${bName}`,
        detail: `Button Index: ${e.button} | Position: (${e.clientX}, ${e.clientY})`,
        timestamp: timeStr,
      },
      ...prev.slice(0, 4),
    ]);
  };

  const handleSandboxMouseUp = () => {
    setActiveButton(null);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is a keyboard tester?',
      a: 'A keyboard tester is a browser-based utility that checks whether your computer keyboard registers individual key presses properly. When you press a physical key on your keyboard, the tester detects the standard browser KeyboardEvent, matches it to the physical key layout, and highlights it on a visual keyboard map in real time. It allows you to confirm that switches actuate, identify non-functioning keys, and inspect modifier states without installing proprietary software.',
    },
    {
      q: 'How can I test my keyboard online?',
      a: 'To test your keyboard online with InputLab, connect your keyboard to your device via USB or Bluetooth, navigate to the Keyboard Test page (/keyboard), and start pressing keys. Each pressed key will illuminate on the virtual keyboard matrix. You can test alphanumeric keys, function rows (F1–F12), modifier keys (Shift, Ctrl, Alt, Windows/Command), spacebar stability, and even multi-key combinations (N-Key Rollover).',
    },
    {
      q: 'How can I test my mouse?',
      a: 'Open InputLab\'s Mouse Test (/mouse) to verify your mouse. You can click inside the testing bench to verify left click, right click, and middle scroll click. You can also test side thumb buttons (Forward and Back where supported by your browser), scroll the wheel in both directions to test encoder steps and detect scroll reversals, measure click speed (CPS), and use the chatter detector to check for unintended double clicks.',
    },
    {
      q: 'Do I need to install software to test my keyboard or mouse?',
      a: 'No. InputLab is 100% browser-based. It runs entirely on client-side Web APIs (PointerEvents, WheelEvents, and KeyboardEvents) natively supported by Google Chrome, Mozilla Firefox, Microsoft Edge, Apple Safari, Opera, and Brave. No executables, extensions, drivers, or administrative privileges are required.',
    },
    {
      q: 'Why should I test my keyboard or mouse?',
      a: 'Testing your input peripherals helps you quickly detect hardware defects such as worn mechanical switches, intermittent signal drops, sticky keys, broken scroll wheel encoders, or switch bounce causing double clicks. It is especially useful when purchasing a new device to verify out-of-box quality, troubleshooting gaming issues, or determining whether a problem stems from physical hardware or in-game software settings.',
    },
    {
      q: 'How do I check for a faulty mouse with double-click problems?',
      a: 'Mechanical mouse switches degrade over time due to contact wear or oxidation, resulting in switch chatter where a single physical click produces two electrical actuations in rapid succession (< 80 milliseconds). InputLab includes a dedicated Double-Click Chatter Detector (/mouse/chatter) that measures the exact millisecond interval between consecutive click events and flags debounce irregularities.',
    },
    {
      q: 'What is keyboard ghosting and key rollover (NKRO)?',
      a: 'Key rollover refers to how many keys a keyboard can accurately register simultaneously. Standard office keyboards often support 2-Key or 6-Key Rollover (6KRO), which can cause "ghosting"—where unpressed keys register or pressed keys are ignored when pressing multiple keys at once. Gaming and enthusiast mechanical keyboards usually support Full N-Key Rollover (NKRO). You can verify your keyboard\'s simultaneous key limit using InputLab\'s Key Rollover Test (/keyboard/rollover).',
    },
    {
      q: 'Can I test wireless, Bluetooth, and laptop input devices?',
      a: 'Yes. InputLab operates on the standard Human Interface Device (HID) input events provided by your operating system to the browser. It seamlessly works with USB wired peripherals, 2.4 GHz wireless dongles, Bluetooth keyboards and mice, trackpads, and built-in laptop keyboards.',
    },
    {
      q: 'How do I know if an input issue is hardware-related or software-related?',
      a: 'InputLab provides an isolated testing environment free from game engine overrides, keybind remappings, or heavy desktop software. If a key or mouse button fails to register inside InputLab across multiple browsers, the fault is almost certainly hardware-related (such as dirt in the switch, broken trace, or damaged cable). If it works normally in InputLab, the problem is likely an in-game keybind conflict, driver macro, or operating system software setting.',
    },
    {
      q: 'Is my input data private when testing on InputLab?',
      a: 'Yes, completely private. InputLab processes every keypress, click coordinate, and timing calculation entirely within your browser\'s local memory (RAM). No keystrokes, clicks, or device logs are ever transmitted to a server, tracked, or stored.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-white via-zinc-50/50 to-zinc-100/50 dark:from-zinc-950 dark:via-zinc-950/80 dark:to-zinc-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Status / Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/80 mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Browser-Based Diagnostic Bench &bull; Zero Installation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-sans leading-tight sm:leading-none">
              Test Your Keyboard and Mouse Online
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 mt-5 leading-relaxed max-w-2xl font-normal">
              InputLab provides fast, browser-based tools for checking keyboard keys, mouse buttons, clicks, movement, scrolling, and input responsiveness. Test any peripheral instantly without downloading software.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 w-full max-w-md">
              <Link
                to="/mouse"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-medium text-sm bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-zinc-950 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer min-h-[48px]"
              >
                <Mouse className="w-4 h-4" />
                <span>Test Your Mouse</span>
                <ArrowRight className="w-4 h-4 opacity-80" />
              </Link>

              <Link
                to="/keyboard"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-medium text-sm bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 border border-zinc-800 dark:border-zinc-200 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer min-h-[48px]"
              >
                <Keyboard className="w-4 h-4" />
                <span>Test Your Keyboard</span>
                <ArrowRight className="w-4 h-4 opacity-80" />
              </Link>
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 mt-8 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                100% In-Browser
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                No Drivers or Software
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Zero Data Telemetry
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Real-Time Millisecond Timing
              </span>
            </div>
          </div>

          {/* Interactive Live Input Sandbox Card */}
          <div className="mt-12 max-w-3xl mx-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  Interactive Quick Sandbox
                </span>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white mt-0.5">
                  Try It Live: Press Any Key or Click Below
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded">
                Listening for DOM Events
              </span>
            </div>

            {/* Interactive Target Area */}
            <div
              ref={sandboxRef}
              tabIndex={0}
              onMouseDown={handleSandboxMouseDown}
              onMouseUp={handleSandboxMouseUp}
              onContextMenu={(e) => e.preventDefault()}
              className="mt-4 p-6 sm:p-8 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/60 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/60 transition-colors flex flex-col items-center justify-center text-center cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-lg border transition-all ${activeButton !== null ? 'bg-sky-500 text-white border-sky-600 scale-110' : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'}`}>
                  <Mouse className="w-5 h-5" />
                </div>
                <div className={`p-2.5 rounded-lg border transition-all ${activeKey !== null ? 'bg-sky-500 text-white border-sky-600 scale-110' : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'}`}>
                  <Keyboard className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                Click with any mouse button or tap any key on your keyboard
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
                Left click, right click, middle click, or any keyboard key will register instantly.
              </p>
            </div>

            {/* Live Feed Output */}
            <div className="mt-4 pt-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                <span>Recent Signal Activity:</span>
                <span>{recentInputs.length > 0 ? `${recentInputs.length} events detected` : 'Awaiting user input...'}</span>
              </div>
              {recentInputs.length === 0 ? (
                <div className="text-xs text-zinc-400 font-mono text-center py-2 bg-zinc-50 dark:bg-zinc-950/40 rounded-lg border border-zinc-100 dark:border-zinc-800/80">
                  No input detected yet. Type a key or click inside the box above.
                </div>
              ) : (
                <div className="space-y-1.5 font-mono text-xs">
                  {recentInputs.map((ev, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/70 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {ev.type === 'mouse' ? (
                          <Mouse className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                        ) : (
                          <Keyboard className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                        <span className="font-semibold">{ev.title}</span>
                        <span className="text-zinc-400 hidden sm:inline">&bull; {ev.detail}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 shrink-0 ml-2">{ev.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Deep Links to Dedicated Suites */}
            <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">
                Need comprehensive testing and metrics?
              </span>
              <div className="flex items-center gap-3">
                <Link
                  to="/mouse"
                  className="font-medium text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                >
                  Full Mouse Test <ArrowRight className="w-3 h-3" />
                </Link>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <Link
                  to="/keyboard"
                  className="font-medium text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                >
                  Full Keyboard Test <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (3 Simple Steps) */}
      <section className="py-14 sm:py-18 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              How InputLab Works
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Test any keyboard or mouse in seconds with no setup required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 relative flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 flex items-center justify-center font-mono font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
                Connect Your Device
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">
                Plug in your USB cable, insert your wireless 2.4 GHz adapter, or pair your Bluetooth peripheral to your computer. InputLab works with standard operating system drivers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 relative flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 flex items-center justify-center font-mono font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
                Open the Appropriate Test
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">
                Choose the <Link to="/mouse" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">Online Mouse Test</Link> or the <Link to="/keyboard" className="text-sky-600 dark:text-sky-400 font-medium hover:underline">Keyboard Tester</Link> based on the peripheral you want to diagnose.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 relative flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 flex items-center justify-center font-mono font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
                Press Keys or Click Buttons
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">
                Press individual keys or click buttons directly on the screen. Watch real-time visual actuation states, event logs, and timing telemetry to confirm normal operation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEDICATED SUITES: MOUSE & KEYBOARD OVERVIEW */}
      <section className="py-14 sm:py-20 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Diagnostic Suites
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              Explore Our Testing Tools
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Comprehensive browser-based testing benches engineered for both mouse and keyboard peripherals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mouse Suite Card */}
            <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Mouse className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                    7 Diagnostic Modules
                  </span>
                </div>

                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  Online Mouse Test
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  Verify buttons, detect double-click chatter, test scroll wheel encoders, and benchmark click speed directly in your browser.
                </p>

                <div className="space-y-2.5 mb-6 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Left and Right Buttons:</strong> Inspect primary click actuation and hold persistence.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Middle &amp; Side Buttons:</strong> Check scroll wheel click and browser Back / Forward buttons.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Double-Click Chatter:</strong> Detect worn switch bounce under 80ms that causes accidental double clicks.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Scroll Wheel Encoder:</strong> Test vertical scroll delta steps, direction consistency, and reverse jumping.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Cursor Movement &amp; CPS:</strong> Benchmark clicks per second (CPS) and pointer event delivery rates.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-zinc-500">
                  <Link to="/mouse/buttons" className="hover:text-zinc-900 dark:hover:text-zinc-200">5-Button</Link> &bull;{' '}
                  <Link to="/mouse/chatter" className="hover:text-zinc-900 dark:hover:text-zinc-200">Chatter</Link> &bull;{' '}
                  <Link to="/mouse/scroll" className="hover:text-zinc-900 dark:hover:text-zinc-200">Scroll</Link> &bull;{' '}
                  <Link to="/mouse/cps" className="hover:text-zinc-900 dark:hover:text-zinc-200">CPS</Link>
                </div>
                <Link
                  to="/mouse"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-zinc-950 transition-colors cursor-pointer min-h-[40px]"
                >
                  <span>Open Mouse Test</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Keyboard Suite Card */}
            <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Keyboard className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                    8 Diagnostic Modules
                  </span>
                </div>

                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  Online Keyboard Tester
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  Check individual keys, identify missing or stuck switches, test modifier locks, and verify multi-key rollover (NKRO).
                </p>

                <div className="space-y-2.5 mb-6 text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Individual Key Detection:</strong> Real-time keymap covering 60%, TKL, and Full 104-key layouts.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Modifier &amp; Lock Keys:</strong> Test Shift, Ctrl, Alt, Windows/Command, Caps Lock, and Num Lock.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Key Rollover (NKRO):</strong> Press multiple keys simultaneously to test for ghosting and blocking limits.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Anti-Ghosting Triads:</strong> Detect matrix masking when common three-key gaming combinations are held.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Gaming Cluster &amp; Spacebar:</strong> Inspect WASD movement actuation and spacebar stabilizer balance.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-zinc-500">
                  <Link to="/keyboard/matrix" className="hover:text-zinc-900 dark:hover:text-zinc-200">Matrix</Link> &bull;{' '}
                  <Link to="/keyboard/rollover" className="hover:text-zinc-900 dark:hover:text-zinc-200">NKRO</Link> &bull;{' '}
                  <Link to="/keyboard/anti-ghosting" className="hover:text-zinc-900 dark:hover:text-zinc-200">Ghosting</Link> &bull;{' '}
                  <Link to="/keyboard/gaming-wasd" className="hover:text-zinc-900 dark:hover:text-zinc-200">WASD</Link>
                </div>
                <Link
                  to="/keyboard"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 transition-colors cursor-pointer min-h-[40px]"
                >
                  <span>Open Keyboard Test</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY DEVICE TESTING MATTERS */}
      <section className="py-14 sm:py-20 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Practical Diagnostics
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              Why Device Testing Matters
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              From everyday office productivity to competitive gaming, input hardware wears down over time. Regular testing helps you isolate issues before replacing hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1 */}
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
                Detecting Faulty or Unresponsive Keys
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Find switches that fail to actuate, drop input under light pressure, or require excessive force due to dust or mechanical fatigue.
              </p>
            </div>

            {/* 2 */}
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
                <Mouse className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
                Checking Mouse Buttons and Clicks
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Verify that primary left and right clicks, middle scroll wheel clicks, and side thumb buttons register cleanly with proper hold states.
              </p>
            </div>

            {/* 3 */}
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
                Identifying Double-Click Problems
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Detect mechanical switch contact bounce that causes a single physical click to register as two rapid unintended clicks.
              </p>
            </div>

            {/* 4 */}
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <RotateCw className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
                Testing Mouse Movement &amp; Scrolling
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Check whether scroll wheel encoders jump in reverse or skip steps, and evaluate pointer event regularity during movement.
              </p>
            </div>

            {/* 5 */}
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
                Verifying Newly Purchased Devices
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Perform an out-of-the-box quality inspection on new or refurbished peripherals to catch factory defects during the return window.
              </p>
            </div>

            {/* 6 */}
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
                Troubleshooting Intermittent Drops
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Determine whether weak wireless Bluetooth signals, low batteries, or frayed USB cables cause intermittent disconnects during use.
              </p>
            </div>

            {/* 7 */}
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <Gauge className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
                Checking Gaming Peripherals
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Test competitive requirements such as N-Key Rollover, WASD cluster response, spacebar stabilizer wobble, and click speed (CPS).
              </p>
            </div>

            {/* 8 */}
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                <Monitor className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
                Testing Across Docks &amp; New PCs
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Ensure your operating system and USB hub properly recognize every key code and pointer coordinate without missing generic HID drivers.
              </p>
            </div>

            {/* 9 */}
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
                Hardware vs. Software Diagnosis
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Instantly isolate whether an input failure is a physical hardware fault or a software conflict caused by in-game keybinds or desktop macros.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE INPUTLAB */}
      <section className="py-14 sm:py-20 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              The InputLab Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              Why Test Your Devices with InputLab?
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Engineered with transparency and precision, InputLab delivers clean diagnostics without marketing hype or unsupported claims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 font-mono">
                Browser-Based
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Test directly from any modern web browser on Windows, macOS, Linux, or ChromeOS. Runs smoothly on desktop, laptop, and work machines.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 font-mono">
                No Installation Required
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Start testing immediately without installing software, downloading executable files, or requesting IT administrative permissions.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 font-mono">
                Fast and Simple
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Immediate, color-coded visual feedback highlights active keys and clicks in real time, making problems effortless to identify.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 font-mono">
                Works with Common Devices
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Engineered for mechanical, membrane, and optical keyboards, standard and gaming mice, trackpads, and ergonomic peripherals.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 font-mono">
                Useful for Troubleshooting
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Isolate specific faulty components—whether an individual mechanical switch, an encoder wheel, or a ghosted gaming key triad.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1.5 font-mono">
                Free &amp; Accessible
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Free for everyone with no sign-ups, no paywalls, and no intrusive ads. Clean, accessible contrast in both light and dark themes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TARGET AUDIENCE / USE CASES */}
      <section className="py-14 sm:py-20 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Built for Everyone
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              Who Uses InputLab?
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Whether you are troubleshooting a broken laptop key or calibrating an esports mouse, InputLab provides instant clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                Gamers &amp; Esports
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Verify rapid WASD actuation, measure CPS speed, and confirm zero-debounce switch chatter before competing.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                Developers &amp; QA
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Inspect raw DOM event properties, scancodes, and browser API boundaries when building keyboard navigation.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                IT &amp; Support Teams
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Quickly triage employee hardware tickets and verify whether a reported defective keyboard or mouse warrants RMA replacement.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                Buyers &amp; Setups
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Test newly unboxed mechanical keyboards, custom builds, and second-hand marketplace purchases for defective switches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (SEO & AI Answer Optimized) */}
      <section className="py-14 sm:py-20 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Knowledge Base &amp; FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Everything you need to know about testing keyboards and mice online in your browser.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                  >
                    <span className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-sky-600 dark:text-sky-400' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/80">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. BOTTOM CTA CALLOUT */}
      <section className="py-16 sm:py-20 bg-white dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="p-8 sm:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Ready to Test Your Input Peripherals?
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-xl mx-auto">
              Choose your test suite below and diagnose buttons, keys, chatter, and scrolling in real time without downloading any software.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8">
              <Link
                to="/mouse"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm bg-sky-600 hover:bg-sky-700 text-white dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-zinc-950 shadow-sm transition-colors cursor-pointer min-h-[44px]"
              >
                <Mouse className="w-4 h-4" />
                <span>Launch Mouse Test</span>
              </Link>
              <Link
                to="/keyboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 border border-zinc-800 dark:border-zinc-200 shadow-sm transition-colors cursor-pointer min-h-[44px]"
              >
                <Keyboard className="w-4 h-4" />
                <span>Launch Keyboard Test</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
