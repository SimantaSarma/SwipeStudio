// src/types.ts

export type LeadStatus = 'partial' | 'complete' | 'waitlist';

export type UserSegment = 'Student' | 'Working professional' | 'Career switcher';

export type PreferredBatch = 'Weekend' | 'Weekday evening';

export type CtaLocation =
  | 'header'
  | 'hero'
  | 'build'
  | 'pricing'
  | 'sticky'
  | 'final'
  | 'syllabus'
  | 'intro'
  | 'track_card';

export interface UtmSourceData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer: string;
  landing_path: string;
}

export interface ConsentRecord {
  accepted: boolean;
  text_version: string;
  timestamp: string;
}

export interface WebhookLeadPayload {
  lead_id: string; // uuid
  status: LeadStatus;
  created_at: string; // ISO 8601
  name: string;
  whatsapp_e164: string; // +91XXXXXXXXXX
  email?: string;
  segment: UserSegment;
  track?: string;
  org?: string;
  city?: string;
  batch?: PreferredBatch;
  goal?: string; // <= 140 chars
  consent: ConsentRecord;
  source: UtmSourceData;
  cohort: '2027-01';
  cta: CtaLocation;
  page_variant?: string;
}

export interface Step1FormData {
  fullName: string;
  whatsapp: string;
  segment: UserSegment;
  botTrap?: string; // honeypot
}

export interface Step2FormData {
  email?: string;
  track?: string;
  org?: string;
  city?: string;
  batch?: PreferredBatch;
  goal?: string;
  consent: boolean;
}

export interface SyllabusFormData {
  fullName: string;
  email: string;
  botTrap?: string;
}

export interface IntroSessionFormData {
  fullName: string;
  whatsapp: string;
  email: string;
  segment: UserSegment;
  botTrap?: string;
}

export type AnalyticsEventType =
  | 'page_view'
  | 'cta_click'
  | 'form_open'
  | 'step1_submit'
  | 'form_submit'
  | 'form_error'
  | 'faq_expand'
  | 'syllabus_download'
  | 'whatsapp_click'
  | 'intro_add_to_calendar';

export interface AnalyticsEventRecord {
  id: string;
  timestamp: string;
  event: AnalyticsEventType;
  properties: Record<string, unknown>;
}

export interface DateSimulationState {
  mode: 'default' | 'early_bird_passed' | 'applications_closed' | 'cohort_started';
  customDate?: string;
}
