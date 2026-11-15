// src/components/Hero.tsx
import React from 'react';
import { ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { CONFIG } from '../config';
import { DerivedCohortState } from '../dateState';
import { ProjectBoard } from './ProjectBoard';
import { track } from '../analytics';

interface Props {
  cohortState: DerivedCohortState;
  onOpenLeadModal: (location: 'hero') => void;
  onOpenSyllabusModal: () => void;
}

export const Hero: React.FC<Props> = ({ cohortState, onOpenLeadModal, onOpenSyllabusModal }) => {
  const handleReserve = () => {
    track('cta_click', { id: 'hero_reserve', location: 'hero' });
    onOpenLeadModal('hero');
  };

  const handleSyllabus = () => {
    track('cta_click', { id: 'hero_syllabus', location: 'hero' });
    onOpenSyllabusModal();
  };

  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-24 border-b border-sand-200 overflow-hidden bg-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Funnel CTAs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Overline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-sand-100 border border-sand-200">
              <span className="w-2 h-2 rounded-full bg-moss-600" />
              <span className="mono-tag text-ink-700">
                {CONFIG.programme.name} · {CONFIG.programme.edition}
              </span>
            </div>

            {/* H1 Headline */}
            <h1 className="hero-h1 text-ink-900 tracking-tight">
              {CONFIG.programme.headline}
            </h1>

            {/* Dek */}
            <p className="text-lg md:text-xl text-ink-700 leading-relaxed max-w-xl font-normal">
              {CONFIG.programme.dek}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={handleReserve}
                className="btn-primary group"
              >
                <span>{cohortState.primaryCtaLabel}</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-150 group-hover:translate-x-1 stroke-[2]" />
              </button>

              <button
                onClick={handleSyllabus}
                className="btn-secondary"
              >
                <FileText className="w-4 h-4 mr-2 text-ink-500 stroke-[1.5]" />
                <span>Download syllabus</span>
              </button>
            </div>

            {/* Early bird notice / waitlist notice if relevant */}
            {cohortState.isEarlyBirdActive && (
              <p className="text-xs font-mono text-moss-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
                {cohortState.badgeNotice} (Ends 20 Dec)
              </p>
            )}

            {/* Micro-facts */}
            <div className="pt-6 border-t border-sand-200/80">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-ink-700 uppercase">
                <div className="border-l-2 border-moss-600 pl-3">
                  <span className="block text-ink-400 text-[10px]">DURATION</span>
                  <span className="font-semibold text-ink-900">6 Weeks</span>
                </div>
                <div className="border-l-2 border-moss-600 pl-3">
                  <span className="block text-ink-400 text-[10px]">SCHEDULE</span>
                  <span className="font-semibold text-ink-900">Sat + Sun Live</span>
                </div>
                <div className="border-l-2 border-moss-600 pl-3">
                  <span className="block text-ink-400 text-[10px]">SEATS</span>
                  <span className="font-semibold text-ink-900">40 per cohort</span>
                </div>
                <div className="border-l-2 border-moss-600 pl-3">
                  <span className="block text-ink-400 text-[10px]">PREREQUISITE</span>
                  <span className="font-semibold text-ink-900">Zero coding</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: HTML/CSS Project Board */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <ProjectBoard />
          </div>
        </div>
      </div>
    </section>
  );
};
