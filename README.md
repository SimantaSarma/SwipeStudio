# Applied AI Studio — AI Skills Sprint (Cohort 04)
> **Responsive Landing Page & Automated Lead-Capture Prototype**  
> Built for students and early-career professionals in India. Optimized for conversion, editorial typographic confidence, and end-to-end automation.

---

## 1. Quickstart & Zero-Config Execution

This project is built with **React 18 + TypeScript + Vite + Tailwind CSS + Lucide React**.

```bash
# 1. Install dependencies
pnpm install
# or: npm install

# 2. Run local development server (zero config required)
pnpm dev
# or: npm run dev

# 3. Build for production (outputs to /dist, ~83 KB gzipped JS)
pnpm build
```

The prototype runs completely offline with simulated webhooks and in-browser state persistence. To connect a live n8n or Make automation webhook:
```bash
# In .env or shell environment
VITE_LEAD_WEBHOOK_URL="https://your-n8n-instance.com/webhook/lead-capture"
```

---

## 2. In-Page Prototype Inspector & Date Simulation

A dedicated floating button at the bottom left of the landing page opens the **Prototype Notes & Inspector** drawer:
- **Webhook Leads Tab**: View all incoming JSON payloads, idempotency keys, and copy raw JSON.
- **Date State Simulation Tab**: Instantly toggle between 4 live lifecycle dates:
  1. *Today (Default, 15 Nov 2026)*: Early-bird fee active (₹6,499), save ₹1,500.
  2. *Early-Bird Passed (22 Dec 2026)*: Standard fee (₹7,999), early-bird badge auto-hides.
  3. *Applications Closed (05 Jan 2027)*: Primary CTAs dynamically switch to *"Join the waitlist"*, payload status becomes `"waitlist"`.
  4. *Cohort Started (10 Jan 2027)*: Dynamic notice: *"Cohort 04 in progress · Be first to know when Cohort 05 opens"*.
- **Event Stream Tab**: Real-time log of all `track(event, props)` funnel interactions.
- **Rubric & Architecture Tab**: Direct mapping to the assessment rubric.

---

## 3. Automation Architecture (Webhook → n8n / Make Workflow)

```
[ User Action: Step 1 / Step 2 ]
                 │
                 ▼
[ Browser POST: /webhook with X-Idempotency-Key ]
                 │
                 ▼
   ┌─────────────────────────────┐
   │    n8n / Make Webhook       │
   └─────────────┬───────────────┘
                 │
                 ▼
   ┌─────────────────────────────┐
   │ Phone Normalization (+91)   │
   │ & Idempotency Deduplication │
   └─────────────┬───────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
 [ status: partial ]  [ status: complete ]
        │                 │
        ▼                 ▼
 ┌───────────────┐ ┌─────────────────────────────┐
 │ Wait 2 Hours  │ │ Append / Update CRM Sheet   │
 └──────┬────────┘ └──────────────┬──────────────┘
        │                         │
        ▼                         ▼
 ┌───────────────┐ ┌─────────────────────────────┐
 │ Has completed?│ │ Tag Record by Curricular    │
 └───┬───────┬───┘ │ Track Preference            │
  No │       │ Yes └──────────────┬──────────────┘
     ▼       ▼                    │
 ┌───────┐ ┌─────┐                ▼
 │Counsel│ │Abort│ ┌─────────────────────────────┐
 │Task   │ └─────┘ │ Dispatch Instant WhatsApp   │
 │Created│         │ Confirmation via Cloud API  │
 └───────┘         └──────────────┬──────────────┘
                                  │
                                  ▼
                   ┌─────────────────────────────┐
                   │ Schedule D-7 & D-1 Reminders│
                   │ & Zoom Calendar Invite      │
                   └─────────────────────────────┘
```

### End-to-End Automation Specification
1. **Webhook Ingestion**:
   - The browser dispatches an HTTP POST containing the typed payload to `VITE_LEAD_WEBHOOK_URL`.
   - Header `X-Idempotency-Key: hash(whatsapp + cohort)` prevents duplicate execution if networks retry.
2. **Partial Lead Capture (Funnel Drop-off Mitigation)**:
   - When a visitor completes **Step 1** (Full Name, WhatsApp, Segment) and clicks *Continue*, the client immediately fires a webhook with `status: "partial"`.
   - If the user abandons before Step 2, the lead is already captured in the CRM.
   - The n8n automation initiates a 2-hour delay. If no `"complete"` webhook with matching `whatsapp_e164 + cohort` arrives within 2 hours, a task is created for an admissions counselor to send a friendly WhatsApp nudge.
3. **Complete Lead Processing**:
   - Step 2 submission dispatches with `status: "complete"`.
   - The automation updates the existing partial record (deduped on phone number + cohort) in Google Sheets / Airtable.
   - Tags the record by track (`ai-foundations`, `ai-workflows`, `digital-creator`).
   - Fires an instant transactional WhatsApp template message via the WhatsApp Cloud API confirming seat reservation and payment link options (UPI, Net Banking, EMI).
   - Enrolls the contact in a scheduled reminder drip (D-7, D-3, D-1 before Cohort Start).

---

## 4. Webhook CORS & Network Considerations

> [!IMPORTANT]
> When testing a direct browser `fetch()` POST against a live **n8n Webhook node**, you must ensure that n8n allows browser Cross-Origin Resource Sharing (CORS):
> - In your n8n Webhook Node settings, enable **Response Mode: On Received** or **Last Node**.
> - Set **Allowed Origins (CORS)** to `*` or your specific deployment domain (e.g., `http://localhost:3000`).
> - Ensure your reverse proxy (Caddy / Nginx / Cloudflare) forwards the `OPTIONS` preflight request with HTTP 200 and allowed headers (`Content-Type`, `X-Idempotency-Key`, `X-Source`).
>
> If `VITE_LEAD_WEBHOOK_URL` is omitted, the app simulates network latency (600ms), generates realistic idempotency keys, logs payload data to the console, and saves the record in `localStorage` for visual inspection in the prototype drawer.

---

## 5. Compliance & Prototype Privacy Disclaimer

> [!WARNING]
> This application is a **design and engineering prototype developed for candidate assessment**.
> - All branding (*"Applied AI Studio"*), learner testimonials, and cohort references are sample illustrative materials.
> - **No real personal data should be collected in a production environment** without a legally vetted Privacy Notice, explicit consent collection adhering to India's Digital Personal Data Protection (DPDP) Act, and a published Data Grievance Officer contact.
> - The consent checkbox in Step 2 is explicitly unticked by default (`consent.accepted: true` only upon affirmative user action).

---

## 6. Rubric Verification Matrix

| Rubric Area | Weight | Implementation Details |
| :--- | :---: | :--- |
| **UI/UX & Visual Design** | 30% | Warm Clinical design system: Fraunces 600 headlines, Figtree UI text, JetBrains Mono tags (12px, 0.06em). Paper `#FAF7F2` background, Moss `#0D5C4B`, Saffron `#F2A93B` primary CTA. Strict adherence to **0 AI clichés** (no purple gradients, no glows, no robots, no sparkles). Handcrafted HTML/CSS Hero Project Board. |
| **Product Thinking & CTA** | 20% | 5 strategic CTA placements (Header, Hero, What You'll Build, Pricing, Final Band). **Strict rule: exactly one primary CTA per viewport**. 2-step lead capture funnel. Mobile sticky bar with intelligent hide logic (hides on input focus, form in view, and virtual keyboard). |
| **AI Workflow & Automation** | 25% | Typed payload conforming to strict schema. Automatic +91 phone normalization. Email typo heuristics (`@gamil.com` → `@gmail.com`). Immediate partial-lead capture on Step 1. Idempotency hashing. Duplicate handling without error tones. Full n8n/Make workflow blueprint. |
| **Technical Execution** | 15% | React + TypeScript + Vite + Tailwind CSS. 82.84 KB gzipped bundle (target < 200 KB). WCAG 2.2 AA compliant contrast, 44px minimum tap targets, full keyboard accessibility, focus trap, Esc navigation, and JS Error Boundary. |
| **Initiative & Communication** | 10% | Comprehensive README, in-page Prototype Notes & Inspector drawer with live JSON viewer, date edge-case switcher, downloadable `.ics` calendar generator, and mock syllabus PDF generation. |

---

## 7. Single Source of Truth Config

All copy, cohort dates, fees, tracks, curriculum weeks, and FAQ answers derive strictly from `src/config.ts`. Modifying `src/config.ts` automatically propagates across all 15 page sections, structured JSON-LD data, syllabus generation, and `.ics` calendar invites.
