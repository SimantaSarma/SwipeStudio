// src/components/FAQ.tsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CONFIG } from '../config';
import { track } from '../analytics';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First FAQ open initially

  const toggle = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
      track('faq_expand', { question: CONFIG.faqs[index].question });
    }
  };

  return (
    <section id="faq" className="bg-paper py-20 px-4 sm:px-6 border-b border-sand-200">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <span className="mono-tag text-moss-700 block mb-2">COMMON QUESTIONS</span>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-ink-900 leading-tight tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-ink-700 text-sm md:text-base mt-2">
            Clear, honest answers without fine print or evasive sales language.
          </p>
        </div>

        <div className="space-y-3">
          {CONFIG.faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-surface rounded-xl border border-sand-200 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-sand-100/40 transition-colors focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <span className="font-display text-base sm:text-lg font-semibold text-ink-900 leading-snug">
                    {faq.question}
                  </span>
                  <div className={`p-1 text-ink-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-ink-900' : ''}`}>
                    <ChevronDown className="w-5 h-5 stroke-[1.5]" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    className="px-5 sm:px-6 pb-6 pt-1 text-sm text-ink-700 leading-relaxed border-t border-sand-200/50 bg-paper/30 animate-reveal"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions WhatsApp block */}
        <div className="mt-12 text-center text-xs text-ink-500 font-mono">
          Have a question not listed here? Email us at{' '}
          <a
            href={`mailto:${CONFIG.brand.email}`}
            className="text-moss-700 underline underline-offset-4 hover:text-ink-900"
          >
            {CONFIG.brand.email}
          </a>
        </div>
      </div>
    </section>
  );
};
