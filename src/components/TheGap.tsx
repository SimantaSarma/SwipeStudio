// src/components/TheGap.tsx
import React from 'react';
import { Clock, Award, Users } from 'lucide-react';

export const TheGap: React.FC = () => {
  return (
    <section className="bg-ink-900 text-paper py-20 px-4 sm:px-6 border-b border-sand-200/10">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12">
          <span className="mono-tag text-saffron-500 block mb-2">WHY MOST COURSES FAIL</span>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-paper leading-tight tracking-tight">
            Three honest observations about learning AI today
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Observation 1 */}
          <div className="border border-sand-200/10 rounded-xl p-6 bg-ink-900/40 relative">
            <div className="w-10 h-10 rounded-lg bg-sand-200/10 flex items-center justify-center text-saffron-500 mb-5">
              <Clock className="w-5 h-5 stroke-[1.5]" />
            </div>
            <span className="mono-tag text-[10px] text-muted-on-dark block mb-1">01 / OBSOLESCENCE</span>
            <h3 className="font-display text-lg font-semibold text-paper mb-2">
              Tool tutorials age within months
            </h3>
            <p className="text-sm text-muted-on-dark leading-relaxed">
              When UI buttons move or a new model drops, step-by-step video tutorials become useless. Memorizing software interfaces is brittle; understanding data flow and prompting logic is permanent.
            </p>
          </div>

          {/* Observation 2 */}
          <div className="border border-sand-200/10 rounded-xl p-6 bg-ink-900/40 relative">
            <div className="w-10 h-10 rounded-lg bg-sand-200/10 flex items-center justify-center text-moss-100 mb-5">
              <Award className="w-5 h-5 stroke-[1.5]" />
            </div>
            <span className="mono-tag text-[10px] text-muted-on-dark block mb-1">02 / CREDIBILITY</span>
            <h3 className="font-display text-lg font-semibold text-paper mb-2">
              Certificates do not prove competence
            </h3>
            <p className="text-sm text-muted-on-dark leading-relaxed">
              Recruiters and founders in India see hundreds of identical PDF course certificates every week. What gets you a real interview is a live link showing an automation you built and debugged.
            </p>
          </div>

          {/* Observation 3 */}
          <div className="border border-sand-200/10 rounded-xl p-6 bg-ink-900/40 relative">
            <div className="w-10 h-10 rounded-lg bg-sand-200/10 flex items-center justify-center text-saffron-500 mb-5">
              <Users className="w-5 h-5 stroke-[1.5]" />
            </div>
            <span className="mono-tag text-[10px] text-muted-on-dark block mb-1">03 / COMPLETION</span>
            <h3 className="font-display text-lg font-semibold text-paper mb-2">
              Learning alone inevitably stalls
            </h3>
            <p className="text-sm text-muted-on-dark leading-relaxed">
              Self-paced pre-recorded courses have a 4% completion rate. When your webhook throws a 400 Bad Request error on Saturday midnight, you don't need a forum post—you need live mentor office hours.
            </p>
          </div>
        </div>

        {/* The Sprint Manifesto / Resolution */}
        <div className="border-t border-sand-200/15 pt-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="mono-tag text-moss-100 block mb-1">OUR CORE METHOD</span>
            <p className="font-display text-xl md:text-2xl text-paper font-semibold leading-snug">
              &quot;We teach the work, not the tools: every week ends with something shipped.&quot;
            </p>
          </div>
          <div className="text-xs font-mono text-muted-on-dark uppercase tracking-wider shrink-0 bg-sand-200/5 px-4 py-3 rounded-lg border border-sand-200/10">
            PRACTICE OVER LECTURES · 4 SHIPPED PROJECTS
          </div>
        </div>
      </div>
    </section>
  );
};
