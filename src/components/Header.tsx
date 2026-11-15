// src/components/Header.tsx
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { CONFIG } from '../config';
import { DerivedCohortState } from '../dateState';
import { track } from '../analytics';

interface Props {
  cohortState: DerivedCohortState;
  onOpenLeadModal: (ctaLocation: 'header') => void;
}

export const Header: React.FC<Props> = ({ cohortState, onOpenLeadModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (anchor: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCta = () => {
    track('cta_click', { id: 'header_reserve', location: 'header' });
    onOpenLeadModal('header');
  };

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-sand-200 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Wordmark */}
        <a
          href="/"
          className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-saffron-500 rounded-sm"
          aria-label={`${CONFIG.brand.name} home`}
        >
          <div className="w-8 h-8 rounded-md bg-ink-900 flex items-center justify-center text-saffron-500 font-mono font-bold text-sm tracking-wider">
            AI
          </div>
          <div className="flex flex-col">
            <span className="font-display font-semibold text-lg text-ink-900 leading-tight">
              {CONFIG.brand.name}
            </span>
            <span className="font-mono text-[10px] uppercase text-ink-500 tracking-wider">
              {CONFIG.programme.edition}
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-ink-700" aria-label="Main Navigation">
          <button
            onClick={() => handleNavClick('#programme')}
            className="hover:text-ink-900 transition-colors focus:outline-none focus:ring-1 focus:ring-saffron-500 rounded py-1 px-1.5"
          >
            Programme
          </button>
          <button
            onClick={() => handleNavClick('#curriculum')}
            className="hover:text-ink-900 transition-colors focus:outline-none focus:ring-1 focus:ring-saffron-500 rounded py-1 px-1.5"
          >
            Curriculum
          </button>
          <button
            onClick={() => handleNavClick('#outcomes')}
            className="hover:text-ink-900 transition-colors focus:outline-none focus:ring-1 focus:ring-saffron-500 rounded py-1 px-1.5"
          >
            Outcomes
          </button>
          <button
            onClick={() => handleNavClick('#pricing')}
            className="hover:text-ink-900 transition-colors focus:outline-none focus:ring-1 focus:ring-saffron-500 rounded py-1 px-1.5"
          >
            Pricing
          </button>
          <button
            onClick={() => handleNavClick('#faq')}
            className="hover:text-ink-900 transition-colors focus:outline-none focus:ring-1 focus:ring-saffron-500 rounded py-1 px-1.5"
          >
            FAQ
          </button>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={handleCta}
            className="btn-primary text-sm px-5 py-2.5 h-11"
          >
            {cohortState.primaryCtaLabel}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={handleCta}
            className="btn-primary text-xs px-3.5 py-2 h-10"
          >
            {cohortState.isApplicationsOpen ? 'Reserve' : 'Waitlist'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-ink-700 hover:text-ink-900 rounded-md focus:outline-none focus:ring-2 focus:ring-saffron-500"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-sand-200 bg-paper px-6 py-6 space-y-4 shadow-lg animate-reveal">
          <nav className="flex flex-col space-y-3 text-base font-medium text-ink-900">
            <button
              onClick={() => handleNavClick('#programme')}
              className="text-left py-2 border-b border-sand-200 hover:text-moss-700"
            >
              Programme Overview
            </button>
            <button
              onClick={() => handleNavClick('#curriculum')}
              className="text-left py-2 border-b border-sand-200 hover:text-moss-700"
            >
              6-Week Curriculum
            </button>
            <button
              onClick={() => handleNavClick('#outcomes')}
              className="text-left py-2 border-b border-sand-200 hover:text-moss-700"
            >
              Projects & Outcomes
            </button>
            <button
              onClick={() => handleNavClick('#pricing')}
              className="text-left py-2 border-b border-sand-200 hover:text-moss-700"
            >
              Tuition & Seats
            </button>
            <button
              onClick={() => handleNavClick('#faq')}
              className="text-left py-2 border-b border-sand-200 hover:text-moss-700"
            >
              Frequently Asked Questions
            </button>
          </nav>
          <div className="pt-2">
            <button
              onClick={handleCta}
              className="btn-primary w-full text-center"
            >
              {cohortState.primaryCtaLabel}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
