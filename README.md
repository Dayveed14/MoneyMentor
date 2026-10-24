# MoneyMentor — Frontend (Vite + React)

## Run it
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # serve the build locally
npm run lint
```

### Working on the UI without the backend
Create `.env.local` with `VITE_USE_MOCKS=true` and the articles pages use the
sample articles in `src/lib/mockArticles.js` instead of calling the PHP API.

The API URL lives in one place: `src/config/api.js`. Copy `.env.example` to
`.env.local` and set `VITE_API_URL` (e.g. `http://localhost:8080` when running the
backend with docker compose). On Vercel set the same variable in project settings.

## Structure
```
src/
  main.jsx, App.jsx, index.css     entry, routes, global styles
  config/api.js                    API base URL + apiFetch() helper
  utils/auth.js                    login session helpers (remember-me aware)
  lib/articles.js                  useArticles() hook, fetchArticle(), reading time
  hooks/useActiveSection.js        scroll-spy for the nav on the home page
  components/                      reusable sections, each with its own .css
  pages/                           one file per route, each with its own .css
  assets/images/                   optimised .webp images
```

## Deploying on Vercel
Framework preset: **Vite**, output directory: **dist**. Set `VITE_API_URL` to the
Render API URL. `vercel.json` only adds the SPA fallback so refreshing `/modules`
etc. doesn't 404.

## Learner area (logged-in users)
| Route | What |
|---|---|
| `/account/check` | Knowledge check (12 questions across six topics + goals). Builds a personal learning path; wrong answers become key lessons. Retaking it shows progress since the first check |
| `/account` | Dashboard: progress ring, next lesson, module progress, budget snapshot, saved articles, badges |
| `/account/modules` | Every lesson and quiz, with what's done |
| `/learn/:moduleId?lesson=…` / `?step=quiz` | Lesson reader and module quiz (pass mark 80%) |
| `/account/budget` | Budget planner compared with 50/30/20 |
| `/account/spending` | Spending tracker: log expenses, plan vs actual per line and per need/want/saving, 6-month trend |
| `/account/questions` | Ask an expert: ask the team a question, answers arrive here and by email |
| `/account/saved` | Saved articles |
| `/account/settings` | Change name / password, log out |

There are six modules: Saving strategy, Budgeting, Financial literacy 101 (`src/data/modules.js`)
and Debt & credit, Investing basics, Financial planning (`src/data/modulesMore.js`, with public pages at
`/module/debt`, `/module/investing`, `/module/planning`). Course content lives in those two files. Lesson ids there must match
`src/modules.php` in the API, which only saves progress for known ids. Badges are
worked out from progress in `src/lib/achievements.js`.

Login sends admins to `/dashboard`, users who haven't taken the knowledge check to
`/account/check`, and everyone else to `/account` (or back to the page that asked
them to log in). Questions and path rules live in `src/data/assessment.js`.

Once a learner finishes every key lesson from their last check, the dashboard asks them to retake it,
and both the result page and the dashboard show the before/after scores.

## Scam awareness
- Safety bar on every page with "Check a message", "Got scammed?" and an **English/Pidgin** switch
- "Is this a scam?" message checker (`src/lib/scamCheck.js`, runs in the browser), golden rules, latest alerts and "Ask us first" on the home page
- `/alerts`: every alert; a shared link like `/alerts#alert-3` opens that alert
- `/verify`: check a message, a loan app (FCCPC list) or an investment (SEC Nigeria) with yes/no red-flag checklists
- `/help-now`: what to do in the first hour, bank emergency codes and where to report (managed in Admin → Help contacts)
- `/report`: anyone can report a scam; admins can turn reports into public alerts
- `/questions`: public FAQ of answered "Ask an expert" questions
- WhatsApp share buttons on alerts, the golden rules, articles and the help pages (`src/components/ShareButtons.jsx`)

**Pidgin:** the safety bar, golden rules, message checker, alert labels and the help page switch to
Nigerian Pidgin. Text lives in `src/lib/i18n.js` (and `ADVICE_PCM` / `title_pcm` in `scamCheck.js`).
Admins can add a Pidgin summary to each alert. Have a native speaker review the wording before big campaigns.

## Account pages
`/forgot-password`, `/reset-password?token=…` (from the email) and `/unsubscribe?e=…&t=…` (from newsletter emails).

## Admin dashboard
`/dashboard` tabs: Overview, Users (add, change role, reset password, delete, view
progress), Articles (add, edit at `/editarticle/:id`, publish, delete), Scam alerts (Pidgin summary,
email to subscribers), Scam reports (turn into alerts), Ask an expert (answer, add to FAQ), Help contacts
(bank codes and agencies), Learning & quizzes (analytics, knowledge gain, research CSV, lesson videos),
Messages (reply by email), Subscribers (send a newsletter). Most tabs can export CSV. Log-in state lives in `src/context/AuthContext.jsx`.

## Navigation
Home, Modules, Articles and About scroll to their section on the home page
(`/#modules`, `/#articles`, `/#about`) and highlight as you scroll. From any
other page the same links bring you back to that section. The Modules dropdown
goes to each full module page; "See all articles" goes to `/articles`. The **Stay safe** menu holds
Scam alerts, Check before you trust, Got scammed?, Report a scam and Ask an expert.

## Link previews
`index.html` has default share tags and `public/og-image.png` (1200×630). Share buttons use the API's
`share.php` page so WhatsApp shows the right title and image for each article or alert.

## Backend
The PHP API lives in its own project (`moneymentor_api`). Logged-in requests send
`Authorization: Bearer <token>` automatically (see `apiFetch` in `src/config/api.js`).
If the token expires or is rejected, the user is logged out locally.
