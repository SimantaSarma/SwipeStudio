// src/components/Footer.tsx
import React from 'react';
import { MessageCircle, Mail, AlertCircle } from 'lucide-react';
import { CONFIG } from '../config';
import { useToast } from './Toast';
import { track } from '../analytics';

export const Footer: React.FC = () => {
  const { showToast } = useToast();

  const handleWhatsAppChat = (e: React.MouseEvent) => {
    e.preventDefault();
    track('whatsapp_click', { location: 'footer' });

    const phone = CONFIG.brand.whatsappNumber.replace(/[^0-9]/g, '');
    if (!phone || phone === '9876543210' || phone.length < 10) {
      showToast('WhatsApp admissions line is currently in mock/test mode. Reach out to admissions@appliedaistudio.in', 'info');
      return;
    }

    const prefilledText = encodeURIComponent(
      `Hi Applied AI Studio, I have a question about AI Skills Sprint Cohort 04 [ref: footer-cta]`
    );
    window.open(`https://wa.me/${phone}?text=${prefilledText}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-sand-100 border-t border-sand-200 text-ink-700 py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Prototype Sample Content Banner */}
        <div className="bg-paper border border-sand-200 rounded-xl p-4 mb-12 flex items-start sm:items-center gap-3">
          <AlertCircle className="w-5 h-5 text-moss-700 shrink-0 stroke-[1.5]" />
          <div className="text-xs text-ink-700 leading-relaxed">
            <span className="font-semibold text-ink-900">Prototype — sample candidate assignment:</span>{' '}
            {CONFIG.brand.workingTitleNotice} Course schedule, pricing and syllabus are production-ready design representations. No real financial transactions are executed on this prototype.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-ink-900 flex items-center justify-center text-saffron-500 font-mono font-bold text-xs">
                AI
              </div>
              <span className="font-display font-semibold text-lg text-ink-900">
                {CONFIG.brand.name}
              </span>
            </div>
            <p className="text-xs text-ink-500 leading-relaxed max-w-sm">
              Six weeks, four shipped projects, one portfolio you can show. Practical AI systems education designed for builders across India.
            </p>
            <p className="text-xs text-ink-400 font-mono">
              Bengaluru & Online live across IST timezones.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-2">
            <span className="mono-tag text-xs text-ink-900 block mb-2 font-semibold">
              NAVIGATION
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#programme" className="hover:text-ink-900 underline-offset-2 hover:underline">
                  Curricular Tracks
                </a>
              </li>
              <li>
                <a href="#outcomes" className="hover:text-ink-900 underline-offset-2 hover:underline">
                  Shipped Projects
                </a>
              </li>
              <li>
                <a href="#curriculum" className="hover:text-ink-900 underline-offset-2 hover:underline">
                  Weekly Syllabus
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-ink-900 underline-offset-2 hover:underline">
                  Tuition & Seats
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-ink-900 underline-offset-2 hover:underline">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Support */}
          <div className="space-y-3">
            <span className="mono-tag text-xs text-ink-900 block mb-2 font-semibold">
              ADMISSIONS & CONTACT
            </span>
            <div className="space-y-2 text-xs">
              <button
                onClick={handleWhatsAppChat}
                className="flex items-center gap-2 text-moss-700 hover:text-ink-900 font-medium py-1"
              >
                <MessageCircle className="w-4 h-4 stroke-[1.5]" />
                <span>Chat on WhatsApp</span>
              </button>
              <a
                href={`mailto:${CONFIG.brand.email}`}
                className="flex items-center gap-2 text-ink-700 hover:text-ink-900 py-1"
              >
                <Mail className="w-4 h-4 stroke-[1.5]" />
                <span>{CONFIG.brand.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-sand-200/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-ink-400">
          <div>
            © {new Date().getFullYear()} {CONFIG.brand.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-ink-700 cursor-pointer">Privacy Notice</span>
            <span className="hover:text-ink-700 cursor-pointer">Terms of Participation</span>
            <span className="hover:text-ink-700 cursor-pointer">Honor Code</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
