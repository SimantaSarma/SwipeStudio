// src/components/AnnouncementBar.tsx
import React, { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { DerivedCohortState } from '../dateState';

interface Props {
  cohortState: DerivedCohortState;
  onCtaClick: () => void;
}

export const AnnouncementBar: React.FC<Props> = ({ cohortState, onCtaClick }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Cohort status announcement"
      className="bg-ink-900 text-paper border-b border-sand-200/10 py-2.5 px-4 text-xs font-mono tracking-tight"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center gap-2 text-center flex-wrap">
          <span className="inline-block w-2 h-2 rounded-full bg-saffron-500 animate-pulse" aria-hidden="true" />
          <span className="text-paper font-medium">
            {cohortState.isCohortStarted
              ? 'Cohort 04 in progress · Be first to know when Cohort 05 opens'
              : !cohortState.isApplicationsOpen
              ? 'Applications closed for Cohort 04 · Waitlist open'
              : cohortState.isEarlyBirdActive
              ? 'Cohort 04 starts 9 Jan · Early-bird ends 20 Dec · Applications close 3 Jan'
              : 'Cohort 04 starts 9 Jan · Applications close 3 Jan'}
          </span>
          <button
            onClick={onCtaClick}
            className="text-saffron-500 hover:text-white underline underline-offset-4 ml-1 inline-flex items-center gap-1 font-mono uppercase text-[11px] tracking-wider transition-colors"
          >
            {cohortState.isApplicationsOpen ? 'Reserve seat' : 'Join waitlist'}
            <ArrowRight className="w-3 h-3 stroke-[2]" />
          </button>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-on-dark hover:text-white p-1 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-saffron-500"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5 stroke-[1.5]" />
        </button>
      </div>
    </aside>
  );
};
