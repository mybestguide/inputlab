export interface BrowserEnvironmentInfo {
  estimatedDisplayHz: number;
  pointerEventLevel: number;
  supportsCoalescedEvents: boolean;
  supportsPointerLock: boolean;
  supportsGamepad: boolean;
  timerPrecisionMs: number;
  isIframe: boolean;
  userAgent: string;
}
