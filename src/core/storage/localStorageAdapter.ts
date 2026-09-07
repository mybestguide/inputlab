export interface UserSettings {
  theme: 'dark' | 'light';
  chatterThresholdMs: number;
  cpsDurationSeconds: number;
  soundEnabled: boolean;
  keyboardLayout: 'ansi-tkl' | 'ansi-full' | 'compact-60';
}

const STORAGE_KEY = 'inputlab_settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  chatterThresholdMs: 75,
  cpsDurationSeconds: 5,
  soundEnabled: true,
  keyboardLayout: 'ansi-tkl',
};

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<UserSettings>): UserSettings {
  try {
    const current = loadSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
