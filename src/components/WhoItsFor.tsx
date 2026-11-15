// src/components/WhoItsFor.tsx
import React from 'react';
import { Check, X } from 'lucide-react';

export const WhoItsFor: React.FC = () => {
  return (
    <section className="bg-paper py-20 px-4 sm:px-6 border-b border-sand-200">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="mono-tag text-moss-700 block mb-2">HONEST ADMISSIONS CRITERIA</span>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-ink-900 leading-tight tracking-tight">
            An intentional filter: Is this right for you?
          </h2>
          <p className="text-ink-700 text-sm md:text-base mt-3 leading-relaxed">
            We deliberately cap cohorts at 40 participants. Clear mutual expectations prevent wasted time and money.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* WHO IT'S FOR */}
          <div className="bg-surface rounded-xl border border-moss-600/30 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-sand-200">
              <span className="w-6 h-6 rounded-full bg-moss-100 flex items-center justify-center text-moss-700">
                <Check className="w-4 h-4 stroke-[2.5]" />
              </span>
              <h3 className="font-display text-xl font-semibold text-ink-900">
                This sprint is built for you if:
              </h3>
            </div>

            <ul className="space-y-4 text-sm text-ink-700">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-moss-600 mt-2 shrink-0" />
                <span>
                  <strong>You want to learn by shipping</strong>: You learn faster when building functional workflows rather than passively watching lecture playlists.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-moss-600 mt-2 shrink-0" />
                <span>
                  <strong>You can commit 6 hours/week</strong>: You can attend live Saturday & Sunday morning sessions (11 AM – 12:30 PM IST) and spend 3 hours building mid-week.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-moss-600 mt-2 shrink-0" />
                <span>
                  <strong>You want proof of work</strong>: You need real, verifiable URLs and artifacts to showcase in job applications, internships, or freelancing proposals.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-moss-600 mt-2 shrink-0" />
                <span>
                  <strong>You are curious and coachable</strong>: You don&apos;t mind running into an error code and asking for help during mentor office hours.
                </span>
              </li>
            </ul>
          </div>

          {/* WHO IT'S NOT FOR */}
          <div className="bg-sand-100/50 rounded-xl border border-sand-200 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-sand-200">
              <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-alert-700">
                <X className="w-4 h-4 stroke-[2.5]" />
              </span>
              <h3 className="font-display text-xl font-semibold text-ink-900">
                This sprint is NOT for you if:
              </h3>
            </div>

            <ul className="space-y-4 text-sm text-ink-700">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-alert-700 mt-2 shrink-0" />
                <span>
                  <strong>You want passive income shortcuts</strong>: We do not teach &quot;get-rich-quick AI agency&quot; hacks or automated low-quality spam generators.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-alert-700 mt-2 shrink-0" />
                <span>
                  <strong>You expect a guaranteed job placement</strong>: We never make fake placement guarantees. We build your skills; you still must interview and prove your value.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-alert-700 mt-2 shrink-0" />
                <span>
                  <strong>You want theoretical machine learning math</strong>: We do not derive gradient descent or train PyTorch weights from scratch. We focus on modern LLM applications.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-alert-700 mt-2 shrink-0" />
                <span>
                  <strong>You cannot engage in live weekend sessions</strong>: Watching recordings without building the weekly projects defeats the cohort model.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
