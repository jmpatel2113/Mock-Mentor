# AGENTS.md

## Project Overview

Mock Mentor is a Next.js 14 App Router project for AI-assisted mock technical interviews.

Core product flow:
- User signs in with Clerk.
- User creates a mock interview from the dashboard by entering role, tech stack/job description, and years of experience.
- Gemini generates a fixed number of interview questions plus ideal answers.
- The generated interview is stored in Neon via Drizzle.
- During the interview, the user records spoken answers in the browser.
- Speech is converted to text client-side and sent to Gemini for rating and feedback.
- Feedback and ideal answers are stored and later shown on the feedback page.

The README and `.codex/instructions.md` both describe the same high-level direction:
- current focus is the AI mock interview experience
- subscriptions are planned/in progress
- testing is not implemented yet
- do not inspect `.env.local`

## Stack

- Next.js 14
- React 18
- Tailwind CSS
- shadcn/ui primitives in `components/ui`
- Clerk for auth
- Gemini via `@google/generative-ai`
- Drizzle ORM
- Neon serverless Postgres
- Stripe dependencies and webhook scaffolding
- Browser speech recognition via `react-hook-speech-to-text`
- Browser webcam via `react-webcam`

## Repo Shape

Top-level areas:
- `app/`: App Router pages, route groups, route data
- `components/ui/`: reusable UI primitives
- `utils/`: DB schema, DB client, Gemini session
- `public/`: static assets
- `.codex/instructions.md`: project-specific agent constraints

Important routes:
- `/` in `app/page.js`: landing page with shared nav
- `/dashboard` in `app/dashboard/page.jsx`: main logged-in workspace
- `/dashboard/interview/[interviewId]`: interview pre-start page
- `/dashboard/interview/[interviewId]/start`: live interview flow
- `/dashboard/interview/[interviewId]/feedback`: saved answer review
- `/faq`
- `/howItWorks`
- `/upgrade`
- `/(auth)/sign-in/...`
- `/(auth)/sign-up/...`
- `/(api)/stripe/route.js`: Stripe webhook-style route file

## Architecture Notes

### Layout and auth

- Root layout is `app/layout.js`.
- Clerk is mounted globally with `ClerkProvider`.
- Global toast UI is mounted with `Toaster`.
- `middleware.js` protects `/dashboard(.*)` and `/forum(.*)`.
- There is no scanned `/forum` route, so that matcher looks like leftover or future work.

### Dashboard flow

Main files:
- `app/dashboard/page.jsx`
- `app/dashboard/_components/addNewInterview.jsx`
- `app/dashboard/_components/interviewList.jsx`
- `app/dashboard/_components/interviewItemCard.jsx`

Behavior:
- Dashboard lists prior mock interviews for the signed-in user.
- New interview generation currently happens directly in the client component.
- Interview count is limited in UI to 2 free interviews before sending the user to upgrade messaging.
- Gemini prompt uses `NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT`.

### Interview flow

Main files:
- `app/dashboard/interview/[interviewId]/page.jsx`
- `app/dashboard/interview/[interviewId]/start/page.jsx`
- `app/dashboard/interview/[interviewId]/start/_components/questionsSection.jsx`
- `app/dashboard/interview/[interviewId]/feedback/page.jsx`

Behavior:
- Interview detail page loads one interview record by `mockId`.
- Start page parses `jsonMockResponse` into a question list.
- Recording uses `react-hook-speech-to-text`.
- Webcam UI is shown with `react-webcam`.
- After recording stops and enough transcript exists, Gemini rates the answer and returns JSON feedback.
- Each answer is inserted into `userAnswers`.
- Feedback page loads all `userAnswers` by `mockIdReference` and renders question, rating, transcript, ideal answer, and feedback.

### Data layer

Main files:
- `utils/schema.js`
- `utils/db.js`

Tables:
- `mockInterviews`
  - stores generated question/answer JSON as raw text
  - stores job position, job description, experience, creator email, created date, and `mockId`
- `userAnswers`
  - stores question, ideal answer, user transcript, feedback, rating, user email, and created date
- `subscriptions`
  - stores email, start date, end date, and subscription type

DB access pattern:
- DB is imported directly into client components in several places.
- `utils/db.js` builds the Neon/Drizzle client from `NEXT_PUBLIC_DRIZZLE_DB_URL`.

### AI integration

Main file:
- `utils/geminiAIModal.jsx`

Behavior:
- Uses Gemini `gemini-1.5-flash`.
- Exports a shared `chatSession`.
- Uses `NEXT_PUBLIC_GEMINI_API_KEY`.
- Both interview generation and answer feedback currently happen from the client.

### Subscription work

Main files:
- `app/upgrade/page.jsx`
- `app/_data/pricingPlan.jsx`
- `app/(api)/stripe/route.js`

Behavior:
- Upgrade page shows progress against the 2-interview free limit.
- Pricing data is hard-coded to Stripe test links with env-backed price IDs.
- Stripe webhook handling exists, but the implementation needs review before relying on it in production.

## Current Conventions

- JavaScript and JSX are used throughout even though `tsconfig.json` exists.
- UI is mostly client-rendered.
- Shared nav is duplicated between `app/page.js` and `app/dashboard/_components/header.jsx`.
- Styling is Tailwind-based with tokens in `app/globals.css`.
- Date formatting uses `moment`.
- Logging is done with `console.log` in many components.

## Known Risks And Gaps

These are important for anyone editing the project:

- Secrets exposure risk: DB and Gemini access are wired through `NEXT_PUBLIC_*` env vars and are used in client components.
- Client-side DB writes: interview creation, interview reads, answer writes, and subscription progress reads are happening from the browser.
- Shared chat session: `utils/geminiAIModal.jsx` exports one long-lived chat session, which may not be ideal across unrelated prompts.
- Error handling is thin: JSON parsing and AI responses assume well-formed output in multiple places.
- Typo/prop issues exist: some buttons use `disable` instead of `disabled`.
- Duplicate transcript accumulation may occur because `results.map(...)` appends transcript text repeatedly on updates.
- `recordAnswerSection.jsx` appears unused and inconsistent with the active start page implementation.
- The Stripe route file looks like Pages Router style code inside App Router structure and likely needs refactoring.
- `calculateEndDate()` in the Stripe route is broken: it returns `endDate.setFullYear.toISOString()` instead of converting the date instance.
- Auth middleware references `/forum`, but no forum route was found.
- No automated tests were found.
- Git status could not be checked in this environment because the repo is not marked as a safe directory for the sandbox user.

## High-Value Files

- `README.md`: product overview and roadmap
- `.codex/instructions.md`: local agent constraints
- `package.json`: scripts and dependencies
- `app/layout.js`: root providers
- `middleware.js`: auth enforcement
- `app/dashboard/_components/addNewInterview.jsx`: interview creation logic
- `app/dashboard/interview/[interviewId]/start/page.jsx`: interview answer capture and feedback generation
- `utils/schema.js`: source of truth for DB tables
- `utils/db.js`: DB client setup
- `utils/geminiAIModal.jsx`: Gemini configuration
- `app/(api)/stripe/route.js`: subscription webhook work-in-progress

## Suggested Working Rules For Future Agents

- Start by checking whether a change belongs in a server route/action instead of another client component.
- Do not read or print `.env.local`.
- Treat `NEXT_PUBLIC_*` usage for DB/API credentials as a security smell to fix, not a pattern to extend.
- Be careful with dynamic App Router paths on Windows shells; use literal paths when reading bracketed folders.
- If touching billing, verify the Stripe route against current Next.js App Router conventions before building on it.
- If touching interview recording, test transcript lifecycle carefully because result accumulation is fragile.
- Prefer consolidating duplicated nav/header logic instead of editing both copies independently.

## Placeholder For User Direction

Open questions where project direction would help:

- Preferred near-term priority: UI refactor, test coverage, security/server refactor, subscriptions, or deployment?
- Should Gemini and DB access be moved server-side now, or should features continue shipping first and hardening happen later?
- Is the intended free-tier rule still exactly 2 interviews, or should this become subscription-aware from the DB?
- Should `recordAnswerSection.jsx` be deleted, revived, or ignored as legacy code?
- Should the app continue using Gemini, or is there a planned provider change later?

Fill in here if you want this documented more specifically:
- Product priorities:
- Non-negotiable architecture constraints:
- Deployment target:
- Billing/subscription plan expectations:
- Testing expectations:
