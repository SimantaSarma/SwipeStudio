// src/components/Curriculum.tsx
import React, { useState } from 'react';
import { ChevronDown, Clock, PackageCheck, Target } from 'lucide-react';
import { CONFIG } from '../config';
import { track } from '../analytics';

export const Curriculum: React.FC = () => {
  // Week 1 open by default per spec
  const [openWeeks, setOpenWeeks] = useState<number[]>([1]);

  const toggleWeek = (weekNumber: number) => {
    if (openWeeks.includes(weekNumber)) {
      setOpenWeeks(openWeeks.filter((w) => w !== weekNumber));
    } else {
      setOpenWeeks([...openWeeks, weekNumber]);
      const weekItem = CONFIG.curriculum.find((c) => c.week === weekNumber);
      if (weekItem) {
        track('faq_expand', { question: `Curriculum: Week ${weekNumber} - ${weekItem.title}` });
      }
    }
  };

  return (
    <section id="curriculum" className="bg-sand-100/40 py-20 px-4 sm:px-6 border-b border-sand-200">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="mono-tag text-moss-700 block mb-2">STRUCTURED SYLLABUS</span>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-ink-900 leading-tight tracking-tight">
            Six weeks from prompt basics to deployed automation
          </h2>
          <p className="text-ink-700 text-sm md:text-base mt-3 leading-relaxed">
            Every session balances practical conceptual scaffolding with live screen-sharing and hands-on debugging.
          </p>
        </div>

        {/* 6-Week Accordion */}
        <div className="space-y-4">
          {CONFIG.curriculum.map((week) => {
            const isOpen = openWeeks.includes(week.week);
            return (
              <div
                key={week.week}
                className="bg-surface rounded-xl border border-sand-200 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleWeek(week.week)}
                  aria-expanded={isOpen}
                  aria-controls={`curriculum-content-${week.week}`}
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 hover:bg-sand-100/50 transition-colors focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <div className="flex items-start gap-4">
                    <span className="mono-tag text-xs font-semibold text-moss-700 bg-moss-50 border border-moss-100 px-2.5 py-1 rounded shrink-0">
                      WEEK 0{week.week}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-ink-900 leading-snug">
                        {week.title}
                      </h3>
                      <p className="text-xs text-ink-500 mt-1">
                        {week.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-ink-500 bg-sand-100 px-2.5 py-1 rounded">
                      <Clock className="w-3 h-3 stroke-[1.5]" />
                      {week.liveHours} + {week.projectHours}
                    </span>
                    <div className={`p-1 text-ink-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-ink-900' : ''}`}>
                      <ChevronDown className="w-5 h-5 stroke-[1.5]" />
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`curriculum-content-${week.week}`}
                    className="px-5 sm:px-6 pb-6 pt-2 border-t border-sand-200/60 bg-paper/50 animate-reveal"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-4">
                        <div>
                          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-moss-700 mb-1 font-semibold">
                            <Target className="w-3.5 h-3.5 stroke-[2]" /> Learning Outcome
                          </span>
                          <p className="text-xs text-ink-700 leading-relaxed">
                            {week.outcome}
                          </p>
                        </div>

                        <div>
                          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-ink-900 mb-1 font-semibold">
                            <PackageCheck className="w-3.5 h-3.5 text-moss-600 stroke-[2]" /> Shipped Deliverable
                          </span>
                          <p className="text-xs text-ink-900 font-medium leading-relaxed bg-surface p-2.5 rounded border border-sand-200">
                            {week.deliverable}
                          </p>
                        </div>
                      </div>

                      <div>
                        <span className="block font-mono text-[10px] uppercase text-ink-400 mb-2">
                          TOPICS COVERED
                        </span>
                        <ul className="space-y-1.5 text-xs text-ink-700">
                          {week.topics.map((topic, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-saffron-500 mt-1.5 shrink-0" />
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
