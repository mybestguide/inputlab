export type DevicePillar = 'mouse' | 'keyboard' | 'learn' | 'about';

export type MouseTestId = 
  | 'overview'
  | 'buttons'
  | 'click'
  | 'chatter'
  | 'scroll'
  | 'cps'
  | 'motion';

export type KeyboardTestId = 
  | 'overview'
  | 'matrix'
  | 'rollover'
  | 'anti-ghosting'
  | 'chatter'
  | 'gaming-wasd'
  | 'spacebar'
  | 'modifiers';

export interface TestMetadata {
  id: string;
  name: string;
  shortDesc: string;
  category: string;
  path: string;
}
