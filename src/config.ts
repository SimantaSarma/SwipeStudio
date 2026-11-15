// src/config.ts
// Single source of truth for the entire programme and landing page.

export interface TrackConfig {
  id: string;
  name: string;
  tag: string;
  forWho: string;
  outcome: string;
  tools: string[];
}

export interface CurriculumWeekConfig {
  week: number;
  title: string;
  subtitle: string;
  outcome: string;
  deliverable: string;
  liveHours: string;
  projectHours: string;
  topics: string[];
}

export interface ProjectConfig {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverable: string;
  skills: string[];
  trackId: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export interface ConfigType {
  brand: {
    name: string;
    workingTitleNotice: string;
    tagline: string;
    email: string;
    whatsappNumber: string; // Placeholder constant
    location: string;
  };
  programme: {
    name: string;
    edition: string;
    headline: string;
    dek: string;
    format: string;
    seats: number;
    cohortStart: string; // YYYY-MM-DD
    cohortEnd: string;
    applicationsClose: string; // YYYY-MM-DD
    earlyBirdEnds: string; // YYYY-MM-DD
    introSession: {
      dateStr: string; // 2026-12-05 19:00 IST
      isoDate: string; // 2026-12-05T19:00:00+05:30
      durationMinutes: number;
      title: string;
      description: string;
    };
    fee: {
      regular: number;
      earlyBird: number;
      currency: string;
      currencySymbol: string;
    };
    cohortCode: "2027-01";
  };
  audience: {
    primary: string[];
    summary: string;
  };
  tracks: TrackConfig[];
  projects: ProjectConfig[];
  curriculum: CurriculumWeekConfig[];
  faqs: FaqItem[];
  instructor: {
    name: string;
    initials: string;
    role: string;
    bio: string;
    mentorship: string;
  };
  webhookUrl: string;
}

export const CONFIG: ConfigType = {
  brand: {
    name: "Applied AI Studio",
    workingTitleNotice: "Applied AI Studio is a working title for Cohort 04.",
    tagline: "Learn AI by building things that work.",
    email: "admissions@appliedaistudio.in",
    whatsappNumber: "+919876543210", // Placeholder constant. Tested with wa.me fallback
    location: "Bengaluru & Online across India (IST)"
  },
  programme: {
    name: "AI Skills Sprint",
    edition: "Cohort 04",
    headline: "Learn AI by building things that work.",
    dek: "Six weeks, four shipped projects, one portfolio you can show. A hands-on programme for students and young professionals.",
    format: "6 weeks, live Sat + Sun sessions (IST), mentor office hours twice a week, ~6 hours/week including projects",
    seats: 40,
    cohortStart: "2027-01-09",
    cohortEnd: "2027-02-14",
    applicationsClose: "2027-01-03",
    earlyBirdEnds: "2026-12-20",
    introSession: {
      dateStr: "Sat 5 Dec 2026, 7:00 PM IST",
      isoDate: "2026-12-05T19:00:00+05:30",
      durationMinutes: 45,
      title: "How to Build Real AI Workflows (Free 45-min Live Workshop)",
      description: "A live, zero-fluff walkthrough of how modern teams actually stitch together LLMs, automations, and frontend prototypes without code bloat."
    },
    fee: {
      regular: 7999,
      earlyBird: 6499,
      currency: "INR",
      currencySymbol: "₹"
    },
    cohortCode: "2027-01"
  },
  audience: {
    primary: [
      "Final-year college students",
      "Career switchers entering digital roles",
      "Early-career professionals (0–3 yrs experience)"
    ],
    summary: "Built for curious builders who want practical competence over theoretical slides."
  },
  tracks: [
    {
      id: "ai-foundations",
      name: "AI Foundations",
      tag: "TRACK 01",
      forWho: "Students and professionals building mental models for LLMs, prompt systems, and structured reasoning.",
      outcome: "Build systematic prompts, evaluate outputs, handle JSON schemas, and eliminate hallucination risks.",
      tools: ["CLAUDE", "CHATGPT", "OPENAI API", "SYSTEM PROMPTS", "JSON MODE"]
    },
    {
      id: "ai-workflows",
      name: "AI Workflows & Automation",
      tag: "TRACK 02",
      forWho: "Operations, marketers, and product folks wanting to automate repetitive work without writing custom backend code.",
      outcome: "Connect triggers, webhooks, LLM transform steps, and delivery channels like WhatsApp & Google Sheets.",
      tools: ["N8N", "MAKE", "WEBHOOKS", "WHATSAPP CLOUD API", "SHEETS"]
    },
    {
      id: "digital-creator",
      name: "Digital Creator Stack",
      tag: "TRACK 03",
      forWho: "Aspiring creators, growth interns, and generalists turning raw insights into visual assets and interactive web pages.",
      outcome: "Generate on-brand carousel copy, wireframe interfaces, and publish live interactive portfolio pages.",
      tools: ["CANVA", "FIGMA", "NO-CODE SITES", "MARKDOWN", "FRAMER/WEBFLOW"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      number: "PROJECT 01",
      title: "Research Assistant that Cites Real Sources",
      tagline: "Structured knowledge extraction with audit trails",
      description: "An automated workflow that accepts academic PDFs or industry reports, extracts structured summaries in strict JSON, and injects verifiable source line-citations to prevent confabulation.",
      deliverable: "Live web tool accepting docs & outputting verified markdown briefs with footnotes.",
      skills: ["Document Chunking", "Structured Extraction", "Hallucination Auditing", "JSON Schema"],
      trackId: "ai-foundations"
    },
    {
      id: "proj-2",
      number: "PROJECT 02",
      title: "Idea-to-Carousel Content Engine",
      tagline: "Multimodal content production pipeline",
      description: "A production pipeline that ingests a 2-line raw note or podcast timestamp and transforms it into an 8-slide editorial LinkedIn/Instagram carousel complete with headline hooks, slide pacing, and Figma-ready copy blocks.",
      deliverable: "Automated engine generating validated slide decks with exportable visual cards.",
      skills: ["Prompt Pacing", "Visual Layout Hierarchy", "Editorial Copywriting", "Template Batching"],
      trackId: "digital-creator"
    },
    {
      id: "proj-3",
      number: "PROJECT 03",
      title: "Lead-to-WhatsApp Automation Pipeline",
      tagline: "Event-driven CRM and instant engagement",
      description: "A production webhook receiver that catches web form leads, deduplicates contacts, calculates lead scoring with an LLM classifier, logs to a CRM database, and fires an instant personalized WhatsApp message within 15 seconds.",
      deliverable: "Working n8n/Make automation blueprint handling real webhook POSTs with error fallbacks.",
      skills: ["Webhook Architecture", "Idempotency", "WhatsApp API Formatting", "Error Fallbacks"],
      trackId: "ai-workflows"
    },
    {
      id: "proj-4",
      number: "PROJECT 04",
      title: "Your Shipped Public Portfolio Site",
      tagline: "Proof of work you can link in job applications",
      description: "A clean, responsive, fast personal portfolio showcasing the three projects above with live demos, architectural diagrams, system prompts, and measurable outcomes. Published to a live URL.",
      deliverable: "Production web portfolio hosted live with custom domain capability and downloadable PDF resume attachment.",
      skills: ["No-Code / Static Web Hosting", "Technical Writing", "Case Study Structure", "Live Deployment"],
      trackId: "ai-foundations"
    }
  ],
  curriculum: [
    {
      week: 1,
      title: "Mental Models & Structured Output",
      subtitle: "Moving beyond basic chat to repeatable systems",
      outcome: "Master prompt engineering, zero-shot vs few-shot framing, system directives, temperature control, and forcing schema-validated JSON outputs.",
      deliverable: "A reusable prompt template library and JSON validator running on sample customer queries.",
      liveHours: "3 hours live",
      projectHours: "3 hours project",
      topics: ["How LLMs predict tokens & latent space", "System prompts vs user prompts", "Few-shot calibration & edge cases", "Enforcing structured JSON mode"]
    },
    {
      week: 2,
      title: "Document Synthesis & Source Attribution",
      subtitle: "Building Project 01: The Verified Research Assistant",
      outcome: "Extract insights from dense documents, transcripts, and financial filings without hallucinating numbers or facts.",
      deliverable: "Project 01 shipped: Live research synthesizer with verified citation links.",
      liveHours: "3 hours live",
      projectHours: "3.5 hours project",
      topics: ["Context windows & chunking strategies", "Extraction vs Summarization", "Footnote and line attribution logic", "Prompt debugging and benchmark tests"]
    },
    {
      week: 3,
      title: "Visual Assets & The Digital Creator Stack",
      subtitle: "Building Project 02: Editorial Carousel Engine",
      outcome: "Transform complex ideas into editorial visual carousels, slide pacing, and Figma/Canva production templates.",
      deliverable: "Project 02 shipped: Idea-to-carousel workflow producing an 8-slide ready-to-post pack.",
      liveHours: "3 hours live",
      projectHours: "3 hours project",
      topics: ["Editorial design principles for mobile readers", "Hook generation & slide retention curve", "Figma auto-layout integration", "Batch exporting and formatting"]
    },
    {
      week: 4,
      title: "Automation, APIs & Webhooks",
      subtitle: "Building Project 03: Event-Driven Automation",
      outcome: "Connect web events to automation canvas (n8n/Make), process JSON payloads, format phone numbers (+91), and handle rate limits.",
      deliverable: "Working webhook receiver that logs test leads and triggers transactional alerts.",
      liveHours: "3 hours live",
      projectHours: "3.5 hours project",
      topics: ["HTTP POST, headers & webhook payloads", "Data transforms & regex cleanup", "WhatsApp Cloud API integration & templates", "Retries, dead-letter logic & idempotency"]
    },
    {
      week: 5,
      title: "Full Pipeline Integration & Lead CRM",
      subtitle: "Connecting lead capture, deduplication & messaging",
      outcome: "Complete Project 03 with end-to-end reliability: deduplicate incoming WhatsApp leads, route by student/professional segment, and send tracking notifications.",
      deliverable: "Project 03 shipped: Complete lead-to-WhatsApp pipeline with automated follow-up sequences.",
      liveHours: "3 hours live",
      projectHours: "3 hours project",
      topics: ["Database / Sheet schema design", "Deduplication algorithms & fuzzy matching", "Conditional logic & segmented follow-ups", "Testing failure scenarios"]
    },
    {
      week: 6,
      title: "Portfolio Packaging & Public Demo Day",
      subtitle: "Building Project 04: Your Live Portfolio",
      outcome: "Write technical case studies for all 4 shipped projects, assemble a live public site, and present to guest industry mentors during Sunday Demo Day.",
      deliverable: "Project 04 shipped: Live portfolio website with working demos + Certificate of Completion.",
      liveHours: "3 hours live",
      projectHours: "4 hours project",
      topics: ["Writing credible case studies without buzzwords", "Deploying responsive web pages", "Live 3-minute project walkthroughs", "Peer review & certificate issuance"]
    }
  ],
  faqs: [
    {
      question: "Are there any coding prerequisites?",
      answer: "None. You do not need to know Python, JavaScript, or any programming language. We teach the logic of inputs, outputs, schemas, and automation connectors. If you can use a spreadsheet and follow clear step-by-step instructions, you will thrive in this programme."
    },
    {
      question: "How much time do I need to commit each week?",
      answer: "Approximately 6 hours per week. That breaks down into 3 hours of live interactive sessions (Saturday & Sunday 11:00 AM – 12:30 PM IST), plus about 3 hours of focused project building and mentor office hours during the week."
    },
    {
      question: "What laptop or hardware specifications do I need?",
      answer: "Any working Mac, Windows, or Linux laptop capable of running modern web browsers (Chrome, Edge, or Brave). All AI models, automation workflows, and development tools run in cloud environments—no expensive GPU or high-end machine required."
    },
    {
      question: "What happens if I miss a live session?",
      answer: "All live sessions are recorded in high-definition and uploaded to your cohort learning portal within 4 hours, accompanied by timestamped chapters, slide notes, prompt files, and code/workflow blueprints."
    },
    {
      question: "Do I get a certificate of completion?",
      answer: "Yes, provided you submit and pass the 4 core deliverables. Our certificate verifies your specific project deliverables with public URLs rather than generic attendance."
    },
    {
      question: "What are the payment options and EMI availability?",
      answer: "You can pay via UPI (Google Pay, PhonePe, Paytm), Net Banking, and all major Indian credit and debit cards. No-cost EMI options (3 and 6 months) are available through our payment partner once your reservation is confirmed."
    },
    {
      question: "What is the refund policy?",
      answer: "We offer a 100% no-questions-asked refund up until the end of Week 1 (after attending the first two live sessions). If you feel the sprint is not a fit for your learning style, email admissions@appliedaistudio.in before the start of Week 2 for an immediate full refund."
    },
    {
      question: "Will this programme guarantee me a job?",
      answer: "No. We believe in total honesty: no 6-week programme can or should guarantee employment, and anyone who promises that is misleading you. What we do guarantee is that you will leave with four real, verifiable projects shipped to public URLs—which sets you miles apart from candidates who only have generic tutorial certificates."
    }
  ],
  instructor: {
    name: "Arjun Nair",
    initials: "AN",
    role: "Founder & Lead Instructor",
    bio: "Product builder and automation specialist with 7+ years designing workflow systems for tech companies and early-stage studios in India. Built internal LLM pipelines and operations engines; passionate about demystifying AI for ambitious college students and early-career switchers.",
    mentorship: "Supported by 2 dedicated teaching assistants and weekly mentor office hours on Tuesday & Thursday evenings."
  },
  webhookUrl: import.meta.env.VITE_LEAD_WEBHOOK_URL || ""
};
