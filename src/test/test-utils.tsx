import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

/**
 * Custom render wrapper if global providers are needed.
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options });
}

/**
 * Event simulation helpers for testing peripheral inputs
 */
export const testUtils = {
  createMockPointerEvent(type: string, init: Partial<PointerEventInit> = {}): PointerEvent {
    return new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      button: 0,
      buttons: 1,
      clientX: 100,
      clientY: 100,
      ...init,
    });
  },

  createMockKeyboardEvent(type: string, init: Partial<KeyboardEventInit> = {}): KeyboardEvent {
    return new KeyboardEvent(type, {
      bubbles: true,
      cancelable: true,
      key: 'w',
      code: 'KeyW',
      ...init,
    });
  },
};

export * from '@testing-library/react';
export { customRender as render };
