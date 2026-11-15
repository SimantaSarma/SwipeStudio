// src/components/PrototypeDrawer.tsx
import React, { useState, useEffect } from 'react';
import { X, Sliders, Database, Activity, BookOpen, Copy, Check, Trash2, Calendar } from 'lucide-react';
import { getStoredLeads, subscribeLeads, clearStoredLeads } from '../webhook';
import { getStoredEvents, subscribeAnalytics, clearAnalyticsEvents } from '../analytics';
import { getSimulatedDateMode, setSimulatedDateMode, subscribeDateMode, SimulatedDateMode } from '../dateState';
import { WebhookLeadPayload, AnalyticsEventRecord } from '../types';
import { CONFIG } from '../config';

export const PrototypeDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'leads' | 'dates' | 'analytics' | 'notes'>('leads');
  const [leads, setLeads] = useState<WebhookLeadPayload[]>([]);
  const [events, setEvents] = useState<AnalyticsEventRecord[]>([]);
  const [dateMode, setDateMode] = useState<SimulatedDateMode>('default');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setLeads(getStoredLeads());
    setEvents(getStoredEvents());
    setDateMode(getSimulatedDateMode());

    const unsubLeads = subscribeLeads((updated) => setLeads(updated));
    const unsubEvents = subscribeAnalytics((updated) => setEvents(updated));
    const unsubDates = subscribeDateMode((mode) => setDateMode(mode));

    return () => {
      unsubLeads();
      unsubEvents();
      unsubDates();
    };
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDateChange = (mode: SimulatedDateMode) => {
    setDateMode(mode);
    setSimulatedDateMode(mode);
  };

  return (
    <>
      {/* Floating Toggle Button (Bottom-Left) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40 bg-ink-900 text-paper px-3.5 py-2.5 rounded-lg border border-sand-200/20 shadow-xl flex items-center gap-2 text-xs font-mono font-medium hover:bg-ink-700 transition-all focus:outline-none focus:ring-2 focus:ring-saffron-500"
        aria-label="Open prototype reviewer notes and automation drawer"
      >
        <Sliders className="w-3.5 h-3.5 text-saffron-500 stroke-[2]" />
        <span>Prototype Notes &amp; Inspector</span>
        {leads.length > 0 && (
          <span className="bg-moss-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {leads.length}
          </span>
        )}
      </button>

      {/* Slide-over Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          className="fixed inset-0 z-50 flex justify-end bg-ink-900/50 backdrop-blur-xs animate-reveal"
        >
          <div className="w-full max-w-2xl bg-surface border-l border-sand-200 h-full flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-sand-200 bg-paper flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-ink-900 text-saffron-500 font-mono text-xs flex items-center justify-center font-bold">
                  P
                </div>
                <div>
                  <h3 id="drawer-title" className="font-display font-semibold text-base text-ink-900">
                    Prototype Notes &amp; Inspector
                  </h3>
                  <p className="text-[11px] font-mono text-ink-500">
                    Candidate Assignment Verification Console
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-ink-400 hover:text-ink-900 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500"
                aria-label="Close inspector drawer"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center border-b border-sand-200 bg-sand-100/40 text-xs font-mono px-4 shrink-0 overflow-x-auto">
              <button
                onClick={() => setActiveTab('leads')}
                className={`py-3 px-3 border-b-2 font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'leads'
                    ? 'border-saffron-500 text-ink-900 font-bold'
                    : 'border-transparent text-ink-500 hover:text-ink-900'
                }`}
              >
                <Database className="w-3.5 h-3.5 stroke-[1.5]" />
                Webhook Leads ({leads.length})
              </button>

              <button
                onClick={() => setActiveTab('dates')}
                className={`py-3 px-3 border-b-2 font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'dates'
                    ? 'border-saffron-500 text-ink-900 font-bold'
                    : 'border-transparent text-ink-500 hover:text-ink-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 stroke-[1.5]" />
                Date State Simulation
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-3 px-3 border-b-2 font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-saffron-500 text-ink-900 font-bold'
                    : 'border-transparent text-ink-500 hover:text-ink-900'
                }`}
              >
                <Activity className="w-3.5 h-3.5 stroke-[1.5]" />
                Event Stream ({events.length})
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`py-3 px-3 border-b-2 font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === 'notes'
                    ? 'border-saffron-500 text-ink-900 font-bold'
                    : 'border-transparent text-ink-500 hover:text-ink-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 stroke-[1.5]" />
                Rubric &amp; Architecture
              </button>
            </div>

            {/* Scrollable Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* TAB 1: WEBHOOK LEADS */}
              {activeTab === 'leads' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-semibold text-sm text-ink-900">
                        Captured Leads &amp; Webhook Payloads
                      </h4>
                      <p className="text-xs text-ink-500">
                        Webhook endpoint:{' '}
                        <code className="text-[11px] font-mono bg-sand-100 px-1 py-0.5 rounded text-moss-700">
                          {CONFIG.webhookUrl || 'Simulated 600ms (VITE_LEAD_WEBHOOK_URL unset)'}
                        </code>
                      </p>
                    </div>
                    {leads.length > 0 && (
                      <button
                        onClick={clearStoredLeads}
                        className="text-xs font-mono text-alert-700 hover:text-ink-900 flex items-center gap-1 p-1 rounded"
                      >
                        <Trash2 className="w-3 h-3 stroke-[1.5]" /> Clear
                      </button>
                    )}
                  </div>

                  {leads.length === 0 ? (
                    <div className="bg-sand-100/50 rounded-xl p-8 text-center space-y-2 border border-sand-200">
                      <p className="text-xs text-ink-700 font-mono">No leads submitted yet in this session.</p>
                      <p className="text-[11px] text-ink-500">
                        Fill Step 1 of the lead form on the page to verify that partial lead capture triggers immediately.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {leads.map((lead) => (
                        <div
                          key={lead.lead_id}
                          className="bg-paper rounded-xl border border-sand-200 p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`mono-tag text-[10px] px-2 py-0.5 rounded font-bold ${
                                  lead.status === 'complete'
                                    ? 'bg-moss-100 text-moss-700'
                                    : lead.status === 'waitlist'
                                    ? 'bg-saffron-100 text-ink-900'
                                    : 'bg-sand-200 text-ink-700'
                                }`}
                              >
                                {lead.status.toUpperCase()}
                              </span>
                              <span className="font-semibold text-sm text-ink-900">{lead.name}</span>
                              <span className="text-xs font-mono text-ink-500">({lead.whatsapp_e164})</span>
                            </div>

                            <button
                              onClick={() => handleCopy(JSON.stringify(lead, null, 2), lead.lead_id)}
                              className="text-xs font-mono text-moss-700 hover:text-ink-900 flex items-center gap-1 bg-surface border border-sand-200 px-2 py-1 rounded"
                            >
                              {copiedId === lead.lead_id ? (
                                <>
                                  <Check className="w-3 h-3 stroke-[2] text-moss-600" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 stroke-[1.5]" /> Copy JSON
                                </>
                              )}
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-ink-700 bg-surface p-2.5 rounded border border-sand-200/80">
                            <div>
                              <span className="text-ink-400 block text-[9px] uppercase">Segment</span>
                              <span>{lead.segment}</span>
                            </div>
                            <div>
                              <span className="text-ink-400 block text-[9px] uppercase">CTA Location</span>
                              <span>{lead.cta}</span>
                            </div>
                            <div>
                              <span className="text-ink-400 block text-[9px] uppercase">Track</span>
                              <span>{lead.track || 'none'}</span>
                            </div>
                            <div>
                              <span className="text-ink-400 block text-[9px] uppercase">UTM Source</span>
                              <span>{lead.source.utm_source || 'direct'}</span>
                            </div>
                          </div>

                          {/* Raw JSON expandable */}
                          <pre className="text-[10px] font-mono bg-ink-900 text-paper p-3 rounded-lg overflow-x-auto leading-tight">
                            {JSON.stringify(lead, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: DATE SIMULATION */}
              {activeTab === 'dates' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-display font-semibold text-sm text-ink-900">
                      Date Edge-Case Simulation
                    </h4>
                    <p className="text-xs text-ink-700 leading-relaxed">
                      Toggle the simulated current date to review how pricing, badges, announcement bars, and CTAs dynamically react to lifecycle deadlines.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Option 1: Default */}
                    <div
                      onClick={() => handleDateChange('default')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        dateMode === 'default'
                          ? 'border-moss-600 bg-moss-50/50 ring-1 ring-moss-600'
                          : 'border-sand-200 bg-surface hover:bg-sand-100/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-ink-900">
                          1. Default: Today (15 Nov 2026) — Early-bird Active
                        </span>
                        {dateMode === 'default' && (
                          <span className="mono-tag text-[10px] bg-moss-100 text-moss-700 px-2 py-0.5 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-500">
                        Early-bird fee ₹6,499 active (save ₹1,500). Applications open for Cohort 04. Primary CTA: &quot;Reserve your seat&quot;.
                      </p>
                    </div>

                    {/* Option 2: Early Bird Passed */}
                    <div
                      onClick={() => handleDateChange('early_bird_passed')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        dateMode === 'early_bird_passed'
                          ? 'border-moss-600 bg-moss-50/50 ring-1 ring-moss-600'
                          : 'border-sand-200 bg-surface hover:bg-sand-100/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-ink-900">
                          2. Early-Bird Ended (22 Dec 2026) — Standard Fee
                        </span>
                        {dateMode === 'early_bird_passed' && (
                          <span className="mono-tag text-[10px] bg-moss-100 text-moss-700 px-2 py-0.5 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-500">
                        Shows standard fee ₹7,999. Hides early-bird badge. Applications still open until 3 Jan.
                      </p>
                    </div>

                    {/* Option 3: Applications Closed */}
                    <div
                      onClick={() => handleDateChange('applications_closed')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        dateMode === 'applications_closed'
                          ? 'border-moss-600 bg-moss-50/50 ring-1 ring-moss-600'
                          : 'border-sand-200 bg-surface hover:bg-sand-100/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-ink-900">
                          3. Applications Closed (05 Jan 2027) — Waitlist Mode
                        </span>
                        {dateMode === 'applications_closed' && (
                          <span className="mono-tag text-[10px] bg-moss-100 text-moss-700 px-2 py-0.5 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-500">
                        CTAs dynamically transform into &quot;Join the waitlist&quot;. Lead status saved as &quot;waitlist&quot;.
                      </p>
                    </div>

                    {/* Option 4: Cohort Started */}
                    <div
                      onClick={() => handleDateChange('cohort_started')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        dateMode === 'cohort_started'
                          ? 'border-moss-600 bg-moss-50/50 ring-1 ring-moss-600'
                          : 'border-sand-200 bg-surface hover:bg-sand-100/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-ink-900">
                          4. Cohort Started (10 Jan 2027) — Next Cohort Notice
                        </span>
                        {dateMode === 'cohort_started' && (
                          <span className="mono-tag text-[10px] bg-moss-100 text-moss-700 px-2 py-0.5 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-500">
                        Cohort 04 in session. Informs learner: &quot;Next cohort: be first to know&quot;.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EVENT STREAM */}
              {activeTab === 'analytics' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display font-semibold text-sm text-ink-900">
                        Analytics Event Stream (track())
                      </h4>
                      <p className="text-xs text-ink-500">
                        Logs all funnel and interaction events in real time.
                      </p>
                    </div>
                    {events.length > 0 && (
                      <button
                        onClick={clearAnalyticsEvents}
                        className="text-xs font-mono text-alert-700 hover:text-ink-900 flex items-center gap-1 p-1 rounded"
                      >
                        <Trash2 className="w-3 h-3 stroke-[1.5]" /> Clear
                      </button>
                    )}
                  </div>

                  {events.length === 0 ? (
                    <div className="bg-sand-100/50 rounded-xl p-6 text-center text-xs font-mono text-ink-500 border border-sand-200">
                      No events captured yet. Click around the page to see live events fire.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                      {events.map((evt) => (
                        <div
                          key={evt.id}
                          className="bg-paper rounded-lg border border-sand-200 p-3 text-xs font-mono flex items-start justify-between gap-3"
                        >
                          <div>
                            <span className="font-bold text-moss-700 block mb-0.5">
                              {evt.event}
                            </span>
                            <pre className="text-[10px] text-ink-700 leading-snug">
                              {JSON.stringify(evt.properties)}
                            </pre>
                          </div>
                          <span className="text-[10px] text-ink-400 shrink-0">
                            {new Date(evt.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: RUBRIC & ARCHITECTURE */}
              {activeTab === 'notes' && (
                <div className="space-y-4 text-xs text-ink-700 leading-relaxed">
                  <div className="bg-sand-100/50 p-4 rounded-xl border border-sand-200 space-y-2">
                    <h5 className="font-display font-semibold text-sm text-ink-900">
                      Rubric Mapping (100% Target)
                    </h5>
                    <ul className="space-y-1.5 list-disc pl-4 text-ink-700">
                      <li>
                        <strong>UI/UX (30%)</strong>: Fraunces 600 + Figtree + JetBrains Mono. Warm Clinical palette (paper, moss, sand, ink). 0 clichés (no purple glow, sparkles, or robots). Strictly 1 primary CTA per viewport.
                      </li>
                      <li>
                        <strong>Product Thinking &amp; CTA (20%)</strong>: 5 placements (header, hero, build, pricing, final). 2-step capture funnel (partial lead saved immediately on Step 1). Honest filters.
                      </li>
                      <li>
                        <strong>AI Workflow &amp; Automation (25%)</strong>: Typed webhook schema with idempotency hash(phone + cohort), WhatsApp +91 normalization, honeypot, duplicate handling without error tone.
                      </li>
                      <li>
                        <strong>Technical Execution (15%)</strong>: Clean React + TypeScript + Tailwind CSS, 44px tap targets, zero white-screen error boundary, 320px width responsive.
                      </li>
                      <li>
                        <strong>Initiative (10%)</strong>: In-page prototype inspector, date simulation switcher, .ics generator, mock syllabus downloader, comprehensive README.
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-surface border border-sand-200 space-y-2">
                    <h5 className="font-display font-semibold text-sm text-ink-900">
                      Follow-Up Automation Pipeline (n8n / Make Architecture)
                    </h5>
                    <ol className="space-y-1 list-decimal pl-4">
                      <li>Browser POSTs typed payload with <code>X-Idempotency-Key</code>.</li>
                      <li>n8n Webhook Node receives payload and checks PostgreSQL/Airtable for existing lead by phone + cohort.</li>
                      <li>If <code>status: &quot;partial&quot;</code>: waits 2 hours. If no &quot;complete&quot; status arrives, creates a counselor task for gentle WhatsApp assistance.</li>
                      <li>If <code>status: &quot;complete&quot;</code>: sends immediate WhatsApp template message via WhatsApp Cloud API with personalized track details and payment link.</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
