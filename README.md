H-2A Agricultural Workforce Navigator
A personal HR/legal knowledge system for understanding and administering an
agricultural workforce that may include H-2A workers, corresponding
employment, and domestic, migrant, or seasonal agricultural employees.
This is an educational and operational reference tool. It does not provide
legal advice and does not replace review of current statutes, regulations,
agency guidance, company policy, or consultation with qualified legal /
compliance professionals. Do not enter employee medical information, Social
Security numbers, immigration document numbers, passport information, or
other sensitive personal data — none is stored by this app, and none should
ever be typed into it.
Personal notes, bookmarks, and the research queue are saved in your
browser's local storage only. They live on your device, not on a server —
clearing your browser data will clear them too, and they won't follow you
between devices or browsers.
Run it locally
```bash
npm install
npm run dev
```
Then open the local URL Vite prints (usually `http://localhost:5173`).
Deploy to Vercel
Option A — from GitHub (recommended)
Push this folder to a new GitHub repository.
Go to vercel.com/new and import that repository.
Vercel will detect the Vite framework automatically (`vercel.json` is
already included). Click Deploy.
You'll get a shareable `https://<project>.vercel.app` link.
Option B — from the CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```
Project structure
```
src/App.jsx      All views, data, and UI (single-file by design — see below)
src/main.jsx      React entry point
index.html        Page shell
vercel.json        Deployment config
```
Content architecture
Content is intentionally separated from UI inside `App.jsx`, in a small
number of data objects:
`LAWS` — every legal framework, each with a standardized card: purpose,
authority, statutory/regulatory source, agency, worker types, topics,
official sources, key HR questions, and a three-level disclosure
(quick view → framework → source detail).
`AGENCIES` — federal and Minnesota agencies with a verified role.
`WORKER_TYPES` — H-2A worker, corresponding employment, domestic /
migrant / seasonal agricultural worker, and regular domestic employee,
each with explicit "do not confuse with" guidance.
`TOPICS` — practical HR issues (housing, wages, transportation, etc.),
each pointing to every potentially applicable law rather than assuming a
single answer.
`LIFECYCLE` — the employment relationship from planning through record
retention.
`RESOURCES` — forms, notices, and posters, linking to official sources
rather than reproducing them.
This is a seed set, not a complete legal database — it was built to
prove the architecture with a small number of verified examples, by design.
Entries flagged with an orange "Needs Verification" badge (a few Minnesota
citations, FMCSA vehicle thresholds, FMLA seasonal-worker eligibility) still
need pinpoint citation work before they should be relied on. Add new laws,
topics, or agencies by extending the data objects at the top of `App.jsx` —
the views render from that data automatically.
Notes system
Every law, worker type, topic, agency, and lifecycle stage has a personal
notes panel with five distinct labels (My Experience, Practical
Observation, Question to Verify, Lesson Learned, Process at My Company),
kept visually and structurally separate from the legal content itself.
