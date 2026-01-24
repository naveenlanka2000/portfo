'use client';

import { useEffect, useState } from 'react';

export function usePageVisibility() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState !== 'hidden');
    onChange();
    document.addEventListener('visibilitychange', onChange, { passive: true });
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  return visible;
}
