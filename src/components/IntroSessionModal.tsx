// src/components/IntroSessionModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, CheckCircle2 } from 'lucide-react';
import { CONFIG } from '../config';
import { UserSegment } from '../types';
import { normalizeIndianPhone, submitLead } from '../webhook';
import { generateIntroSessionIcs } from '../calendar';
import { track } from '../analytics';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const IntroSessionModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [segment, setSegment] = useState<UserSegment>('Student');
  const [botTrap, setBotTrap] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setPhone('');
      setEmail('');
      setError('');
      setRegistered(false);
      return;
    }

    track('form_open', { cta: 'intro' });
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (botTrap) return;

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }

    const phoneCheck = normalizeIndianPhone(phone);
    if (!phoneCheck.valid) {
      setError(phoneCheck.error || 'Please enter a valid 10-digit Indian WhatsApp number');
      return;
    }

    setError('');
    setIsSubmitting(true);
    track('form_submit', { cta: 'intro', segment });

    try {
      await submitLead({
        name: name.trim(),
        whatsappRaw: phone,
        segment,
        status: 'complete',
        cta: 'intro',
        email: email.trim() || undefined,
        goal: 'Registered for Free Intro Session'
      });

      // Trigger automatic calendar download
      generateIntroSessionIcs();
      setRegistered(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm animate-reveal"
    >
      <div className="w-full max-w-md bg-surface border border-sand-200 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-sand-200 bg-paper/60 flex items-center justify-between">
          <div>
            <span className="mono-tag text-[10px] text-moss-700 bg-moss-50 border border-moss-100 px-2 py-0.5 rounded">
              FREE 45-MIN WORKSHOP
            </span>
            <h3 id="intro-modal-title" className="font-display text-lg font-semibold text-ink-900 mt-1">
              Join the Live Intro Session
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-ink-400 hover:text-ink-900 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {registered ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-moss-50 text-moss-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-display text-lg font-semibold text-ink-900">
                  Seat Confirmed for Intro Workshop!
                </h4>
                <p className="text-xs text-ink-700 mt-1">
                  We have downloaded the calendar invite (.ics) to your device. We will WhatsApp the live stream link 15 minutes before we go live.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary text-xs h-10 w-full justify-center"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="bg-sand-100/60 p-3 rounded-lg border border-sand-200 text-xs text-ink-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-moss-700 shrink-0 stroke-[2]" />
                <span>
                  <strong>{CONFIG.programme.introSession.dateStr}</strong> · Live Zoom / Stream
                </span>
              </div>

              <input
                type="text"
                name="user_intro_token"
                value={botTrap}
                onChange={(e) => setBotTrap(e.target.value)}
                className="hidden"
                tabIndex={-1}
                aria-hidden="true"
              />

              <div>
                <label htmlFor="intro-name" className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                  Full Name <span className="text-alert-700">*</span>
                </label>
                <input
                  ref={inputRef}
                  id="intro-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikas Patel"
                  className="w-full rounded-lg border border-ink-400 px-3.5 py-2.5 text-base text-ink-900 bg-paper focus:bg-surface focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              <div>
                <label htmlFor="intro-phone" className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                  WhatsApp Number <span className="text-alert-700">*</span>
                </label>
                <div className="flex rounded-lg border border-ink-400 bg-paper overflow-hidden focus-within:ring-2 focus-within:ring-saffron-500">
                  <span className="inline-flex items-center px-3.5 bg-sand-100 text-ink-700 font-mono text-sm border-r border-sand-200">
                    +91
                  </span>
                  <input
                    id="intro-phone"
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full px-3.5 py-2.5 text-base text-ink-900 bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="intro-email" className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                  Email <span className="text-ink-400 font-normal">(optional)</span>
                </label>
                <input
                  id="intro-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vikas@example.com"
                  className="w-full rounded-lg border border-ink-400 px-3.5 py-2.5 text-base text-ink-900 bg-paper focus:bg-surface focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-ink-700 mb-1.5 font-medium">
                  I am a
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Student', 'Working professional', 'Career switcher'] as UserSegment[]).map((seg) => (
                    <button
                      key={seg}
                      type="button"
                      onClick={() => setSegment(seg)}
                      className={`text-xs py-2 px-1 rounded-lg border text-center ${
                        segment === seg
                          ? 'bg-ink-900 text-paper border-ink-900'
                          : 'bg-paper text-ink-700 border-sand-200'
                      }`}
                    >
                      {seg === 'Working professional' ? 'Pro' : seg}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-xs text-alert-700">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full justify-center text-sm py-2.5 h-11"
              >
                <span>{isSubmitting ? 'Registering...' : 'Register & Get Calendar (.ics)'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
