// src/components/LeadModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { CONFIG } from '../config';
import { DerivedCohortState } from '../dateState';
import { CtaLocation, UserSegment, PreferredBatch } from '../types';
import { normalizeIndianPhone, checkEmailTypo, submitLead } from '../webhook';
import { track } from '../analytics';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ctaLocation: CtaLocation;
  cohortState: DerivedCohortState;
  initialTrackId?: string;
  initialPartialData?: {
    leadId: string;
    name: string;
    phone: string;
    segment: UserSegment;
  };
  onSuccessNavigate: () => void;
}

export const LeadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  ctaLocation,
  cohortState,
  initialTrackId,
  initialPartialData,
  onSuccessNavigate
}) => {
  // Step state: 1 or 2
  const [step, setStep] = useState<1 | 2>(1);
  const [currentLeadId, setCurrentLeadId] = useState<string>('');

  // Step 1 Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [segment, setSegment] = useState<UserSegment>('Student');
  const [botTrap, setBotTrap] = useState('');

  // Step 2 Fields
  const [email, setEmail] = useState('');
  const [emailTypoHint, setEmailTypoHint] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string>(initialTrackId || 'ai-foundations');
  const [org, setOrg] = useState('');
  const [city, setCity] = useState('');
  const [batch, setBatch] = useState<PreferredBatch>('Weekend');
  const [goal, setGoal] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);

  // Errors & submission state
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [consentError, setConsentError] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateMessage, setDuplicateMessage] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Sync initial partial data if passed from FinalCtaBand
  useEffect(() => {
    if (initialPartialData) {
      setCurrentLeadId(initialPartialData.leadId);
      setFullName(initialPartialData.name);
      setPhone(initialPartialData.phone);
      setSegment(initialPartialData.segment);
      setStep(2);
    }
  }, [initialPartialData]);

  useEffect(() => {
    if (initialTrackId) {
      setSelectedTrack(initialTrackId);
    }
  }, [initialTrackId]);

  // Handle modal lifecycle: scroll lock, focus trap, Esc key
  useEffect(() => {
    if (!isOpen) {
      // Reset state on close
      setStep(1);
      setNameError('');
      setPhoneError('');
      setConsentError('');
      setSubmissionError('');
      setDuplicateMessage(null);
      return;
    }

    track('form_open', { cta: ctaLocation });

    // Scroll lock
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus initial input
    const timer = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, ctaLocation, onClose]);

  // Email typo checker
  const handleEmailChange = (val: string) => {
    setEmail(val);
    const hint = checkEmailTypo(val);
    setEmailTypoHint(hint);
  };

  const applyEmailSuggestion = () => {
    if (emailTypoHint) {
      const match = emailTypoHint.match(/Did you mean (.*)\?/);
      if (match && match[1]) {
        setEmail(match[1]);
        setEmailTypoHint(null);
      }
    }
  };

  // STEP 1 SUBMIT -> POST PARTIAL LEAD
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    setSubmissionError('');
    track('step1_submit', { name: fullName.trim(), segment, cta: ctaLocation });

    try {
      // POST PARTIAL LEAD IMMEDIATELY
      const result = await submitLead({
        name: fullName.trim(),
        whatsappRaw: phone,
        segment,
        status: cohortState.isApplicationsOpen ? 'partial' : 'waitlist',
        cta: ctaLocation
      });

      setCurrentLeadId(result.leadId);
      // Smooth transition to Step 2
      setStep(2);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect. Please check connection.';
      setSubmissionError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 2 SUBMIT -> POST COMPLETE LEAD
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (botTrap) {
      console.warn('Bot detected by honeypot');
      return;
    }

    if (!consentAccepted) {
      setConsentError('Please confirm your consent to receive admissions updates.');
      track('form_error', { field: 'consent' });
      return;
    }
    setConsentError('');

    setIsSubmitting(true);
    setSubmissionError('');
    setDuplicateMessage(null);

    const targetStatus = cohortState.isApplicationsOpen ? 'complete' : 'waitlist';
    track('form_submit', { status: targetStatus, track: selectedTrack });

    try {
      const result = await submitLead({
        name: fullName.trim(),
        whatsappRaw: phone,
        segment,
        status: targetStatus,
        cta: ctaLocation,
        email: email.trim() || undefined,
        trackId: selectedTrack,
        org: org.trim() || undefined,
        city: city.trim() || undefined,
        batch,
        goal: goal.trim() || undefined,
        consentAccepted: true
      });

      if (result.isDuplicate) {
        setDuplicateMessage(result.message);
        setTimeout(() => {
          onClose();
          onSuccessNavigate();
        }, 1800);
      } else {
        onClose();
        onSuccessNavigate();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error. Please try again.';
      setSubmissionError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-ink-900/60 backdrop-blur-sm animate-reveal"
    >
      <div
        ref={modalRef}
        className="w-full md:max-w-xl bg-surface border-t md:border border-sand-200 rounded-t-2xl md:rounded-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-sand-200/80 bg-paper/60 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="mono-tag text-[10px] text-moss-700 bg-moss-50 border border-moss-100 px-2 py-0.5 rounded">
                STEP {step} OF 2 {step === 1 ? '· BASIC INFO' : '· DETAILS & GOALS'}
              </span>
              <span className="text-[11px] font-mono text-ink-500">
                {CONFIG.programme.edition}
              </span>
            </div>
            <h3 id="lead-modal-title" className="font-display text-xl font-semibold text-ink-900">
              {step === 1 ? cohortState.primaryCtaLabel : 'Customize your sprint experience'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-ink-400 hover:text-ink-900 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {duplicateMessage && (
            <div className="p-4 rounded-lg bg-moss-50 border border-moss-600 text-moss-700 text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 stroke-[2] text-moss-600 mt-0.5" />
              <div>
                <p className="font-semibold text-xs font-mono uppercase">Status: Already Registered</p>
                <p className="text-xs mt-0.5">{duplicateMessage}</p>
              </div>
            </div>
          )}

          {submissionError && (
            <div className="p-4 rounded-lg bg-red-50 border border-alert-700 text-alert-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 stroke-[2] mt-0.5" />
              <div className="flex-1">
                <p>{submissionError}</p>
                <button
                  type="button"
                  onClick={step === 1 ? handleStep1Submit : handleStep2Submit}
                  className="mt-2 inline-flex items-center gap-1 font-mono uppercase text-[10px] underline underline-offset-2"
                >
                  <RefreshCw className="w-3 h-3 stroke-[2]" /> Retry Submission
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4" noValidate>
              {/* Honeypot */}
              <input
                type="text"
                name="verification_code_field"
                value={botTrap}
                onChange={(e) => setBotTrap(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {/* Full Name */}
              <div>
                <label htmlFor="lead-name" className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                  Full Name <span className="text-alert-700">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  id="lead-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sneha Roy"
                  autoComplete="name"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-base text-ink-900 bg-paper focus:bg-surface focus:outline-none focus:ring-2 focus:ring-saffron-500 ${
                    nameError ? 'border-alert-700' : 'border-ink-400'
                  }`}
                />
                {nameError && (
                  <p className="text-xs text-alert-700 mt-1">{nameError}</p>
                )}
              </div>

              {/* WhatsApp Phone */}
              <div>
                <label htmlFor="lead-phone" className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                  WhatsApp Number <span className="text-alert-700">*</span>
                </label>
                <div className="flex rounded-lg border border-ink-400 bg-paper overflow-hidden focus-within:ring-2 focus-within:ring-saffron-500">
                  <span className="inline-flex items-center px-3.5 bg-sand-100 text-ink-700 font-mono text-sm border-r border-sand-200">
                    +91
                  </span>
                  <input
                    id="lead-phone"
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
                    We will send cohort schedule & payment links to this WhatsApp.
                  </p>
                )}
              </div>

              {/* Segment */}
              <div>
                <label className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                  I am currently a <span className="text-alert-700">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Participant Segment">
                  {(['Student', 'Working professional', 'Career switcher'] as UserSegment[]).map((seg) => (
                    <button
                      key={seg}
                      type="button"
                      role="radio"
                      aria-checked={segment === seg}
                      onClick={() => setSegment(seg)}
                      className={`text-xs py-2.5 px-2 rounded-lg border font-medium text-center transition-all ${
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

              {/* Next Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center group text-base"
                >
                  <span>{isSubmitting ? 'Saving...' : 'Continue to step 2'}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform stroke-[2]" />
                </button>
              </div>

              <p className="text-[11px] text-ink-400 text-center font-mono">
                Clicking continue saves your reservation queue position immediately.
              </p>
            </form>
          )}

          {/* STEP 2: Optional Enrichments & Required Consent */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4" noValidate>
              {/* Email with Typo Checker */}
              <div>
                <label htmlFor="lead-email" className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                  Email Address <span className="text-ink-400 font-normal">(for calendar invites)</span>
                </label>
                <input
                  id="lead-email"
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="name@domain.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-ink-400 px-3.5 py-2.5 text-base text-ink-900 bg-paper focus:bg-surface focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
                {emailTypoHint && (
                  <div className="mt-1.5 text-xs text-moss-700 bg-moss-50 border border-moss-100 p-2 rounded flex items-center justify-between">
                    <span>{emailTypoHint}</span>
                    <button
                      type="button"
                      onClick={applyEmailSuggestion}
                      className="font-mono text-[10px] uppercase font-bold underline ml-2"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Curricular Track Preference */}
              <div>
                <label htmlFor="lead-track" className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                  Primary Track of Interest
                </label>
                <select
                  id="lead-track"
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="w-full rounded-lg border border-ink-400 px-3.5 py-2.5 text-base text-ink-900 bg-paper focus:bg-surface focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  {CONFIG.tracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.tag})
                    </option>
                  ))}
                </select>
              </div>

              {/* College / Organization & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="lead-org" className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                    College or Company
                  </label>
                  <input
                    id="lead-org"
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    placeholder="e.g. IIT Bombay / Freelance"
                    className="w-full rounded-lg border border-ink-400 px-3 py-2 text-base text-ink-900 bg-paper focus:bg-surface focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>

                <div>
                  <label htmlFor="lead-city" className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                    City
                  </label>
                  <input
                    id="lead-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Pune / Hyderabad"
                    className="w-full rounded-lg border border-ink-400 px-3 py-2 text-base text-ink-900 bg-paper focus:bg-surface focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>
              </div>

              {/* Preferred Batch */}
              <div>
                <label className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                  Preferred Session Timing
                </label>
                <div className="grid grid-cols-2 gap-2" role="radiogroup">
                  {(['Weekend', 'Weekday evening'] as PreferredBatch[]).map((b) => (
                    <button
                      key={b}
                      type="button"
                      role="radio"
                      aria-checked={batch === b}
                      onClick={() => setBatch(b)}
                      className={`text-xs py-2 px-3 rounded-lg border font-medium text-center transition-all ${
                        batch === b
                          ? 'bg-ink-900 text-paper border-ink-900'
                          : 'bg-paper text-ink-700 border-sand-200 hover:border-ink-400'
                      }`}
                    >
                      {b === 'Weekend' ? 'Sat & Sun (11:00 AM IST)' : 'Weekday Evenings (8:00 PM IST)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* What do you want to build? (<= 140 chars) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="lead-goal" className="block text-xs font-mono uppercase text-ink-700 font-medium">
                    What project do you want to build?
                  </label>
                  <span className={`text-[10px] font-mono ${goal.length > 130 ? 'text-alert-700 font-bold' : 'text-ink-400'}`}>
                    {goal.length}/140
                  </span>
                </div>
                <textarea
                  id="lead-goal"
                  maxLength={140}
                  rows={2}
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. I want to build a tool that extracts financial ratios from annual reports and sends alerts."
                  className="w-full rounded-lg border border-ink-400 px-3.5 py-2 text-base text-ink-900 bg-paper focus:bg-surface focus:outline-none focus:ring-2 focus:ring-saffron-500 resize-none"
                />
              </div>

              {/* REQUIRED, UNTICKED CONSENT CHECKBOX */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={(e) => setConsentAccepted(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-ink-400 text-moss-700 focus:ring-saffron-500"
                  />
                  <span className="text-xs text-ink-700 leading-snug">
                    I agree to receive programme updates, curriculum materials, and admissions details on WhatsApp and email. No spam, ever. <span className="text-alert-700">*</span>
                  </span>
                </label>
                {consentError && (
                  <p className="text-xs text-alert-700 mt-1 pl-7">{consentError}</p>
                )}
              </div>

              {/* Final Submit */}
              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary text-xs h-11 px-4"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex-1 justify-center text-base h-11"
                >
                  <span>{isSubmitting ? 'Confirming...' : 'Complete Reservation'}</span>
                  <ArrowRight className="w-4 h-4 ml-2 stroke-[2]" />
                </button>
              </div>

              <div className="text-[10px] font-mono text-ink-400 text-center">
                Payload ID: {currentLeadId ? currentLeadId.substring(0, 18) + '...' : 'Generating...'}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
