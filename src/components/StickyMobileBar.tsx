// src/components/StickyMobileBar.tsx
import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { CONFIG } from '../config';
import { DerivedCohortState } from '../dateState';
import { useToast } from './Toast';
import { track } from '../analytics';

interface Props {
  cohortState: DerivedCohortState;
  onOpenLeadModal: (location: 'sticky') => void;
  isModalOpen: boolean;
}

export const StickyMobileBar: React.FC<Props> = ({
  cohortState,
  onOpenLeadModal,
  isModalOpen
}) => {
  const [visible, setVisible] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // 1. Detect scroll past hero
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      // Show once scrolled past 400px (past hero)
      setVisible(scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. Detect input focus anywhere on the page
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        setIsInputFocused(true);
      }
    };

    const handleFocusOut = () => {
      setIsInputFocused(false);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    // 3. Detect virtual keyboard using VisualViewport API
    let initialViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;

    const handleViewportResize = () => {
      if (window.visualViewport) {
        const currentHeight = window.visualViewport.height;
        // If viewport height shrinks by > 150px, keyboard is open
        if (initialViewportHeight - currentHeight > 150) {
          setIsKeyboardOpen(true);
        } else {
          setIsKeyboardOpen(false);
          initialViewportHeight = currentHeight;
        }
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
      }
    };
  }, []);

  const handleWhatsApp = () => {
    track('whatsapp_click', { location: 'sticky' });
    const phone = CONFIG.brand.whatsappNumber.replace(/[^0-9]/g, '');
    if (!phone || phone === '9876543210' || phone.length < 10) {
      showToast('WhatsApp admissions line is currently in mock/test mode. Contact admissions@appliedaistudio.in', 'info');
      return;
    }

    const prefilledText = encodeURIComponent(
      `Hi Applied AI Studio, I want to inquire about Cohort 04 [ref: mobile-sticky]`
    );
    window.open(`https://wa.me/${phone}?text=${prefilledText}`, '_blank', 'noopener,noreferrer');
  };

  const handleCta = () => {
    track('cta_click', { id: 'sticky_reserve', location: 'sticky' });
    onOpenLeadModal('sticky');
  };

  // Condition to hide:
  // - Not scrolled past hero
  // - Modal is currently open
  // - Any input is focused
  // - Virtual keyboard is detected open
  if (!visible || isModalOpen || isInputFocused || isKeyboardOpen) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Mobile sticky registration bar"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-paper/95 backdrop-blur-md border-t border-sand-200 p-3 px-4 shadow-lg animate-reveal"
    >
      <div className="flex items-center gap-3 max-w-md mx-auto">
        <button
          onClick={handleCta}
          className="btn-primary flex-1 text-sm py-2.5 h-12 justify-center"
        >
          <span>{cohortState.primaryCtaLabel}</span>
          <ArrowRight className="w-4 h-4 ml-1.5 stroke-[2]" />
        </button>

        <button
          onClick={handleWhatsApp}
          className="w-12 h-12 rounded-lg border border-sand-200 bg-surface flex items-center justify-center text-moss-700 hover:bg-moss-50 shrink-0 focus:outline-none focus:ring-2 focus:ring-saffron-500"
          aria-label="Chat on WhatsApp with admissions counselor"
        >
          <MessageCircle className="w-5 h-5 stroke-[1.75]" />
        </button>
      </div>
    </div>
  );
};
