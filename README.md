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
| `/account/check` | Knowledge check (10 questions + goals). Builds a personal learning path; wrong answers become key lessons |
| `/account` | Dashboard: progress ring, next lesson, module progress, budget snapshot, saved articles, badges |
| `/account/modules` | Every lesson and quiz, with what's done |
| `/learn/:moduleId?lesson=…` / `?step=quiz` | Lesson reader and module quiz (pass mark 80%) |
| `/account/budget` | Budget planner compared with 50/30/20 |
| `/account/saved` | Saved articles |
| `/account/settings` | Change name / password, log out |

Course content lives in `src/data/modules.js`. Lesson ids there must match
`src/modules.php` in the API, which only saves progress for known ids. Badges are
worked out from progress in `src/lib/achievements.js`.

Login sends admins to `/dashboard`, users who haven't taken the knowledge check to
`/account/check`, and everyone else to `/account` (or back to the page that asked
them to log in). Questions and path rules live in `src/data/assessment.js`.

## Scam awareness
- Safety bar on every page, plus the "Is this a scam?" message checker (`src/lib/scamCheck.js`, runs in the browser)
- Golden rules, latest scam alerts and an "Ask us first" band on the home page
- `/alerts` — checker, what to do if you already shared a code or sent money, all alerts
- Alerts are managed by admins in the dashboard (Scam alerts tab)

## Admin dashboard
`/dashboard` tabs: Overview, Users (add, change role, reset password, delete, view
progress), Articles (add, edit at `/editarticle/:id`, publish, delete), Scam alerts,
Learning & quizzes, Messages, Subscribers. Most tabs can export CSV. Log-in state lives in `src/context/AuthContext.jsx`.

## Navigation
Home, Modules, Articles and About scroll to their section on the home page
(`/#modules`, `/#articles`, `/#about`) and highlight as you scroll. From any
other page the same links bring you back to that section. The Modules dropdown
goes to each full module page; "See all articles" goes to `/articles`.

## Backend
The PHP API lives in its own project (`moneymentor_api`). Logged-in requests send
`Authorization: Bearer <token>` automatically (see `apiFetch` in `src/config/api.js`).
If the token expires or is rejected, the user is logged out locally.
