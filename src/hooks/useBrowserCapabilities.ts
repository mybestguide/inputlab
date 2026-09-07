import { useState, useEffect } from 'react';
import { BrowserEnvironmentInfo } from '../types/environment';
import { detectCapabilities } from '../core/capabilities/refreshRateDetector';

export function useBrowserCapabilities(): {
  capabilities: BrowserEnvironmentInfo | null;
  loading: boolean;
} {
  const [capabilities, setCapabilities] = useState<BrowserEnvironmentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    detectCapabilities().then((info) => {
      if (mounted) {
        setCapabilities(info);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { capabilities, loading };
}
