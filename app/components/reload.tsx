'use client';

import { useEffect } from 'react';

export default function AutoReload() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.href.includes('reloaded=true')) {
      const url = new URL(window.location.href);
      url.searchParams.set('reloaded', 'true');
      window.location.replace(url.toString());
    }
  }, []);

  return null;
}