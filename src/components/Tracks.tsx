// src/components/Tracks.tsx
import React from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { CONFIG, TrackConfig } from '../config';
import { track } from '../analytics';

interface Props {
  onSelectTrack: (trackId: string) => void;
}

export const Tracks: React.FC<Props> = ({ onSelectTrack }) => {
  const handleTrackClick = (trackItem: TrackConfig) => {
    track('cta_click', { id: `select_track_${trackItem.id}`, location: 'track_card' });
    onSelectTrack(trackItem.id);
  };

  return (
    <section id="programme" className="bg-moss-50 py-20 px-4 sm:px-6 border-b border-sand-200">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-12">
          <span className="mono-tag text-moss-700 block mb-2">CURRICULAR TRACKS</span>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-ink-900 leading-tight tracking-tight">
            Three interconnected tracks. One integrated outcome.
          </h2>
          <p className="text-ink-700 text-base mt-3 leading-relaxed">
            Every learner covers all three disciplines during the 6 weeks, with the flexibility to specialize their final capstone deliverable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CONFIG.tracks.map((t) => (
            <div
              key={t.id}
              className="bg-surface rounded-xl border border-sand-200 p-6 flex flex-col justify-between hover:border-moss-600 transition-colors duration-150"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="mono-tag text-[10px] text-moss-700 bg-moss-100/60 px-2 py-0.5 rounded">
                    {t.tag}
                  </span>
                  <span className="text-xs font-mono text-ink-500 uppercase">CORE MODULE</span>
                </div>

                <h3 className="font-display text-xl font-semibold text-ink-900 mb-2">
                  {t.name}
                </h3>

                <div className="mb-4">
                  <span className="block text-xs font-mono uppercase text-ink-500 mb-1">AUDIENCE FIT</span>
                  <p className="text-xs text-ink-700 leading-relaxed">
                    {t.forWho}
                  </p>
                </div>

                <div className="mb-6">
                  <span className="block text-xs font-mono uppercase text-moss-700 mb-1">KEY OUTCOME</span>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-moss-600 shrink-0 mt-0.5 stroke-[2]" />
                    <p className="text-xs text-ink-900 font-medium leading-relaxed">
                      {t.outcome}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                {/* Tools as Monospace Tags */}
                <div className="border-t border-sand-200/80 pt-4 mb-4">
                  <span className="block text-[10px] font-mono uppercase text-ink-400 mb-2">TOOLS & PLATFORMS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {t.tools.map((tool) => (
                      <span
                        key={tool}
                        className="mono-tag text-[10px] bg-sand-100 text-ink-700 px-2 py-1 rounded border border-sand-200/60"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleTrackClick(t)}
                  className="w-full btn-secondary text-xs h-10 gap-1.5 justify-center hover:bg-moss-50 hover:border-moss-600 hover:text-moss-700 transition-all"
                >
                  <span>Select {t.name}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
