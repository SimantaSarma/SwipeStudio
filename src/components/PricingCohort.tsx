// src/components/PricingCohort.tsx
import React from 'react';
import { ArrowRight, Check, HelpCircle } from 'lucide-react';
import { CONFIG } from '../config';
import { DerivedCohortState } from '../dateState';
import { track } from '../analytics';

interface Props {
  cohortState: DerivedCohortState;
  onOpenLeadModal: (location: 'pricing') => void;
}

export const PricingCohort: React.FC<Props> = ({ cohortState, onOpenLeadModal }) => {
  const handleReserve = () => {
    track('cta_click', { id: 'pricing_reserve', location: 'pricing' });
    onOpenLeadModal('pricing');
  };

  return (
    <section id="pricing" className="bg-sand-100/40 py-20 px-4 sm:px-6 border-b border-sand-200">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="mono-tag text-moss-700 block mb-2">TRANSPARENT TUITION</span>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-ink-900 leading-tight tracking-tight">
            One simple fee. All projects included.
          </h2>
          <p className="text-ink-700 text-sm md:text-base mt-2 leading-relaxed">
            No hidden software subscriptions or surprise fees. Everything you need to ship four real projects.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-surface rounded-2xl border-2 border-sand-200 overflow-hidden shadow-sm">
          <div className="p-8 sm:p-10 border-b border-sand-200 bg-paper/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="mono-tag text-xs text-moss-700 bg-moss-50 border border-moss-100 px-2.5 py-1 rounded inline-block mb-3">
                  {CONFIG.programme.edition} · JANUARY 2027
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900">
                  Full 6-Week Cohort Admission
                </h3>
                <p className="text-xs text-ink-500 font-mono mt-1">
                  Capacity strictly 40 learners · Live sessions on weekends
                </p>
              </div>

              <div className="sm:text-right">
                {cohortState.isEarlyBirdActive ? (
                  <div>
                    <div className="flex items-baseline sm:justify-end gap-2">
                      <span className="text-sm font-mono line-through text-ink-400">
                        {CONFIG.programme.fee.currencySymbol}{CONFIG.programme.fee.regular.toLocaleString('en-IN')}
                      </span>
                      <span className="font-display text-4xl sm:text-5xl font-semibold text-ink-900">
                        {CONFIG.programme.fee.currencySymbol}{CONFIG.programme.fee.earlyBird.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="inline-block mt-1 text-xs font-mono font-medium text-moss-700 bg-moss-100/60 px-2 py-0.5 rounded">
                      Early-bird rate (Save ₹1,500 until 20 Dec)
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="font-display text-4xl sm:text-5xl font-semibold text-ink-900">
                      {CONFIG.programme.fee.currencySymbol}{CONFIG.programme.fee.regular.toLocaleString('en-IN')}
                    </span>
                    <span className="block mt-1 text-xs font-mono text-ink-500">
                      Standard Cohort Fee
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* What's included checklist */}
              <div className="space-y-3.5">
                <span className="block font-mono text-xs uppercase text-ink-400 mb-2">
                  EVERYTHING INCLUDED:
                </span>
                <div className="flex items-start gap-3 text-sm text-ink-900">
                  <div className="w-5 h-5 rounded-full bg-moss-50 text-moss-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>12 Live interactive weekend sessions (Sat & Sun, 11 AM IST)</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-ink-900">
                  <div className="w-5 h-5 rounded-full bg-moss-50 text-moss-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>4 Complete shipped project deliverables with 1:1 code feedback</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-ink-900">
                  <div className="w-5 h-5 rounded-full bg-moss-50 text-moss-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>Weekly live mentor office hours (Tue & Thu evenings)</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-ink-900">
                  <div className="w-5 h-5 rounded-full bg-moss-50 text-moss-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>Lifetime access to session recordings, prompt libraries & templates</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-ink-900">
                  <div className="w-5 h-5 rounded-full bg-moss-50 text-moss-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>Verified Certificate of Completion verifying deployed deliverables</span>
                </div>
              </div>

              {/* Action column */}
              <div className="bg-sand-100/50 rounded-xl p-6 border border-sand-200 flex flex-col justify-between space-y-5">
                <div>
                  <span className="mono-tag text-[10px] text-ink-500 block mb-1">
                    ZERO UPFRONT COMMITMENT
                  </span>
                  <h4 className="font-display text-base font-semibold text-ink-900 mb-1">
                    Reserve your spot today
                  </h4>
                  <p className="text-xs text-ink-700 leading-relaxed">
                    Payment links (UPI, Cards, Net Banking, EMI) are dispatched to your WhatsApp after your application details are verified.
                  </p>
                </div>

                <button
                  onClick={handleReserve}
                  className="btn-primary w-full justify-center group"
                >
                  <span>{cohortState.primaryCtaLabel}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform stroke-[2]" />
                </button>

                <div className="border-t border-sand-200/80 pt-3 text-[11px] text-ink-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-moss-700 shrink-0 stroke-[1.5]" />
                    <span>Refund policy: 100% refund up until end of Week 1.</span>
                  </div>
                  <p className="text-[10px] font-mono text-ink-400">
                    Prototype note: Terms shown as realistic candidate placeholder.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
