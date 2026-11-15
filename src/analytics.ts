// src/analytics.ts
import { AnalyticsEventType, AnalyticsEventRecord, UtmSourceData } from './types';

const ANALYTICS_STORAGE_KEY = 'applied_ai_analytics_events';
const UTM_STORAGE_KEY = 'applied_ai_utm_source';

// In-memory listener subscribers for real-time reactivity in the Prototype Notes drawer
type AnalyticsListener = (events: AnalyticsEventRecord[]) => void;
const listeners: Set<AnalyticsListener> = new Set();

/**
 * Capture UTM and referrer data on landing and persist to sessionStorage
 */
export function initUtmTracking(): UtmSourceData {
  if (typeof window === 'undefined') {
    return { referrer: '', landing_path: '/' };
  }

  try {
    const existing = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (existing) {
      return JSON.parse(existing) as UtmSourceData;
    }

    const params = new URLSearchParams(window.location.search);
    const utmData: UtmSourceData = {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_content: params.get('utm_content') || undefined,
      utm_term: params.get('utm_term') || undefined,
      referrer: document.referrer || 'direct',
      landing_path: window.location.pathname + window.location.search
    };

    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmData));
    return utmData;
  } catch {
    return { referrer: 'direct', landing_path: '/' };
  }
}

export function getStoredUtmData(): UtmSourceData {
  return initUtmTracking();
}

/**
 * Retrieve current analytics events from localStorage
 */
export function getStoredEvents(): AnalyticsEventRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Subscribe to real-time analytics events
 */
export function subscribeAnalytics(listener: AnalyticsListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Clear analytics events
 */
export function clearAnalyticsEvents(): void {
  try {
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
    listeners.forEach((fn) => fn([]));
  } catch (err) {
    console.error('Failed to clear analytics events', err);
  }
}

/**
 * Central analytics dispatcher
 */
export function track(event: AnalyticsEventType, properties: Record<string, unknown> = {}): void {
  const record: AnalyticsEventRecord = {
    id: 'evt_' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    event,
    properties
  };

  // 1. Console log with distinct visual badge
  // eslint-disable-next-line no-console
  console.log(
    `%c[ANALYTICS] ${event}%c`,
    'background: #11705B; color: #FAF7F2; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
    '',
    properties
  );

  // 2. Persist to localStorage (capped at 100 recent events)
  try {
    const existing = getStoredEvents();
    const updated = [record, ...existing].slice(0, 100);
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(updated));

    // Notify listeners
    listeners.forEach((fn) => fn(updated));
  } catch (err) {
    console.warn('Analytics storage failed', err);
  }
}
