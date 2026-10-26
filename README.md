# Mangalam Gaud — Portfolio

Frontend-only, multi-page portfolio: React 19, TypeScript (strict), Tailwind CSS v4,
Three.js (`@react-three/fiber`), Framer Motion and Vite.

## Quick Start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build → dist/
npm run preview  # serve the production build
npm run lint     # eslint, zero warnings allowed
```

## Deploy

Every path must be rewritten to `index.html`, or only `/` loads and every other route
404s. Vercel reads `vercel.json`; Netlify and Cloudflare Pages read `public/_redirects`.
On a host with no rewrite support, deep links cannot work — use Vercel, Netlify or
Cloudflare Pages.

Vercel from GitHub:

1. `git init && git add -A && git commit -m "Portfolio"`, push to a new GitHub repo.
2. vercel.com → Add New → Project → import that repo. Preset auto-detects **Vite**.
3. Deploy. `vercel.json` supplies the SPA rewrite, security headers and immutable
   `/assets/*` caching; nothing to configure in the dashboard.
4. Settings → Domains if the URL is not the one written into `siteUrl`.

The deployed host is written in four places — change all of them together when the
custom domain goes live:

| File | What |
| --- | --- |
| `src/data.ts` | `siteUrl` — canonical, OG and JSON-LD at runtime |
| `index.html` | static canonical, `og:url`, `og:image`, `twitter:image` |
| `public/sitemap.xml` | every `<loc>` |
| `public/robots.txt` | the `Sitemap:` line |

## Structure

```
src/
  components/        # Shared chrome: boot screen, command palette, error boundary,
                     # PWA install, update toast, résumé preview, SEO head, 3D provider
  components/ui/     # Button, Link
  pages/             # One component per route: Home, About, Skills, Projects,
                     # ProjectDetail, Experience, Education, Contact
  lib/atsResume.ts   # Résumé PDF builder (single-column, real text)
  components/ResumePrint.tsx  # Résumé designed layout (PNG + print)
  data.ts            # All content: profile, siteUrl, skills, projects, résumé, certs
  App.tsx            # Router, nav, 404
  index.css          # Design tokens + base styles
  main.tsx           # Entry point, service-worker registration
public/
  projects/          # Case-study hero + thumbnail images
  sitemap.xml        # 20 URLs: 7 routes + 13 case studies
  robots.txt         # Crawl rules + sitemap pointer
  sw.js              # Offline cache (network-first pages, cache-first assets)
  manifest.json      # PWA name, colours, icons
  og.png, avatar.png, icon-192/512, apple-touch-icon, favicon, logo.svg
  _redirects         # SPA fallback for Netlify / Cloudflare Pages
```

## Editing content

Everything printable or navigable lives in `src/data.ts`. Two explicit lists control
order, so nothing drifts when a project is added:

| Export | Controls |
| --- | --- |
| `homeOrder` | the three cards on the home page, in order |
| `resumeOrder` | the four projects printed on both résumé formats |

A project needs an entry in `projects` (with `image` and a matching `-thumb.jpg`), and its
id added to `homeOrder` or `resumeOrder` if it should appear there. `demo` and `video` are
optional; `facts` is optional and prints as the last line of the résumé entry.

## Notes

- **3D scene**: one shared WebGL canvas behind every page. Each page adds its own
  geometry; scroll eases the scene group's pose. `prefers-reduced-motion` disables the
  canvas entirely, and so does a browser without WebGL — the pages are DOM-only then,
  never blocked by the scene.
- **Résumé**: buttons open a read-only preview first, then Download or Print. The PDF is
  single-column real text and **must stay one page** — it prints only the first two
  highlights plus `facts` per project; the PNG is the designed two-column layout and
  prints the full description and every highlight.
- **Content**: all copy lives in `src/data.ts`. Project images are real screenshots for
  live projects and typographic case-study plates for the rest — no mock screenshots.
- **Privacy**: frontend-only. No analytics, no backend, no API keys, no stored input.
