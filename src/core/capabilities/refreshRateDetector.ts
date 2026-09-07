import { BrowserEnvironmentInfo } from '../../types/environment';

export function estimateDisplayRefreshRate(): Promise<number> {
  return new Promise((resolve) => {
    let frameCount = 0;
    let startTime: number | null = null;
    let rafId: number;

    const timeout = setTimeout(() => {
      cancelAnimationFrame(rafId);
      resolve(60); // Default safe fallback
    }, 1500);

    function step(timestamp: number) {
      if (startTime === null) {
        startTime = timestamp;
      }
      frameCount++;

      if (frameCount >= 60) {
        clearTimeout(timeout);
        const elapsed = timestamp - startTime;
        const fps = Math.round((frameCount / elapsed) * 1000);
        // Normalize to common monitor intervals (60, 75, 120, 144, 165, 240, 360)
        let normalized = fps;
        const standards = [60, 75, 90, 120, 144, 165, 240, 280, 360];
        for (const std of standards) {
          if (Math.abs(fps - std) <= 3) {
            normalized = std;
            break;
          }
        }
        resolve(normalized);
        return;
      }

      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);
  });
}

export async function detectCapabilities(): Promise<BrowserEnvironmentInfo> {
  const coalescing = typeof window !== 'undefined' && 'PointerEvent' in window && 'getCoalescedEvents' in PointerEvent.prototype;
  const pointerLock = typeof document !== 'undefined' && 'requestPointerLock' in Element.prototype;
  const gamepad = typeof navigator !== 'undefined' && 'getGamepads' in navigator;
  const isIframe = typeof window !== 'undefined' && window.self !== window.top;

  // Measure timer precision
  let timerPrecision = 1.0;
  if (typeof performance !== 'undefined' && performance.now) {
    const t0 = performance.now();
    let t1 = performance.now();
    let loops = 0;
    while (t1 === t0 && loops < 10000) {
      t1 = performance.now();
      loops++;
    }
    const diff = t1 - t0;
    if (diff > 0) {
      timerPrecision = Number(diff.toFixed(3));
    }
  }

  const hz = await estimateDisplayRefreshRate();

  return {
    estimatedDisplayHz: hz,
    pointerEventLevel: coalescing ? 3 : 2,
    supportsCoalescedEvents: coalescing,
    supportsPointerLock: pointerLock,
    supportsGamepad: gamepad,
    timerPrecisionMs: timerPrecision,
    isIframe,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
  };
}
