// src/components/ProofOutcomes.tsx
import React from 'react';
import { Award, Globe2, MessageSquare, AlertCircle } from 'lucide-react';

const SAMPLE_STORIES = [
  {
    initials: 'RM',
    name: 'Rohan M.',
    role: 'Final-year B.Com Student, Mumbai',
    quote: 'Before this sprint, I had only asked ChatGPT for essays. In Week 4, I built a working lead-intake webhook that sent WhatsApp confirmations to my college fest attendees. That project alone got me two internship interviews.',
    outcome: 'Shipped automated event CRM'
  },
  {
    initials: 'PS',
    name: 'Pooja S.',
    role: 'Operations Associate (1.5 yrs exp), Bengaluru',
    quote: 'The emphasis on structured JSON outputs and error handling was the turning point. I replaced our team’s manual daily vendor reconciliation spreadsheet with an n8n pipeline that saves 4 hours every Monday.',
    outcome: 'Automated weekly reconciliation'
  },
  {
    initials: 'AK',
    name: 'Ananya K.',
    role: 'Career Switcher (Marketing to Product Ops), Delhi',
    quote: 'No fake claims or high-pressure countdowns—just two live sessions every weekend where we actually coded and debugged workflows. The portfolio site at the end proved I could build systems, not just talk about them.',
    outcome: 'Deployed live public portfolio'
  }
];

export const ProofOutcomes: React.FC = () => {
  return (
    <section className="bg-paper py-20 px-4 sm:px-6 border-b border-sand-200">
      <div className="max-w-6xl mx-auto">
        {/* Sample Content Transparency Notice */}
        <div className="mb-12 inline-flex items-center gap-2 px-3 py-1.5 rounded bg-sand-100 border border-sand-200 text-xs font-mono text-ink-700">
          <AlertCircle className="w-3.5 h-3.5 text-moss-700 stroke-[2]" />
          <span>TRANSPARENCY NOTICE: The stories below are representative SAMPLE profiles illustrative of learner profiles from prior iterations.</span>
        </div>

        <div className="max-w-2xl mb-12">
          <span className="mono-tag text-moss-700 block mb-2">LEARNER OUTCOMES</span>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-ink-900 leading-tight tracking-tight">
            What real builders build and what you leave with
          </h2>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {SAMPLE_STORIES.map((story, i) => (
            <div
              key={i}
              className="bg-surface rounded-xl border border-sand-200 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-sand-100 border border-sand-200 font-mono text-xs font-semibold text-ink-900 flex items-center justify-center shrink-0">
                    {story.initials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-ink-900">{story.name}</h4>
                    <p className="text-[11px] text-ink-500">{story.role}</p>
                  </div>
                </div>

                <p className="text-xs text-ink-700 leading-relaxed italic mb-6">
                  &quot;{story.quote}&quot;
                </p>
              </div>

              <div className="pt-3 border-t border-sand-200/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-ink-400 uppercase">OUTCOME:</span>
                <span className="text-moss-700 font-semibold">{story.outcome}</span>
              </div>
            </div>
          ))}
        </div>

        {/* What You Leave With */}
        <div className="border-t border-sand-200 pt-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="mono-tag text-moss-700 block mb-1">PROGRAMME ASSETS</span>
            <h3 className="font-display text-xl md:text-2xl font-semibold text-ink-900">
              What you leave with at graduation
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-moss-50 border border-moss-100 rounded-xl p-6">
              <Globe2 className="w-6 h-6 text-moss-700 mb-3 stroke-[1.5]" />
              <h4 className="font-display text-base font-semibold text-ink-900 mb-1">
                Your Public Portfolio
              </h4>
              <p className="text-xs text-ink-700 leading-relaxed">
                A live URL displaying your 4 functional projects, prompt libraries, and architecture diagrams ready for recruiter review.
              </p>
            </div>

            <div className="bg-sand-100/70 border border-sand-200 rounded-xl p-6">
              <Award className="w-6 h-6 text-ink-900 mb-3 stroke-[1.5]" />
              <h4 className="font-display text-base font-semibold text-ink-900 mb-1">
                Verified Certificate
              </h4>
              <p className="text-xs text-ink-700 leading-relaxed">
                Certificate verifying specific project completion and code deliverables rather than passive lecture attendance.
              </p>
            </div>

            <div className="bg-surface border border-sand-200 rounded-xl p-6">
              <MessageSquare className="w-6 h-6 text-moss-700 mb-3 stroke-[1.5]" />
              <h4 className="font-display text-base font-semibold text-ink-900 mb-1">
                Alumni Network Access
              </h4>
              <p className="text-xs text-ink-700 leading-relaxed">
                Ongoing access to the peer community, updated weekly prompt files, and monthly guest tech breakdown sessions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
