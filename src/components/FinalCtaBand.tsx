// src/components/FinalCtaBand.tsx
import React, { useState } from 'react';
import { Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';
import { CONFIG } from '../config';
import { DerivedCohortState } from '../dateState';
import { UserSegment } from '../types';
import { normalizeIndianPhone, submitLead } from '../webhook';
import { track } from '../analytics';
import { generateIntroSessionIcs } from '../calendar';

interface Props {
  cohortState: DerivedCohortState;
  onOpenStep2WithPartial: (leadId: string, name: string, phone: string, segment: UserSegment) => void;
  onOpenIntroModal: () => void;
}

export const FinalCtaBand: React.FC<Props> = ({
  cohortState,
  onOpenStep2WithPartial,
  onOpenIntroModal
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [segment, setSegment] = useState<UserSegment>('Student');
  const [botTrap, setBotTrap] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (botTrap) {
      console.warn('Bot detected by honeypot');
      return;
    }

    let hasError = false;
    if (!fullName.trim()) {
      setNameError('Please enter your full name');
      track('form_error', { field: 'fullName' });
      hasError = true;
    } else {
      setNameError('');
    }

    const phoneCheck = normalizeIndianPhone(phone);
    if (!phoneCheck.valid) {
      setPhoneError(phoneCheck.error || 'Please enter a valid 10-digit Indian mobile number');
      track('form_error', { field: 'phone', error: phoneCheck.error });
      hasError = true;
    } else {
      setPhoneError('');
    }

    if (hasError) return;

    setIsSubmitting(true);
    track('step1_submit', { name: fullName.trim(), segment, location: 'final_band' });

    try {
      // Step 1: Immediately POST partial lead
      const result = await submitLead({
        name: fullName.trim(),
        whatsappRaw: phone,
        segment,
        status: cohortState.isApplicationsOpen ? 'partial' : 'waitlist',
        cta: 'final'
      });

      // Pass down to modal for Step 2 optional enrichment
      onOpenStep2WithPartial(result.leadId, fullName.trim(), phoneCheck.normalized, segment);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed';
      setPhoneError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-ink-900 text-paper py-20 px-4 sm:px-6 border-b border-sand-200/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Urgency & Low-Commitment Intro Session */}
          <div className="lg:col-span-6 space-y-6">
            <span className="mono-tag text-saffron-500 block">
              ADMISSIONS · {CONFIG.programme.edition}
            </span>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-paper leading-tight tracking-tight">
              Ready to ship real AI projects that work?
            </h2>

            <p className="text-muted-on-dark text-base leading-relaxed">
              Join Cohort 04 starting {CONFIG.programme.cohortStart}. 40 spots, live weekend instruction, and four portfolio-defining systems built by your own hands.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-mono text-muted-on-dark">
              <span className="flex items-center gap-1.5 text-moss-100">
                <CheckCircle2 className="w-4 h-4 stroke-[2]" />
                Zero upfront payment required to reserve
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 stroke-[2]" />
                100% Week 1 refund guarantee
              </span>
            </div>

            {/* Low Commitment Alternative: Free Intro Session */}
            <div className="border border-sand-200/15 rounded-xl p-5 bg-sand-200/5 space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-saffron-500 stroke-[2]" />
                <span className="mono-tag text-xs text-saffron-500">
                  LOW-COMMITMENT PREVIEW
                </span>
              </div>
              <h4 className="font-display text-base font-semibold text-paper">
                Join the free 45-min live intro session
              </h4>
              <p className="text-xs text-muted-on-dark leading-relaxed">
                {CONFIG.programme.introSession.dateStr}. Walk through live LLM prompt patterns and ask the instructor questions before committing.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onOpenIntroModal}
                  className="btn-secondary-dark text-xs h-9 px-3.5"
                >
                  Register for free intro
                </button>
                <button
                  type="button"
                  onClick={generateIntroSessionIcs}
                  className="text-xs font-mono text-saffron-500 hover:text-white underline underline-offset-4"
                >
                  Add to calendar (.ics)
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Inline Lead Capture Form */}
          <div className="lg:col-span-6">
            <div className="bg-surface text-ink-900 rounded-2xl border border-sand-200 p-6 sm:p-8 shadow-xl">
              <div className="mb-6">
                <span className="mono-tag text-[10px] text-moss-700 bg-moss-50 border border-moss-100 px-2 py-0.5 rounded">
                  STEP 1 OF 2 · 30 SECONDS
                </span>
                <h3 className="font-display text-2xl font-semibold text-ink-900 mt-2">
                  Reserve your seat for Cohort 04
                </h3>
                <p className="text-xs text-ink-500 mt-1">
                  We will contact you via WhatsApp with syllabus files and payment details.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Honeypot */}
                <input
                  type="text"
                  name="user_nickname_verify"
                  value={botTrap}
                  onChange={(e) => setBotTrap(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                {/* Full Name */}
                <div>
                  <label htmlFor="final-name" className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                    Full Name <span className="text-alert-700">*</span>
                  </label>
                  <input
                    id="final-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Arjun Mehta"
                    autoComplete="name"
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-base text-ink-900 bg-paper focus:bg-surface focus:outline-none focus:ring-2 focus:ring-saffron-500 transition-colors ${
                      nameError ? 'border-alert-700' : 'border-ink-400'
                    }`}
                  />
                  {nameError && (
                    <p className="text-xs text-alert-700 mt-1">{nameError}</p>
                  )}
                </div>

                {/* WhatsApp Phone */}
                <div>
                  <label htmlFor="final-phone" className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                    WhatsApp Number <span className="text-alert-700">*</span>
                  </label>
                  <div className="flex rounded-lg border border-ink-400 bg-paper overflow-hidden focus-within:ring-2 focus-within:ring-saffron-500">
                    <span className="inline-flex items-center px-3.5 bg-sand-100 text-ink-700 font-mono text-sm border-r border-sand-200">
                      +91
                    </span>
                    <input
                      id="final-phone"
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      autoComplete="tel-national"
                      className="w-full px-3.5 py-2.5 text-base text-ink-900 bg-transparent focus:outline-none"
                    />
                  </div>
                  {phoneError ? (
                    <p className="text-xs text-alert-700 mt-1">{phoneError}</p>
                  ) : (
                    <p className="text-[11px] text-ink-500 mt-1 font-mono">
                      10 digits starting with 6, 7, 8, or 9
                    </p>
                  )}
                </div>

                {/* Segment Segmented Control */}
                <div>
                  <label className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                    I am a <span className="text-alert-700">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Professional Segment">
                    {(['Student', 'Working professional', 'Career switcher'] as UserSegment[]).map((seg) => (
                      <button
                        key={seg}
                        type="button"
                        role="radio"
                        aria-checked={segment === seg}
                        onClick={() => setSegment(seg)}
                        className={`text-xs py-2 px-2 rounded-lg border font-medium text-center transition-all ${
                          segment === seg
                            ? 'bg-ink-900 text-paper border-ink-900'
                            : 'bg-paper text-ink-700 border-sand-200 hover:border-ink-400'
                        }`}
                      >
                        {seg === 'Working professional' ? 'Professional' : seg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full justify-center group text-base"
                  >
                    <span>{isSubmitting ? 'Saving...' : `${cohortState.primaryCtaLabel} →`}</span>
                  </button>
                </div>

                <p className="text-[11px] text-ink-500 text-center font-mono pt-1">
                  Step 1 logs your reservation. Step 2 lets you specify custom project goals.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
