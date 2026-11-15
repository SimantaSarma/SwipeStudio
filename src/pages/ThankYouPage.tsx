// src/pages/ThankYouPage.tsx
import React, { useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle, Users, PhoneCall, Calendar, Share2, ArrowLeft } from 'lucide-react';
import { CONFIG } from '../config';
import { getCurrentSessionLead, getStoredLeads } from '../webhook';
import { WebhookLeadPayload } from '../types';
import { generateIntroSessionIcs } from '../calendar';
import { useToast } from '../components/Toast';
import { track } from '../analytics';

export const ThankYouPage: React.FC = () => {
  const [lead, setLead] = useState<WebhookLeadPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    track('page_view', { page: '/thank-you' });

    // Retrieve active lead from session or recent local storage
    const sessionLead = getCurrentSessionLead();
    if (sessionLead) {
      setLead(sessionLead);
      setLoading(false);
      return;
    }

    const stored = getStoredLeads();
    if (stored.length > 0) {
      setLead(stored[0]);
      setLoading(false);
      return;
    }

    // Direct visit with no lead -> Redirect home
    const timeout = setTimeout(() => {
      window.location.href = '/';
    }, 2500);

    setLoading(false);
    return () => clearTimeout(timeout);
  }, []);

  const handleShare = async () => {
    track('cta_click', { id: 'referral_share', location: 'thank_you' });
    const shareData = {
      title: `${CONFIG.programme.name} — ${CONFIG.brand.name}`,
      text: `I just reserved my seat for ${CONFIG.programme.name} (${CONFIG.programme.edition}). 6 weeks, 4 shipped AI projects. Check it out:`,
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Shared successfully!', 'success');
        return;
      } catch (err) {
        // User cancelled or unsupported, fallback to copy
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      showToast('Referral link copied to clipboard!', 'success');
    } catch {
      showToast('Failed to copy link', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6 text-ink-900">
        <div className="font-mono text-xs text-ink-500 animate-pulse">
          Verifying reservation status...
        </div>
      </div>
    );
  }

  // If no lead found, show friendly redirect notice
  if (!lead) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6 text-ink-900">
        <div className="max-w-md w-full bg-surface border border-sand-200 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-sand-100 flex items-center justify-center mx-auto text-ink-500">
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </div>
          <h2 className="font-display text-xl font-semibold text-ink-900">
            No Active Reservation Found
          </h2>
          <p className="text-xs text-ink-700 leading-relaxed">
            It looks like you navigated directly to this confirmation page without completing a reservation. Redirecting you back to the home page...
          </p>
          <a
            href="/"
            className="btn-primary inline-flex text-xs h-10 px-5"
          >
            Return to Programme Page
          </a>
        </div>
      </div>
    );
  }

  const firstName = lead.name.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-paper text-ink-900 selection:bg-moss-100">
      {/* Top Header */}
      <header className="border-b border-sand-200 bg-surface/80 py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-ink-900 hover:text-moss-700 transition-colors">
            <div className="w-7 h-7 rounded bg-ink-900 text-saffron-500 font-mono font-bold text-xs flex items-center justify-center">
              AI
            </div>
            <span className="font-display font-semibold text-base">
              {CONFIG.brand.name}
            </span>
          </a>
          <a
            href="/"
            className="text-xs font-mono text-ink-500 hover:text-ink-900 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2]" />
            Back to overview
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        {/* Hero Confirmation Card */}
        <div className="bg-surface rounded-2xl border border-sand-200 p-6 sm:p-10 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-moss-50 text-moss-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2]" />
            </div>
            <span className="mono-tag text-xs text-moss-700 bg-moss-50 border border-moss-100 px-2.5 py-0.5 rounded">
              {lead.status === 'waitlist' ? 'WAITLIST RECORDED' : 'RESERVATION LOGGED'}
            </span>
          </div>

          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink-900 leading-tight">
              You&apos;re in the queue, {firstName}.
            </h1>
            <p className="text-sm sm:text-base text-ink-700 mt-2 leading-relaxed">
              We have recorded your details for{' '}
              <strong>{CONFIG.programme.name} ({CONFIG.programme.edition})</strong>. Your spot among the 40 seats is held while admissions processes incoming cohort profiles.
            </p>
          </div>

          {/* Details Summary Pill */}
          <div className="bg-sand-100/60 rounded-xl p-4 border border-sand-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="block text-[10px] text-ink-400 uppercase">LEAD ID</span>
              <span className="font-semibold text-ink-900 truncate block">
                {lead.lead_id.substring(0, 8)}...
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-ink-400 uppercase">WHATSAPP</span>
              <span className="font-semibold text-ink-900">{lead.whatsapp_e164}</span>
            </div>
            <div>
              <span className="block text-[10px] text-ink-400 uppercase">SEGMENT</span>
              <span className="font-semibold text-ink-900">{lead.segment}</span>
            </div>
            <div>
              <span className="block text-[10px] text-ink-400 uppercase">COHORT</span>
              <span className="font-semibold text-ink-900">{lead.cohort}</span>
            </div>
          </div>
        </div>

        {/* Three Next Steps with Timing */}
        <div className="space-y-4">
          <div className="border-b border-sand-200 pb-2">
            <span className="mono-tag text-moss-700 block mb-1">CLEAR EXPECTATIONS</span>
            <h2 className="font-display text-xl font-semibold text-ink-900">
              What happens next (3 steps with exact timing)
            </h2>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="bg-surface rounded-xl border border-sand-200 p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-sand-100 flex items-center justify-center text-moss-700 shrink-0 mt-0.5">
                <MessageCircle className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <h3 className="font-display text-base font-semibold text-ink-900">
                    1. WhatsApp verification message
                  </h3>
                  <span className="mono-tag text-[10px] text-moss-700 bg-moss-50 px-2 py-0.5 rounded border border-moss-100">
                    WITHIN 24 HOURS
                  </span>
                </div>
                <p className="text-xs text-ink-700 leading-relaxed">
                  Our admissions coordinator will send you a message on WhatsApp ({lead.whatsapp_e164}) confirming your batch timing, syllabus pack, and official tuition link (UPI, Net Banking, EMI).
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-surface rounded-xl border border-sand-200 p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-sand-100 flex items-center justify-center text-moss-700 shrink-0 mt-0.5">
                <Users className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <h3 className="font-display text-base font-semibold text-ink-900">
                    2. Join the private learner community
                  </h3>
                  <span className="mono-tag text-[10px] text-ink-500 bg-sand-100 px-2 py-0.5 rounded">
                    48 HOURS BEFORE SPRINT
                  </span>
                </div>
                <p className="text-xs text-ink-700 leading-relaxed">
                  Once your enrollment is confirmed, you will receive an invitation to the Cohort 04 community workspace to meet peer builders, download starter prompt libraries, and set up cloud tooling.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-surface rounded-xl border border-sand-200 p-5 sm:p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-sand-100 flex items-center justify-center text-moss-700 shrink-0 mt-0.5">
                <PhoneCall className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <h3 className="font-display text-base font-semibold text-ink-900">
                    3. Optional 15-minute counselling call
                  </h3>
                  <span className="mono-tag text-[10px] text-ink-500 bg-sand-100 px-2 py-0.5 rounded">
                    OPTIONAL · ANYTIME
                  </span>
                </div>
                <p className="text-xs text-ink-700 leading-relaxed">
                  Have questions about whether your career goal matches our 4 projects? You can book a 1-on-1 slot with Arjun (lead instructor) to review your specific background before Week 1.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Free Intro Session Add to Calendar */}
        <div className="bg-sand-100/70 border border-sand-200 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="mono-tag text-xs text-moss-700 flex items-center gap-1 font-semibold">
              <Calendar className="w-3.5 h-3.5 stroke-[2]" /> FREE PREVIEW WORKSHOP
            </span>
            <h4 className="font-display text-base font-semibold text-ink-900">
              {CONFIG.programme.introSession.dateStr}
            </h4>
            <p className="text-xs text-ink-700">
              Download the .ics invite so you don&apos;t miss the 45-minute live workflow demo before the cohort starts.
            </p>
          </div>
          <button
            onClick={generateIntroSessionIcs}
            className="btn-secondary text-xs h-10 px-4 shrink-0"
          >
            <Calendar className="w-4 h-4 mr-2 stroke-[1.5]" />
            Add to Calendar (.ics)
          </button>
        </div>

        {/* Web Share / Copy Link Referral */}
        <div className="bg-surface border border-sand-200 rounded-xl p-6 text-center space-y-3">
          <span className="mono-tag text-xs text-ink-500">BUILD WITH A FRIEND</span>
          <h4 className="font-display text-lg font-semibold text-ink-900">
            Share Applied AI Studio with a classmate or colleague
          </h4>
          <p className="text-xs text-ink-700 max-w-md mx-auto">
            Studying in a team of two doubles project completion rates. Send the sprint overview link directly:
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleShare}
              className="btn-primary text-xs h-10 px-5 gap-2"
            >
              <Share2 className="w-4 h-4 stroke-[2]" />
              <span>Share or Copy Referral Link</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
