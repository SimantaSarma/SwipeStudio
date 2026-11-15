// src/calendar.ts
import { CONFIG } from './config';
import { track } from './analytics';

export function generateIntroSessionIcs(): void {
  track('intro_add_to_calendar', { format: 'ics' });

  // Intro session details: 2026-12-05 19:00 to 19:45 IST (UTC: 13:30 to 14:15)
  // Formatted in UTC: YYYYMMDDTHHMMSSZ
  const startTime = '20261205T133000Z';
  const endTime = '20261205T141500Z';
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const title = `${CONFIG.programme.introSession.title} — ${CONFIG.brand.name}`;
  const description = `${CONFIG.programme.introSession.description}\\n\\nFormat: 45 min Live Workshop + Q&A\\nOrganizer: ${CONFIG.brand.name}\\nWebsite: https://appliedaistudio.in`;
  const location = 'Online Live Stream (Link sent via WhatsApp & Email)';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Applied AI Studio//Cohort 04 Intro Session//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:intro-session-20261205@appliedaistudio.in`,
    `DTSTAMP:${now}`,
    `DTSTART:${startTime}`,
    `DTEND:${endTime}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${title} starts in 15 minutes`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'Applied-AI-Studio-Intro-Session.ics';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}

export function downloadMockSyllabusPdf(name: string): void {
  // Generates an informational text syllabus download file
  const syllabusContent = `# APPLIED AI STUDIO — AI SKILLS SPRINT (COHORT 04)
Prepared for: ${name || 'Prospective Learner'}
Format: 6 Weeks · Sat & Sun Live (IST) · 4 Shipped Projects · 40 Seats
Website: https://appliedaistudio.in
Admissions: admissions@appliedaistudio.in

===================================================================
PROGRAMME PROMISE
===================================================================
Learn AI by shipping four real projects and leave with a portfolio.
We teach the work, not the tools: every week ends with something shipped.

===================================================================
THE 4 SHIPPED DELIVERABLES
===================================================================
1. Project 01: Research Assistant that Cites Sources
   - Document chunking, structured extraction, JSON schemas, hallucination audits.
2. Project 02: Idea-to-Carousel Content Engine
   - 8-slide editorial carousel pipeline, slide pacing, Figma/Canva integration.
3. Project 03: Lead-to-WhatsApp Automation Pipeline
   - Webhook POST receiver, phone normalization (+91), deduplication, CRM logging.
4. Project 04: Your Shipped Public Portfolio Site
   - Live hosted URL, case studies, system prompts, certificate verification.

===================================================================
WEEK-BY-WEEK BREAKDOWN
===================================================================
Week 1: Mental Models & Structured Output (3h live + 3h project)
Week 2: Document Synthesis & Source Attribution (3h live + 3.5h project)
Week 3: Visual Assets & The Digital Creator Stack (3h live + 3h project)
Week 4: Automation, APIs & Webhooks (3h live + 3.5h project)
Week 5: Full Pipeline Integration & Lead CRM (3h live + 3h project)
Week 6: Portfolio Packaging & Sunday Demo Day (3h live + 4h project)

===================================================================
NEXT STEPS
===================================================================
To secure your seat among the 40 spots for Cohort 04, complete your reservation
at https://appliedaistudio.in
Payment links are sent after your reservation is logged.
`;

  const blob = new Blob([syllabusContent], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'AI-Skills-Sprint-Syllabus-AppliedAIStudio.txt';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}
