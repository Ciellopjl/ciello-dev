"use client";

// Utility for custom event tracking
export function trackEvent(action: string, category: string, label?: string) {
  // 1. Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }

  // 2. Internal Analytics API
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link: label || action }),
    }).catch(() => {}); // Silent fail
  }
}

// Client-side PageView tracker component
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pathname }),
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
