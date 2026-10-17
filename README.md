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

## Navigation
Home, Modules, Articles and About scroll to their section on the home page
(`/#modules`, `/#articles`, `/#about`) and highlight as you scroll. From any
other page the same links bring you back to that section. The Modules dropdown
goes to each full module page; "See all articles" goes to `/articles`.

## Backend
The PHP API lives in its own project (`moneymentor_api`). Logged-in requests send
`Authorization: Bearer <token>` automatically (see `apiFetch` in `src/config/api.js`).
If the token expires or is rejected, the user is logged out locally.
