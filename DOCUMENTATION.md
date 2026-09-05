# 🛡️ ShramikSetu AI — Comprehensive Technical Documentation
> **Smart Migrant Labor Welfare, Skill Mapping & Multi-Agent Governance Platform**
> *Official Production System Architecture & Technical Operating Manual*

---

## 📌 Executive Summary

**ShramikSetu AI** is an enterprise-grade GovTech platform engineered to empower India's 450+ million informal and migrant workforce. By leveraging **Deterministic Rule Engines**, **Google Gemini AI (`gemini-3.6-flash`)**, and **In-Browser Web Speech Capabilities**, ShramikSetu AI bridges the critical gaps between informal workers, labor contractors, and state labor departments.

The platform provides a 3-way ecosystem (Worker Portal, Contractor Portal, Admin Command Center) backed by **12 specialized AI Agents** that handle everything from voice onboarding and wage exploitation auditing to legal notice generation and emergency SOS dispatch.

---

## 🏛️ System Architecture

```
                               ┌────────────────────────────────────────┐
                               │           SHRAMIKSETU AI HUB           │
                               └──────────────────┬─────────────────────┘
                                                  │
         ┌────────────────────────────────────────┼────────────────────────────────────────┐
         │                                        │                                        │
┌────────▼────────┐                      ┌────────▼────────┐                      ┌────────▼────────┐
│  WORKER PORTAL  │                      │CONTRACTOR PORTAL│                      │  ADMIN COMMAND  │
│(Voice, Welfare, │                      │(Search, Broadcast│                      │(Analytics, SOS, │
│ Wage & Contracts│                      │& TrustScore UI) │                      │ Worker Message) │
└────────┬────────┘                      └────────┬────────┘                      └────────┬────────┘
         │                                        │                                        │
         └────────────────────────────────────────┼────────────────────────────────────────┘
                                                  │
                               ┌──────────────────▼─────────────────────┐
                               │    12-AGENT AI ORCHESTRATOR MATRIX     │
                               └──────────────────┬─────────────────────┘
                                                  │
                   ┌──────────────────────────────┼──────────────────────────────┐
                   │                              │                              │
         ┌─────────▼────────┐           ┌─────────▼────────┐           ┌─────────▼────────┐
         │ Gemini 3.6 Flash │           │  Prisma SQLite   │           │ Web Speech & TTS │
         │  (AI Provider)   │           │ (Local DB Engine)│           │ (Browser Native) │
         └──────────────────┘           └──────────────────┘           └──────────────────┘
```

---

## 🤖 The 12-Agent AI Orchestrator Matrix

ShramikSetu AI is built on a modular, multi-agent architecture where each agent specializes in a distinct welfare, legal, economic, or safety domain:

| Agent # | Agent Name | Technical Module | Key Capability & Business Value |
| :--- | :--- | :--- | :--- |
| **Agent 1** | **Conversational Voice Onboarding** | `useSpeechToText` & Onboarding API | Hindi & Gujarati Web Speech recognition. Extracts worker skills, district, and experience without forms. |
| **Agent 2** | **Welfare Scheme Eligibility Engine** | `welfareAgent.ts` & `/api/worker/welfare` | Deterministic matching against Gujarat Govt schemes (BOCW, Manav Kalyan Yojana, Shramik Basera) with zero hallucinations. |
| **Agent 3** | **Wage Fairness & Exploitation Checker** | `wageAgent.ts` & `/api/worker/wage-check` | Audits reported daily wages against statutory minimum wage laws and computes wage discrepancy metrics. |
| **Agent 4** | **e-Nyay Grievance Risk Scoring** | `grievanceAgent.ts` & `/api/worker/grievance` | Classifies grievances into severity tiers (LOW/MEDIUM/HIGH), calculates risk points, and extracts employer aliases. |
| **Agent 5** | **Admin Command Center Analytics** | `/api/admin/analytics` & Admin Dashboard | Multi-graph analytics (District Risk Map, Wage Trends, Grievance Pie Charts) & direct worker messaging. |
| **Agent 6** | **Contractor Search & Job Broadcast** | `/api/contractor/job-post` & Search API | Enables contractors to broadcast jobs to matching workers in their district with privacy-masked data. |
| **Agent 7** | **e-Nyay AI Legal Notice Generator** | `legalNoticeAgent.ts` & Printable Modal | Generates official legal dispute slips citing specific Indian Labor Acts (Minimum Wages Act 1948, BOCW Act 1996). |
| **Agent 8** | **Kaushalya Path (Wage Doubler)** | `careerAgent.ts` & `/worker/career` | Maps existing skills to Govt ITI & Kaushalya Skill University training programs to double worker daily wages. |
| **Agent 9** | **Contractor TrustScore Rating** | `trustScoreAgent.ts` | Computes a dynamic 0-100 TrustScore (Gold/Silver/Bronze/Risk) on job broadcasts based on wage fairness & history. |
| **Agent 10** | **Suraksha Guard SOS Dispatch** | `sosAgent.ts` & Admin SOS Banner | Real-time detection of high-risk danger keywords (abuse, forced labor) triggering instant red SOS banners on Admin Portal. |
| **Agent 13** | **Bhasha Mitra Voice Translator** | `bhashaAgent.ts` & `BhashaMitraWidget` | Bi-directional real-time speech translation (Hindi ↔ Gujarati ↔ English) with native Text-to-Speech audio playback. |
| **Agent 14** | **HakKosh Digital Wage Contract** | `contractAgreementAgent.ts` & Modal | Generates tamper-proof, government-stamped Digital Employment Agreements locking daily wages & shift hours. |

---

## 👥 Role-Based System Workflows

### 👷 1. Worker Workflow
1. **Voice Onboarding:** Worker logs in and speaks their work details in Hindi or Gujarati.
2. **Digital Skill Passport:** System generates a printable, QR-ready Skill Passport.
3. **Welfare Matching:** Worker checks eligibility for state welfare schemes with detailed rationale.
4. **Job Offers & Application:** Worker receives targeted job notifications with **Agent 9 TrustScores** and **Agent 14 Wage Lock Contracts**, applying with 1 click.
5. **Grievance & Legal Rights:** Worker reports disputes using voice, generates **Agent 7 Official Legal Notices**, or triggers **Agent 10 Emergency SOS Alerts**.

### 🏢 2. Labor Contractor Workflow
1. **Privacy-Preserving Search:** Search workers by district and skill without exposing full PII until offer acceptance.
2. **Automated Job Broadcast:** Post hiring requirements with daily wage, district, and benefits. The backend automatically fans out alerts to eligible workers.
3. **Applicant & History Management:** View worker applications, expand candidate profiles, and contact them directly via email.
4. **TrustScore Recognition:** Transparently build a high AI TrustScore by offering fair wages and safe working conditions.

### 🏛️ 3. Admin Command Center Workflow
1. **District Risk Mapping:** Monitor worker density and high-risk grievance zones across Gujarat districts.
2. **Market Wage Surveillance:** Track average market daily wages by industry to detect underpayment trends.
3. **Grievance Resolution Desk:** Review open labor complaints, update status to `RESOLVED`, and dispatch auto-notifications to workers.
4. **Direct Messaging:** Send official, direct messages to any registered worker's dashboard notification bell.
5. **Job Takedown Oversight:** Flag and remove abusive or sub-minimum-wage contractor job broadcasts.

---

## 💻 Tech Stack & Infrastructure

- **Framework:** Next.js 16 (App Router with Turbopack) & React 19
- **Styling:** Tailwind CSS v4 & Lucide React Icons
- **Database & ORM:** SQLite with Prisma ORM
- **AI Models & Providers:** 
  - Primary: Google Gemini API (`gemini-3.6-flash`)
  - Fallback: Intelligent Mock Deterministic AI Provider for offline resilience
- **Speech APIs:** Browser Native Web Speech Recognition (`SpeechRecognition`) & Text-to-Speech (`SpeechSynthesis`)
- **Data Visualization:** Recharts (Bar Charts, Donut Pie Charts, Dual-Axis District Maps)
- **Authentication:** NextAuth.js with custom manual cookie sanitization for seamless role logouts

---

## 🔒 Security, Privacy & Responsible AI

1. **Deterministic Rule Safety:** AI models do NOT query raw SQL databases directly. AI intents map strictly to parameterized endpoints to prevent LLM SQL injection.
2. **K-Anonymity Density Protection:** Admin district heatmaps aggregate statistics to prevent individual worker tracking.
3. **Privacy-Masked Contractor Queries:** Contractors see worker skills and experience but cannot access full phone numbers/addresses prior to formal job offer acceptance.
4. **Role-Based Access Control (RBAC):** Strict NextAuth session checks on `/api/admin/*`, `/api/contractor/*`, and `/api/worker/*`.

---

## 🛠️ Local Development & Setup

```bash
# 1. Install dependencies
npm install

# 2. Push database schema
npx prisma db push

# 3. Start development server
npm run dev

# 4. Access Platform
# Open http://localhost:3000 in your browser
```

---

*© 2026 ShramikSetu AI Initiative. Engineered for Indian Social Governance & Labor Empowerment.*
