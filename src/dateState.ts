// src/dateState.ts
import { CONFIG } from './config';

export type SimulatedDateMode =
  | 'default' // 2026-11-15: Early bird active, applications open
  | 'early_bird_passed' // 2026-12-22: Standard fee, early-bird badge hidden
  | 'applications_closed' // 2027-01-05: Waitlist mode
  | 'cohort_started'; // 2027-01-10: Next cohort mode

const DATE_SIMULATION_KEY = 'applied_ai_date_mode';

type DateStateListener = (mode: SimulatedDateMode) => void;
const dateListeners: Set<DateStateListener> = new Set();

export function getSimulatedDateMode(): SimulatedDateMode {
  if (typeof window === 'undefined') return 'default';
  try {
    const saved = localStorage.getItem(DATE_SIMULATION_KEY);
    if (saved && ['default', 'early_bird_passed', 'applications_closed', 'cohort_started'].includes(saved)) {
      return saved as SimulatedDateMode;
    }
  } catch {
    // Ignore
  }
  return 'default';
}

export function setSimulatedDateMode(mode: SimulatedDateMode): void {
  try {
    localStorage.setItem(DATE_SIMULATION_KEY, mode);
    dateListeners.forEach((fn) => fn(mode));
  } catch (err) {
    console.warn('Failed to set date simulation mode', err);
  }
}

export function subscribeDateMode(listener: DateStateListener): () => void {
  dateListeners.add(listener);
  return () => {
    dateListeners.delete(listener);
  };
}

export interface DerivedCohortState {
  currentSimulatedDate: Date;
  isEarlyBirdActive: boolean;
  isApplicationsOpen: boolean;
  isCohortStarted: boolean;
  isIntroSessionUpcoming: boolean;
  activeFee: number;
  primaryCtaLabel: string;
  leadStatus: 'partial' | 'complete' | 'waitlist';
  badgeNotice: string;
}

export function getDerivedCohortState(mode?: SimulatedDateMode): DerivedCohortState {
  const currentMode = mode || getSimulatedDateMode();

  let simDate: Date;
  switch (currentMode) {
    case 'early_bird_passed':
      simDate = new Date('2026-12-22T10:00:00+05:30');
      break;
    case 'applications_closed':
      simDate = new Date('2027-01-05T10:00:00+05:30');
      break;
    case 'cohort_started':
      simDate = new Date('2027-01-10T10:00:00+05:30');
      break;
    case 'default':
    default:
      simDate = new Date('2026-11-15T20:41:21+05:30');
      break;
  }

  const earlyBirdEnd = new Date(`${CONFIG.programme.earlyBirdEnds}T23:59:59+05:30`);
  const applicationsClose = new Date(`${CONFIG.programme.applicationsClose}T23:59:59+05:30`);
  const cohortStart = new Date(`${CONFIG.programme.cohortStart}T00:00:00+05:30`);
  const introSessionDate = new Date(CONFIG.programme.introSession.isoDate);

  const isEarlyBirdActive = simDate <= earlyBirdEnd;
  const isApplicationsOpen = simDate <= applicationsClose;
  const isCohortStarted = simDate >= cohortStart;
  const isIntroSessionUpcoming = simDate <= introSessionDate;

  const activeFee = isEarlyBirdActive ? CONFIG.programme.fee.earlyBird : CONFIG.programme.fee.regular;

  let primaryCtaLabel = 'Reserve your seat';
  let leadStatus: 'partial' | 'complete' | 'waitlist' = 'complete';
  let badgeNotice = 'Early-bird discount active · Save ₹1,500';

  if (isCohortStarted) {
    primaryCtaLabel = 'Join next cohort waitlist';
    leadStatus = 'waitlist';
    badgeNotice = 'Cohort 04 in session · Register for Cohort 05';
  } else if (!isApplicationsOpen) {
    primaryCtaLabel = 'Join the waitlist';
    leadStatus = 'waitlist';
    badgeNotice = 'Applications closed for Cohort 04 · Waitlist open';
  } else if (!isEarlyBirdActive) {
    primaryCtaLabel = 'Reserve your seat';
    leadStatus = 'complete';
    badgeNotice = 'Regular admission open · 40 seats per cohort';
  }

  return {
    currentSimulatedDate: simDate,
    isEarlyBirdActive,
    isApplicationsOpen,
    isCohortStarted,
    isIntroSessionUpcoming,
    activeFee,
    primaryCtaLabel,
    leadStatus,
    badgeNotice
  };
}
