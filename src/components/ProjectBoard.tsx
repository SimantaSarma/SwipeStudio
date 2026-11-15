// src/components/ProjectBoard.tsx
import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Terminal, Cpu, GitCommit, Layers } from 'lucide-react';

export const ProjectBoard: React.FC = () => {
  // Allow user to click or hover any panel to bring it directly to the foreground
  const [activePanel, setActivePanel] = useState<1 | 2 | 3>(1);

  return (
    <div
      className="relative w-full max-w-lg mx-auto select-none"
      aria-label="Interactive project board preview demonstrating learner deliverables"
    >
      {/* Board Frame Header */}
      <div className="bg-sand-100/80 rounded-2xl border border-sand-200 p-2 sm:p-3 shadow-sm">
        <div className="flex items-center justify-between pb-2 px-2 border-b border-sand-200/60 mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sand-200 border border-sand-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-sand-200 border border-sand-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-sand-200 border border-sand-200" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-500 font-medium pl-1">
              LEARNER DELIVERABLE CANVAS
            </span>
          </div>

          {/* Interactive Layer Switcher */}
          <div className="flex items-center gap-1 bg-surface p-0.5 rounded-md border border-sand-200">
            <button
              type="button"
              onClick={() => setActivePanel(1)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                activePanel === 1
                  ? 'bg-ink-900 text-paper font-semibold shadow-xs'
                  : 'text-ink-500 hover:text-ink-900'
              }`}
              title="View Prompt & JSON Schema"
            >
              01 Schema
            </button>
            <button
              type="button"
              onClick={() => setActivePanel(2)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                activePanel === 2
                  ? 'bg-ink-900 text-paper font-semibold shadow-xs'
                  : 'text-ink-500 hover:text-ink-900'
              }`}
              title="View Live Automation Workflow"
            >
              02 Workflow
            </button>
            <button
              type="button"
              onClick={() => setActivePanel(3)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                activePanel === 3
                  ? 'bg-ink-900 text-paper font-semibold shadow-xs'
                  : 'text-ink-500 hover:text-ink-900'
              }`}
              title="View Shipped Portfolio"
            >
              03 Portfolio
            </button>
          </div>
        </div>

        {/* The Overlapping Deck Container */}
        <div className="relative h-[360px] sm:h-[380px] w-full rounded-xl overflow-hidden bg-sand-100/40 border border-sand-200/60 p-3 flex flex-col justify-between">
          
          {/* PANEL 1: Prompt -> Structured Output Card */}
          <div
            onClick={() => setActivePanel(1)}
            onMouseEnter={() => setActivePanel(1)}
            className={`absolute left-3 right-3 sm:right-auto sm:w-[380px] rounded-xl border p-4 transition-all duration-300 cursor-pointer ${
              activePanel === 1
                ? 'top-2 sm:top-3 z-30 bg-surface border-sand-200 shadow-md scale-[1.01]'
                : 'top-2 sm:top-2 z-10 bg-surface/90 border-sand-200/80 shadow-xs opacity-75 hover:opacity-95'
            }`}
          >
            <div className="flex items-center justify-between border-b border-sand-200/80 pb-2 mb-2.5">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-moss-700 stroke-[2]" />
                <span className="font-mono text-[10px] text-ink-900 uppercase font-semibold">
                  01 / PROMPT → JSON SCHEMA
                </span>
              </div>
              <span className="mono-tag text-[9px] text-moss-700 bg-moss-50 px-1.5 py-0.5 rounded border border-moss-100">
                STRICT JSON MODE
              </span>
            </div>

            {/* Prompt Input */}
            <div className="bg-sand-100/60 rounded-md p-2 mb-2 border border-sand-200/60 text-xs">
              <span className="text-moss-700 font-mono text-[9px] uppercase font-bold block mb-0.5">
                INPUT PROMPT
              </span>
              <p className="font-mono text-[11px] leading-snug text-ink-900">
                &quot;Extract GPU compute pricing trends and enforce strict citation IDs.&quot;
              </p>
            </div>

            {/* Structured Output (No raw pre scrollbars) */}
            <div className="bg-ink-900 rounded-md p-2.5 text-[11px] font-mono text-paper leading-snug border border-ink-700">
              <div className="flex items-center justify-between text-[10px] text-muted-on-dark mb-1 pb-1 border-b border-white/10">
                <span>validated_output.json</span>
                <span className="text-moss-100 flex items-center gap-1 text-[9px]">
                  <CheckCircle2 className="w-3 h-3 text-moss-100 stroke-[2]" /> valid schema
                </span>
              </div>
              <div className="text-[10px] font-mono text-moss-50 leading-relaxed space-y-0.5">
                <div>&#123;</div>
                <div className="pl-3">
                  <span className="text-saffron-500">&quot;infra_trend&quot;</span>: <span className="text-paper">&quot;-14% YoY&quot;</span>,
                </div>
                <div className="pl-3">
                  <span className="text-saffron-500">&quot;citation_id&quot;</span>: <span className="text-paper">&quot;SEC-10K-L482&quot;</span>,
                </div>
                <div className="pl-3">
                  <span className="text-saffron-500">&quot;audit_check&quot;</span>: <span className="text-moss-100">&quot;PASS&quot;</span>
                </div>
                <div>&#125;</div>
              </div>
            </div>
          </div>

          {/* PANEL 2: Mini Workflow Diagram (Offset / Overlapping) */}
          <div
            onClick={() => setActivePanel(2)}
            onMouseEnter={() => setActivePanel(2)}
            className={`absolute left-4 right-2 sm:left-auto sm:right-3 sm:w-[370px] rounded-xl border p-4 transition-all duration-300 cursor-pointer ${
              activePanel === 2
                ? 'top-16 sm:top-18 z-30 bg-surface border-moss-600/40 shadow-lg scale-[1.01]'
                : 'top-20 sm:top-24 z-20 bg-surface/90 border-sand-200/80 shadow-xs opacity-85 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between border-b border-sand-200/80 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-moss-700 stroke-[1.5]" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-900 font-semibold">
                  02 / LIVE N8N AUTOMATION PIPELINE
                </span>
              </div>
              <span className="mono-tag text-[9px] text-moss-700 bg-moss-50 px-1.5 py-0.5 rounded border border-moss-100">
                ACTIVE
              </span>
            </div>

            {/* Nodes Flow */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2 rounded bg-sand-100/70 border border-sand-200 text-xs">
                <span className="font-mono text-[11px] text-ink-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron-500" />
                  Webhook: POST /lead-capture
                </span>
                <span className="font-mono text-[9px] text-ink-500 bg-surface px-1 rounded">200 OK</span>
              </div>

              <div className="flex justify-center text-ink-400 py-0.5">
                <ArrowRight className="w-3 h-3 rotate-90 stroke-[2]" />
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-sand-100/70 border border-sand-200 text-xs">
                <span className="font-mono text-[11px] text-ink-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-moss-600" />
                  LLM Dedupe &amp; Classifier
                </span>
                <span className="font-mono text-[9px] text-moss-700 bg-surface px-1 rounded">0.4s</span>
              </div>

              <div className="flex justify-center text-ink-400 py-0.5">
                <ArrowRight className="w-3 h-3 rotate-90 stroke-[2]" />
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-moss-50 border border-moss-100 text-xs">
                <span className="font-mono text-[11px] text-moss-700 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-moss-700" />
                  WhatsApp Cloud API Dispatch
                </span>
                <span className="font-mono text-[9px] text-moss-700 font-bold">Delivered</span>
              </div>
            </div>
          </div>

          {/* PANEL 3: Shipped Portfolio Card (Bottom Overlapping) */}
          <div
            onClick={() => setActivePanel(3)}
            onMouseEnter={() => setActivePanel(3)}
            className={`absolute left-3 right-3 sm:left-6 sm:w-[360px] rounded-xl border p-3.5 transition-all duration-300 cursor-pointer ${
              activePanel === 3
                ? 'bottom-2 sm:bottom-3 z-30 bg-paper border-sand-200 shadow-lg scale-[1.01]'
                : 'bottom-1 sm:bottom-2 z-15 bg-paper/95 border-sand-200/80 shadow-xs opacity-90 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="mono-tag text-[9px] text-ink-500">
                03 / SHIPPED PORTFOLIO DELIVERABLE
              </span>
              <span className="inline-flex items-center gap-1 font-mono text-[9px] text-moss-700 bg-moss-100/60 px-1.5 py-0.5 rounded">
                <GitCommit className="w-3 h-3 stroke-[2]" /> LIVE URL
              </span>
            </div>

            <h4 className="font-display font-semibold text-ink-900 text-xs leading-snug">
              student-portfolio.vercel.app
            </h4>
            <p className="text-[11px] text-ink-500 mb-2">
              4 production projects · Source prompts · Real verified outputs
            </p>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="mono-tag text-[9px] bg-sand-200/60 text-ink-700 px-1.5 py-0.5 rounded">
                N8N
              </span>
              <span className="mono-tag text-[9px] bg-sand-200/60 text-ink-700 px-1.5 py-0.5 rounded">
                CLAUDE 3.5
              </span>
              <span className="mono-tag text-[9px] bg-sand-200/60 text-ink-700 px-1.5 py-0.5 rounded">
                WHATSAPP API
              </span>
              <span className="mono-tag text-[9px] bg-sand-200/60 text-ink-700 px-1.5 py-0.5 rounded">
                FIGMA
              </span>
            </div>
          </div>

        </div>

        {/* Footer Hint */}
        <div className="mt-2 pt-1.5 px-2 flex items-center justify-between text-[10px] font-mono text-ink-400">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 stroke-[1.5]" /> Hover or tap any panel to inspect
          </span>
          <span>Zero stock images · 100% HTML/CSS</span>
        </div>
      </div>
    </div>
  );
};
