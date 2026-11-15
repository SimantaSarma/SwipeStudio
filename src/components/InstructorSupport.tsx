// src/components/InstructorSupport.tsx
import React from 'react';
import { Calendar, MessageSquareQuote, ShieldCheck } from 'lucide-react';
import { CONFIG } from '../config';

export const InstructorSupport: React.FC = () => {
  return (
    <section className="bg-sand-100/30 py-20 px-4 sm:px-6 border-b border-sand-200">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="mono-tag text-moss-700 block mb-2">INSTRUCTION & SUPPORT SYSTEM</span>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink-900 leading-tight">
            Taught by practitioners, backed by weekly office hours
          </h2>
        </div>

        <div className="bg-surface rounded-2xl border border-sand-200 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 pb-8 border-b border-sand-200">
            {/* Initials Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-ink-900 text-saffron-500 font-display font-semibold text-2xl flex items-center justify-center shrink-0 border border-ink-700">
              {CONFIG.instructor.initials}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-display text-xl font-semibold text-ink-900">
                  {CONFIG.instructor.name}
                </h3>
                <span className="mono-tag text-[10px] bg-moss-50 text-moss-700 border border-moss-100 px-2 py-0.5 rounded">
                  {CONFIG.instructor.role}
                </span>
              </div>
              <p className="text-sm text-ink-700 leading-relaxed">
                {CONFIG.instructor.bio}
              </p>
            </div>
          </div>

          {/* Mentors & Office Hours Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-sand-100 text-moss-700 shrink-0">
                <Calendar className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-ink-900 uppercase font-mono">Office Hours</h4>
                <p className="text-xs text-ink-500 mt-1 leading-relaxed">
                  Twice a week (Tue & Thu 8:00 PM IST) for live debugging and 1:1 project critique.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-sand-100 text-moss-700 shrink-0">
                <MessageSquareQuote className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-ink-900 uppercase font-mono">Dedicated TAs</h4>
                <p className="text-xs text-ink-500 mt-1 leading-relaxed">
                  2 Teaching Assistants providing async feedback on project PRs within 12 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded bg-sand-100 text-moss-700 shrink-0">
                <ShieldCheck className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-ink-900 uppercase font-mono">Cohort Community</h4>
                <p className="text-xs text-ink-500 mt-1 leading-relaxed">
                  Private cohort workspace for sharing prompt templates, automation JSONs, and peer review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
