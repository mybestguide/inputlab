export interface BaseTelemetryEvent {
  id: string;
  timestamp: number; // performance.now()
  device: 'mouse' | 'keyboard';
}

export interface MouseEventRecord extends BaseTelemetryEvent {
  device: 'mouse';
  type: 'down' | 'up' | 'move' | 'wheel';
  button: number; // 0=L, 1=M, 2=R, 3=Back, 4=Fwd
  buttons: number; // bitmask
  clientX: number;
  clientY: number;
  deltaX?: number;
  deltaY?: number;
  deltaMode?: number;
  intervalMs?: number;
  isChatterAnomaly?: boolean;
}

export interface KeyboardEventRecord extends BaseTelemetryEvent {
  device: 'keyboard';
  type: 'keydown' | 'keyup';
  code: string; // e.code (e.g. 'KeyW')
  key: string;  // e.key
  repeat: boolean;
  activeCount: number;
  intervalMs?: number;
  isChatterAnomaly?: boolean;
  location?: number;
  keyCode?: number;
  holdDurationMs?: number;
  modifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
    capsLock: boolean;
    numLock: boolean;
  };
}
