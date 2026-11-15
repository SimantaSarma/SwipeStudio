// src/components/AudienceStrip.tsx
import React from 'react';
import { GraduationCap, Briefcase, Compass } from 'lucide-react';

export const AudienceStrip: React.FC = () => {
  return (
    <section className="bg-sand-100/60 border-b border-sand-200 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="md:w-1/4">
            <span className="mono-tag text-ink-500 block mb-1">INTENTIONAL COHORT DESIGN</span>
            <p className="font-display text-lg font-semibold text-ink-900 leading-snug">
              Specifically built for:
            </p>
          </div>

          <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Student */}
            <div className="bg-surface rounded-lg p-4 border border-sand-200 flex items-start gap-3">
              <div className="p-2 rounded bg-moss-50 text-moss-700 shrink-0">
                <GraduationCap className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-ink-900">Final-Year Students</h4>
                <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">
                  Stand out in placements with live shipped artifacts instead of identical certificates.
                </p>
              </div>
            </div>

            {/* Career switchers */}
            <div className="bg-surface rounded-lg p-4 border border-sand-200 flex items-start gap-3">
              <div className="p-2 rounded bg-sand-100 text-ink-700 shrink-0">
                <Compass className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-ink-900">Career Switchers</h4>
                <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">
                  Transition from traditional non-tech domains into modern AI operations and product.
                </p>
              </div>
            </div>

            {/* Early-career professionals */}
            <div className="bg-surface rounded-lg p-4 border border-sand-200 flex items-start gap-3">
              <div className="p-2 rounded bg-moss-50 text-moss-700 shrink-0">
                <Briefcase className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-ink-900">Early-Career Pros</h4>
                <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">
                  0–3 years experience looking to automate daily friction and build custom work tools.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
