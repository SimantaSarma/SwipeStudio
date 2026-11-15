// src/components/WhatYoullBuild.tsx
import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { CONFIG } from '../config';
import { DerivedCohortState } from '../dateState';
import { track } from '../analytics';

interface Props {
  cohortState: DerivedCohortState;
  onOpenLeadModal: (location: 'build') => void;
}

export const WhatYoullBuild: React.FC<Props> = ({ cohortState, onOpenLeadModal }) => {
  const handleReserve = () => {
    track('cta_click', { id: 'build_reserve', location: 'build' });
    onOpenLeadModal('build');
  };

  return (
    <section id="outcomes" className="bg-paper py-20 px-4 sm:px-6 border-b border-sand-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="mono-tag text-moss-700 block mb-2">SHIPPED PORTFOLIO</span>
            <h2 className="font-display text-2xl md:text-4xl font-semibold text-ink-900 leading-tight tracking-tight">
              Four real projects you will ship to production
            </h2>
            <p className="text-ink-700 text-base mt-2 leading-relaxed">
              No toy exercises or copy-pasted notebooks. You will build and deploy four tangible systems you can show to founders, managers, and recruiters.
            </p>
          </div>
          <div className="shrink-0 font-mono text-xs text-ink-500 uppercase">
            PROOF OF WORK &gt; CERTIFICATES
          </div>
        </div>

        {/* 4 Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {CONFIG.projects.map((p) => (
            <div
              key={p.id}
              className="bg-surface rounded-xl border border-sand-200 p-6 flex flex-col justify-between hover:border-ink-400 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="mono-tag text-[10px] text-ink-500 bg-sand-100 px-2 py-0.5 rounded">
                    {p.number}
                  </span>
                  <span className="mono-tag text-[10px] text-moss-700 bg-moss-50 px-2 py-0.5 rounded border border-moss-100">
                    LIVE SHIPPED
                  </span>
                </div>

                <h3 className="font-display text-xl font-semibold text-ink-900 mb-1">
                  {p.title}
                </h3>
                <p className="font-mono text-xs text-moss-700 font-medium mb-3">
                  {p.tagline}
                </p>

                <p className="text-sm text-ink-700 leading-relaxed mb-5">
                  {p.description}
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-sand-200/70">
                {/* Deliverable */}
                <div>
                  <span className="block font-mono text-[10px] uppercase text-ink-400 mb-1">
                    TANGIBLE DELIVERABLE
                  </span>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-moss-600 shrink-0 mt-0.5 stroke-[2]" />
                    <span className="text-xs font-medium text-ink-900 leading-snug">
                      {p.deliverable}
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <span className="block font-mono text-[10px] uppercase text-ink-400 mb-1.5">
                    VERIFIED SKILLS
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {p.skills.map((skill) => (
                      <span
                        key={skill}
                        className="mono-tag text-[10px] bg-sand-100 text-ink-700 px-2 py-0.5 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner After What You'll Build (Placement 3) */}
        <div className="bg-sand-100/70 rounded-2xl border border-sand-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="font-display text-xl font-semibold text-ink-900">
              Leave the sprint with an undeniable portfolio
            </h3>
            <p className="text-sm text-ink-700">
              Cohort 04 is limited to 40 spots to maintain 1:1 project review fidelity.
            </p>
          </div>
          <button
            onClick={handleReserve}
            className="btn-primary shrink-0"
          >
            <span>{cohortState.primaryCtaLabel}</span>
            <ArrowRight className="w-4 h-4 ml-2 stroke-[2]" />
          </button>
        </div>
      </div>
    </section>
  );
};
