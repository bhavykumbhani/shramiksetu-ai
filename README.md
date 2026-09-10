# 🛡️ ShramikSetu AI (श्रमिकसेतु)

> **Smart Migrant Labor Welfare, Skill Mapping & Multi-Agent Governance Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)

---

## 📌 Project Overview

**ShramikSetu AI** is a state-of-the-art GovTech platform engineered to empower unorganized, blue-collar, and migrant workers across Gujarat. By combining deterministic rule engines, **Google Gemini AI**, and **In-Browser Speech Recognition**, ShramikSetu AI bridges the literacy and language divide between workers, labor contractors, and government administrators.

---

## 🤖 Specialized AI Multi-Agent Ecosystem

1. **🗣️ Bhasha Mitra Voice Translator**: Real-time bi-directional voice translation in Hindi, Gujarati & regional dialects with audio Text-to-Speech.
2. **🏛️ Welfare Scheme Engine**: Deterministic matching for Gujarat Govt schemes (*BOCW Welfare, Manav Kalyan, Shramik Basera Yojana*).
3. **⚖️ HakKosh Wage Fairness Checker**: Audits daily wages against official minimum wage standards to detect underpayment.
4. **🚨 Safety & Grievance Risk Classifier**: Parses grievance reports, assigns risk severity (LOW/MEDIUM/HIGH), and extracts employer & district data.
5. **📜 Legal Notice Generator**: Generates formal legal notices citing Indian Labor Laws for unpaid wages or safety violations.
6. **🎓 Kaushalya Path Upskilling**: Maps skills to Kaushalya University & ITI courses to help workers advance to higher-paying job tiers.
7. **⭐ Contractor TrustScore**: Evaluates fair employer ratings (0-100) based on verified work history and safety records.
8. **📝 Digital Work Agreement**: Converts informal verbal arrangements into tamper-proof digital work contracts.
9. **🆘 Suraksha SOS Guard**: Triggers real-time emergency alert dispatch for onsite labor incidents.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
* **Language**: TypeScript
* **Database**: SQLite (Local Dev) / PostgreSQL (Production)
* **ORM**: [Prisma ORM](https://www.prisma.io/)
* **Styling**: Tailwind CSS v4 & Framer Motion
* **Authentication**: NextAuth.js (JWT strategy)
* **AI Integration**: `@google/generative-ai` (Gemini API with offline fallback)

---

## 🚀 Quick Setup Guide (Local Development)

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/shramiksetu-ai.git
cd shramiksetu-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to create `.env`:
```bash
cp .env.example .env
```

### 4. Database Setup & Seeding
```bash
# Push Prisma schema to local SQLite database
npx prisma db push

# Seed demo schemes and initial data
npm run seed
```

### 5. Run Local Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## ☁️ How to Deploy Freshly on Vercel

Follow these steps to deploy a fresh instance on **Vercel** with **Supabase PostgreSQL**:

### Step 1: Create a PostgreSQL Database (Supabase / Neon / Railway)
1. Create a free account on [Supabase](https://supabase.com/).
2. Create a new project and copy your **Transaction Connection String** (`postgresql://...`).

### Step 2: Push Repository to GitHub
```bash
git init
git add .
git commit -m "feat: initial release of ShramikSetu AI platform"
git remote add origin https://github.com/YOUR_USERNAME/shramiksetu-ai.git
git branch -M main
git push -u origin main
```

### Step 3: Configure Database Provider for PostgreSQL
If deploying to PostgreSQL, update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 4: Import into Vercel & Set Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/new) and import your GitHub repository.
2. Under **Environment Variables**, add:
   * `DATABASE_URL`: Your PostgreSQL / Supabase connection string.
   * `NEXTAUTH_SECRET`: A random secret string.
   * `NEXTAUTH_URL`: `https://YOUR-VERCEL-APP-NAME.vercel.app`
   * `GOOGLE_API_KEY`: *(Optional)* Your Google Gemini API Key.
3. Deploy! Vercel will automatically generate Prisma Client and build the application.

---

## 🔐 Portal Access Roles (Demo Credentials)

| Role | Portal URL | Login Email |
| :--- | :--- | :--- |
| **Worker Portal** | `/login` (Worker tab) | Any email or demo worker |
| **Contractor Portal** | `/contractor/dashboard` | `contractor@example.com` |
| **State Admin Command Center** | `/admin/dashboard` | `admin@gujarat.gov.in` |

---

## 📜 License & Governance
*© 2026 ShramikSetu AI Initiative. Engineered for Social Governance & Labor Welfare.*
