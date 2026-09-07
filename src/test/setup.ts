import '@testing-library/jest-dom/vitest';

// Ensure requestAnimationFrame and performance.now exist in test environment
if (typeof window !== 'undefined') {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
      return setTimeout(() => callback(performance.now()), 16) as unknown as number;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (id: number): void => {
      clearTimeout(id);
    };
  }
}
