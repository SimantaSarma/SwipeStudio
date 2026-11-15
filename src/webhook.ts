// src/webhook.ts
import { WebhookLeadPayload, LeadStatus, CtaLocation, UserSegment, PreferredBatch } from './types';
import { getStoredUtmData } from './analytics';
import { CONFIG } from './config';

const LEADS_STORAGE_KEY = 'applied_ai_leads';
const ACTIVE_LEAD_SESSION_KEY = 'applied_ai_current_lead';

// Subscribers for real-time lead updates in Prototype drawer
type LeadListener = (leads: WebhookLeadPayload[]) => void;
const leadListeners: Set<LeadListener> = new Set();

export function subscribeLeads(listener: LeadListener): () => void {
  leadListeners.add(listener);
  return () => {
    leadListeners.delete(listener);
  };
}

export function getStoredLeads(): WebhookLeadPayload[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearStoredLeads(): void {
  try {
    localStorage.removeItem(LEADS_STORAGE_KEY);
    sessionStorage.removeItem(ACTIVE_LEAD_SESSION_KEY);
    leadListeners.forEach((fn) => fn([]));
  } catch (err) {
    console.error('Failed to clear leads', err);
  }
}

/**
 * Normalizes Indian mobile number to E.164 (+91XXXXXXXXXX)
 * Handles: +91, 0 prefix, spaces, dashes, parentheses
 */
export function normalizeIndianPhone(input: string): { valid: boolean; normalized: string; error?: string } {
  if (!input) {
    return { valid: false, normalized: '', error: 'WhatsApp number is required' };
  }

  // Remove all non-digit characters except leading +
  let cleaned = input.trim().replace(/[\s\-\(\)\.]/g, '');

  // Strip leading +91 or 91 if 12 digits
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    // Strip leading trunk zero
    cleaned = cleaned.slice(1);
  }

  // Verify it is strictly 10 digits
  if (!/^\d{10}$/.test(cleaned)) {
    return {
      valid: false,
      normalized: cleaned,
      error: 'Please enter a valid 10-digit mobile number'
    };
  }

  // Must start with 6, 7, 8, or 9 for Indian mobile networks
  if (!/^[6-9]/.test(cleaned)) {
    return {
      valid: false,
      normalized: cleaned,
      error: 'Indian mobile numbers start with 6, 7, 8, or 9'
    };
  }

  return {
    valid: true,
    normalized: `+91${cleaned}`
  };
}

/**
 * Check for common email typo domains
 */
export function checkEmailTypo(email: string): string | null {
  if (!email || !email.includes('@')) return null;
  const parts = email.split('@');
  if (parts.length !== 2) return null;

  const domain = parts[1].toLowerCase().trim();
  const typoMap: Record<string, string> = {
    'gamil.com': 'gmail.com',
    'gmaill.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gmaul.com': 'gmail.com',
    'yaho.com': 'yahoo.com',
    'yahooo.com': 'yahoo.com',
    'hotmial.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'rediffmial.com': 'rediffmail.com'
  };

  if (typoMap[domain]) {
    return `Did you mean ${parts[0]}@${typoMap[domain]}?`;
  }
  return null;
}

/**
 * Deterministic Idempotency Key generator: hash(whatsapp + cohort)
 */
export async function generateIdempotencyKey(whatsapp: string, cohort: string): Promise<string> {
  const message = `${whatsapp.trim()}_${cohort.trim()}`;
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgUint8 = new TextEncoder().encode(message);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
    } catch {
      // Fallback
    }
  }

  // Simple string hash fallback
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `idemp_${Math.abs(hash).toString(16)}_${cohort}`;
}

/**
 * Generate standard UUID v4
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface PostLeadParams {
  name: string;
  whatsappRaw: string;
  segment: UserSegment;
  status: LeadStatus;
  cta: CtaLocation;
  email?: string;
  trackId?: string;
  org?: string;
  city?: string;
  batch?: PreferredBatch;
  goal?: string;
  consentAccepted?: boolean;
}

export interface PostLeadResult {
  success: boolean;
  leadId: string;
  isDuplicate: boolean;
  message: string;
  payload: WebhookLeadPayload;
}

/**
 * Main webhook dispatcher with idempotency, localStorage persistence, simulation fallback, and duplicate check
 */
export async function submitLead(params: PostLeadParams): Promise<PostLeadResult> {
  const { valid, normalized, error } = normalizeIndianPhone(params.whatsappRaw);
  if (!valid) {
    throw new Error(error || 'Invalid phone number');
  }

  const utmData = getStoredUtmData();
  const cohort = CONFIG.programme.cohortCode; // "2027-01"

  // Check existing session or leads for existing lead_id
  let existingLeadId: string | null = null;
  try {
    const sessionData = sessionStorage.getItem(ACTIVE_LEAD_SESSION_KEY);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      if (parsed.whatsapp_e164 === normalized) {
        existingLeadId = parsed.lead_id;
      }
    }
  } catch {
    // Ignore
  }

  const leadId = existingLeadId || generateUUID();
  const idempotencyKey = await generateIdempotencyKey(normalized, cohort);

  // Check if this lead already completed previously
  const storedLeads = getStoredLeads();
  const existingCompleted = storedLeads.find(
    (l) => l.whatsapp_e164 === normalized && l.cohort === cohort && l.status === 'complete'
  );

  if (existingCompleted && params.status === 'complete') {
    // Friendly duplicate acknowledgment without error tone
    return {
      success: true,
      leadId: existingCompleted.lead_id,
      isDuplicate: true,
      message: "You're already on the list — we'll WhatsApp you with details shortly.",
      payload: existingCompleted
    };
  }

  const payload: WebhookLeadPayload = {
    lead_id: leadId,
    status: params.status,
    created_at: new Date().toISOString(),
    name: params.name.trim(),
    whatsapp_e164: normalized,
    email: params.email ? params.email.trim().toLowerCase() : undefined,
    segment: params.segment,
    track: params.trackId,
    org: params.org ? params.org.trim() : undefined,
    city: params.city ? params.city.trim() : undefined,
    batch: params.batch,
    goal: params.goal ? params.goal.trim() : undefined,
    consent: {
      accepted: params.consentAccepted ?? (params.status === 'partial' ? false : true),
      text_version: 'v1.0-202611',
      timestamp: new Date().toISOString()
    },
    source: utmData,
    cohort: '2027-01',
    cta: params.cta,
    page_variant: 'main-v1'
  };

  const webhookUrl = CONFIG.webhookUrl;

  if (webhookUrl && webhookUrl.trim().length > 0) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
          'X-Source': 'Applied-AI-Studio-Landing'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.warn('Webhook responded with non-200 code', response.status);
      }
    } catch (netErr) {
      // Documented CORS / offline behavior: log and continue to persist locally
      console.warn('Browser fetch to webhook failed (often CORS on n8n Webhook node or offline)', netErr);
    }
  } else {
    // Simulated webhook: 600ms realistic delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    // eslint-disable-next-line no-console
    console.log(
      '%c[MOCK WEBHOOK POST SUCCESS]%c',
      'background: #F2A93B; color: #16211F; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
      '',
      {
        endpoint: 'Simulated (Set VITE_LEAD_WEBHOOK_URL to connect live n8n/Make)',
        idempotencyKey,
        payload
      }
    );
  }

  // Persist lead locally
  try {
    const existing = getStoredLeads();
    // Replace if lead_id exists (e.g. updating partial to complete), else prepend
    const index = existing.findIndex((l) => l.lead_id === leadId);
    let updated: WebhookLeadPayload[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = payload;
    } else {
      updated = [payload, ...existing];
    }
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updated));
    sessionStorage.setItem(ACTIVE_LEAD_SESSION_KEY, JSON.stringify(payload));

    // Notify listeners
    leadListeners.forEach((fn) => fn(updated));
  } catch (err) {
    console.warn('Local lead persistence failed', err);
  }

  return {
    success: true,
    leadId,
    isDuplicate: false,
    message: params.status === 'partial' ? 'Partial lead saved' : 'Reservation recorded successfully',
    payload
  };
}

export function getCurrentSessionLead(): WebhookLeadPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(ACTIVE_LEAD_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
