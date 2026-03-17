# 🧠 MindNexus — Virtual Counselling Platform

> **Nigeria's leading virtual counselling platform. Professional mental health support, from anywhere you are.**

![MindNexus](https://img.shields.io/badge/MindNexus-Virtual%20Counselling-185FA5?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)

---

## 📖 About MindNexus

MindNexus is a full-stack virtual counselling platform built for counselling psychologists and their clients. It enables professional therapy sessions to be conducted entirely online — through video, voice, or chat — with outcomes that match physical sessions.

The platform serves as a complete **counselling laboratory** covering 12 specialisations:

- Individual counselling
- Grief & bereavement
- Couples counselling
- Premarital counselling
- Career & vocational
- Crisis counselling
- Addiction & recovery
- Rehabilitation
- Family & group therapy
- School & educational counselling
- Spiritual & pastoral counselling
- Children & teens

---

## ✨ Features

### For Clients
- 📅 **Session booking** — book video, voice, or chat sessions with any therapist
- 🤖 **Nexus AI companion** — 24/7 AI mental health support powered by Claude
- 😊 **Mood journal** — daily mood tracking with weekly visualisation
- 🎯 **Goal tracking** — therapy goals with progress bars
- ✅ **Homework assignments** — tick off tasks assigned by your therapist
- 💬 **Messaging** — direct chat with your therapist between sessions
- 📚 **Psychoeducation library** — articles, videos, and exercises
- 🚨 **Crisis support button** — instant alert to your therapist in emergencies
- 🔔 **Notifications** — session reminders, homework alerts, messages

### For Therapists
- 📊 **Therapist dashboard** — overview of all clients, sessions, and alerts
- 👥 **Client management** — full client records with progress tracking
- 🎥 **Video session room** — built-in video sessions using Jitsi Meet (free)
- 📝 **Session notes** — write and save clinical notes during sessions
- 📋 **Homework assignment** — assign tasks to clients directly
- 💬 **Messaging** — communicate with clients between sessions
- 🚨 **Crisis alerts** — real-time notifications when clients are in distress
- 📈 **Progress tracking** — mood trends and therapy progress per client

### For Admins
- 🏥 **Platform overview** — all stats, revenue, sessions, and alerts
- 👨‍⚕️ **Therapist management** — add, edit, and manage all therapists
- 👤 **Client management** — view and manage all registered clients
- 🔀 **Therapist matching** — match new clients to the right therapist
- 💰 **Revenue dashboard** — subscription plans and financial overview
- 🚨 **Crisis log** — full log of all crisis events and resolutions
- 📋 **Content library** — manage psychoeducation resources
- 🔍 **Activity logs** — complete audit trail of platform activity

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS |
| Backend | Next.js API Routes (serverless) |
| Database | PostgreSQL (hosted on Railway) |
| ORM | Prisma |
| Authentication | NextAuth.js (email + password) |
| AI Companion | Anthropic Claude API |
| Video Sessions | Jitsi Meet (free, open-source) |
| Deployment | Vercel |
| Language | TypeScript |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- A PostgreSQL database (Railway recommended — free)
- An Anthropic API key (for the AI companion)

### 1. Clone the repository
```bash
git clone https://github.com/PJ-wind/Mindnexus.git
cd Mindnexus
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Fill in your `.env` file:
```env
DATABASE_URL="your-postgresql-url-from-railway"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY="your-anthropic-api-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Set up the database
```bash
npm run db:push
npm run db:seed
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👤 Demo Accounts

After running `npm run db:seed`, these accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@mindnexus.ng | admin123 |
| Therapist | dr.adeyemi@mindnexus.ng | therapist123 |
| Client | amara@example.com | client123 |

---

## 📁 Project Structure

```
mindnexus/
├── prisma/
│   ├── schema.prisma      # Database schema (16 tables)
│   └── seed.js            # Demo data
├── src/
│   ├── app/
│   │   ├── admin/         # Admin panel pages
│   │   ├── api/           # API routes (auth, AI, bookings, mood...)
│   │   ├── auth/          # Login & register pages
│   │   ├── client/        # Client portal pages
│   │   ├── therapist/     # Therapist portal pages
│   │   └── page.tsx       # Public landing homepage
│   ├── components/
│   │   ├── layout/        # Sidebar, Providers
│   │   └── ui/            # Reusable UI components
│   └── lib/
│       ├── auth.ts        # NextAuth configuration
│       ├── prisma.ts      # Database client
│       └── utils.ts       # Helper functions
└── DEPLOY.md              # Complete deployment guide
```

---

## 🌍 Deployment

This project is deployed on **Vercel** with a **Railway** PostgreSQL database.

See [DEPLOY.md](./DEPLOY.md) for the complete step-by-step deployment guide written in plain English.

---

## 💰 Cost

This entire platform runs for **free**:

| Service | Cost |
|---------|------|
| GitHub | Free |
| Vercel (hosting) | Free |
| Railway (database) | Free ($5/mo credit included) |
| Jitsi Meet (video) | Free forever |
| NextAuth (auth) | Free forever |
| Anthropic API (AI) | ~$1-3/month for small usage |

---

## 🏥 Counselling Specialisations

MindNexus supports 12 counselling areas, making it suitable for solo practitioners, group clinics, and large counselling centres.

---

## 📄 Licence

This project was built for MindNexus — Nigeria's leading virtual counselling platform.

---

## 👨‍💻 Built With

Built using Next.js, PostgreSQL, Prisma, NextAuth, Anthropic Claude API, and Jitsi Meet.

Designed and developed to bring professional mental health support to everyone in Nigeria and beyond — regardless of location or financial limitation.

---

*MindNexus — Healing, from anywhere you are.* 🇳🇬
