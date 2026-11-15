// src/pages/LandingPage.tsx
import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from '../components/AnnouncementBar';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { AudienceStrip } from '../components/AudienceStrip';
import { TheGap } from '../components/TheGap';
import { Tracks } from '../components/Tracks';
import { WhatYoullBuild } from '../components/WhatYoullBuild';
import { Curriculum } from '../components/Curriculum';
import { WhoItsFor } from '../components/WhoItsFor';
import { InstructorSupport } from '../components/InstructorSupport';
import { ProofOutcomes } from '../components/ProofOutcomes';
import { PricingCohort } from '../components/PricingCohort';
import { FAQ } from '../components/FAQ';
import { FinalCtaBand } from '../components/FinalCtaBand';
import { Footer } from '../components/Footer';
import { StickyMobileBar } from '../components/StickyMobileBar';
import { LeadModal } from '../components/LeadModal';
import { SyllabusModal } from '../components/SyllabusModal';
import { IntroSessionModal } from '../components/IntroSessionModal';
import { PrototypeDrawer } from '../components/PrototypeDrawer';

import { getDerivedCohortState, subscribeDateMode, DerivedCohortState } from '../dateState';
import { CtaLocation, UserSegment } from '../types';
import { initUtmTracking, track } from '../analytics';

interface Props {
  onNavigateThankYou: () => void;
}

export const LandingPage: React.FC<Props> = ({ onNavigateThankYou }) => {
  const [cohortState, setCohortState] = useState<DerivedCohortState>(getDerivedCohortState());

  // Modal states
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [activeCtaLocation, setActiveCtaLocation] = useState<CtaLocation>('hero');
  const [prefilledTrackId, setPrefilledTrackId] = useState<string | undefined>(undefined);
  const [partialDataFromBand, setPartialDataFromBand] = useState<{
    leadId: string;
    name: string;
    phone: string;
    segment: UserSegment;
  } | undefined>(undefined);

  const [syllabusModalOpen, setSyllabusModalOpen] = useState(false);
  const [introModalOpen, setIntroModalOpen] = useState(false);

  useEffect(() => {
    // 1. Initialize UTM and Referrer tracking on landing
    initUtmTracking();
    track('page_view', { page: '/' });

    // 2. Subscribe to date mode simulation changes
    const unsubDates = subscribeDateMode(() => {
      setCohortState(getDerivedCohortState());
    });

    return () => unsubDates();
  }, []);

  const openLeadModal = (location: CtaLocation, trackId?: string) => {
    setActiveCtaLocation(location);
    setPrefilledTrackId(trackId);
    setPartialDataFromBand(undefined);
    setLeadModalOpen(true);
  };

  const handleStep2FromBand = (
    leadId: string,
    name: string,
    phone: string,
    segment: UserSegment
  ) => {
    setActiveCtaLocation('final');
    setPartialDataFromBand({ leadId, name, phone, segment });
    setLeadModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-paper text-ink-900 selection:bg-moss-100 flex flex-col relative">
      {/* 0. Announcement Bar */}
      <AnnouncementBar
        cohortState={cohortState}
        onCtaClick={() => openLeadModal('header')}
      />

      {/* 1. Header */}
      <Header
        cohortState={cohortState}
        onOpenLeadModal={(loc) => openLeadModal(loc)}
      />

      <main id="main-content" className="flex-1">
        {/* 2. Hero */}
        <Hero
          cohortState={cohortState}
          onOpenLeadModal={(loc) => openLeadModal(loc)}
          onOpenSyllabusModal={() => setSyllabusModalOpen(true)}
        />

        {/* 3. Audience Strip */}
        <AudienceStrip />

        {/* 4. The Gap */}
        <TheGap />

        {/* 5. Tracks */}
        <Tracks
          onSelectTrack={(trackId) => openLeadModal('track_card', trackId)}
        />

        {/* 6. What You'll Build */}
        <WhatYoullBuild
          cohortState={cohortState}
          onOpenLeadModal={(loc) => openLeadModal(loc)}
        />

        {/* 7. Curriculum */}
        <Curriculum />

        {/* 8. Who It's For / Not For */}
        <WhoItsFor />

        {/* 9. Instructor & Support */}
        <InstructorSupport />

        {/* 10. Proof & Outcomes */}
        <ProofOutcomes />

        {/* 11. Pricing & Cohort */}
        <PricingCohort
          cohortState={cohortState}
          onOpenLeadModal={(loc) => openLeadModal(loc)}
        />

        {/* 12. FAQ */}
        <FAQ />

        {/* 13. Final CTA Band */}
        <FinalCtaBand
          cohortState={cohortState}
          onOpenStep2WithPartial={handleStep2FromBand}
          onOpenIntroModal={() => setIntroModalOpen(true)}
        />
      </main>

      {/* 14. Footer */}
      <Footer />

      {/* Sticky Mobile Bar */}
      <StickyMobileBar
        cohortState={cohortState}
        onOpenLeadModal={(loc) => openLeadModal(loc)}
        isModalOpen={leadModalOpen || syllabusModalOpen || introModalOpen}
      />

      {/* Lead Modal (Step 1 + Step 2) */}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        ctaLocation={activeCtaLocation}
        cohortState={cohortState}
        initialTrackId={prefilledTrackId}
        initialPartialData={partialDataFromBand}
        onSuccessNavigate={onNavigateThankYou}
      />

      {/* Syllabus Micro-Form Modal */}
      <SyllabusModal
        isOpen={syllabusModalOpen}
        onClose={() => setSyllabusModalOpen(false)}
      />

      {/* Intro Session Modal */}
      <IntroSessionModal
        isOpen={introModalOpen}
        onClose={() => setIntroModalOpen(false)}
      />

      {/* Prototype Reviewer Notes Drawer */}
      <PrototypeDrawer />
    </div>
  );
};
