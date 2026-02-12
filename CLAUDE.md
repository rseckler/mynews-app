# CLAUDE.md — MyNews.com

## Overview

**MyNews.com** is an AI-powered, personalized news aggregation platform for the German-speaking market. It fetches live German news from NewsAPI.org, generates AI summaries and briefings via Claude (Anthropic), and presents them in a mobile-first, modern UI.

**Joint Venture:** Highlight Communications AG × Sport1 Medien GmbH (prototype/MVP phase)

**Live URL:** https://mynews-app-eta.vercel.app
**GitHub:** https://github.com/rseckler/mynews-app

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router, Turbopack)
- **UI:** React 19, TypeScript 5, Tailwind CSS 4
- **Components:** shadcn/ui + Radix UI
- **Animations:** Framer Motion 12
- **State:** Zustand 5, React Query 5
- **Icons:** Lucide React
- **AI:** Anthropic SDK (`@anthropic-ai/sdk`) — Claude Haiku 4.5 (summaries), Claude Sonnet 4.5 (briefings)
- **News Data:** NewsAPI.org (`everything` endpoint, German language)
- **Package Manager:** pnpm (do NOT use npm — it fails for some packages)
- **Font:** Inter (Google Fonts)

## Commands

```bash
cd mynews-app

pnpm install          # Install dependencies (ALWAYS use pnpm, not npm)
pnpm dev              # Start dev server (localhost:3000, Turbopack)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

## Environment Variables

File: `.env.local` (git-ignored)

```
NEWSAPI_KEY=<NewsAPI.org API key>
ANTHROPIC_API_KEY=<Anthropic API key>
```

- Without `NEWSAPI_KEY`: App falls back to mock data (MOCK_ARTICLES)
- Without `ANTHROPIC_API_KEY`: AI summaries and briefings return 503

## Project Structure

```
mynews-app/
├── CLAUDE.md                          # This file
├── .env.local                         # API keys (git-ignored)
├── next.config.ts                     # Next.js config (allows all remote image hosts)
├── package.json                       # Dependencies (pnpm)
├── tailwind.config.ts                 # Tailwind configuration
├── tsconfig.json                      # TypeScript configuration
│
└── src/
    ├── types/index.ts                 # Article, Category, Sentiment, FeedReason types
    │
    ├── app/
    │   ├── layout.tsx                 # Root layout: Inter font, dark mode script, AppShell
    │   ├── globals.css                # Global styles, CSS variables, dark mode colors
    │   ├── page.tsx                   # Home page: Header + Feed + CategoryTabs
    │   │
    │   ├── article/[id]/
    │   │   ├── page.tsx               # Article detail page (client component, checks cache)
    │   │   └── article-detail.tsx     # Full article view with AI summary, bookmarks
    │   │
    │   ├── briefing/page.tsx          # Daily AI briefing with topic cards
    │   ├── search/page.tsx            # Real-time client-side search
    │   ├── saved/page.tsx             # Bookmarked articles list
    │   ├── profile/page.tsx           # Profile & settings page
    │   │
    │   └── api/
    │       ├── feed/route.ts          # GET /api/feed?category= — NewsAPI → Article[]
    │       ├── summarize/route.ts     # POST /api/summarize — Claude Haiku → summary + sentiment
    │       └── briefing/route.ts      # GET /api/briefing — Claude Sonnet → daily briefing
    │
    ├── components/
    │   ├── layout/
    │   │   ├── app-shell.tsx          # Root wrapper: BottomNav + ConsentBanner on all pages
    │   │   ├── header.tsx             # Top bar: Logo, search, bell, dark mode toggle
    │   │   ├── bottom-nav.tsx         # 5-tab mobile navigation (Link-based)
    │   │   └── consent-banner.tsx     # Cookie/privacy consent banner
    │   │
    │   ├── news/
    │   │   ├── feed.tsx               # Main article feed (fetches /api/feed, skeleton loading)
    │   │   ├── article-card.tsx       # Individual article card with bookmark toggle
    │   │   ├── ai-summary.tsx         # AI summary component (fetches /api/summarize)
    │   │   ├── category-tabs.tsx      # Horizontal category filter tabs
    │   │   ├── trending-topics.tsx    # Trending topics section
    │   │   └── breaking-news-banner.tsx # Breaking news alert
    │   │
    │   ├── onboarding/
    │   │   └── interest-picker.tsx    # First-run category selection
    │   │
    │   └── ui/                        # shadcn/ui primitives (button, badge, card, etc.)
    │
    ├── lib/
    │   ├── news/newsapi.ts            # NewsAPI integration (everything endpoint, category queries)
    │   ├── article-cache.ts           # Client-side article cache (Map-based)
    │   ├── bookmarks.ts               # localStorage bookmark CRUD
    │   ├── mock-data.ts               # Mock articles, categories, helpers (formatTimeAgo, etc.)
    │   ├── mock-content.ts            # Mock article body paragraphs
    │   └── utils.ts                   # cn() utility (tailwind-merge + clsx)
    │
    └── hooks/
        └── use-local-storage.ts       # useLocalStorage hook
```

## API Routes

### `GET /api/feed?category=<category>`
- Fetches live German news from NewsAPI `everything` endpoint
- 8 categories fetched in parallel with German keyword queries
- Falls back to MOCK_ARTICLES if no API key or on error
- Response: `{ articles: Article[], source: "live" | "mock" }`

### `POST /api/summarize`
- Body: `{ title, description, content?, articleId? }`
- Uses Claude Haiku 4.5 to generate 3-sentence German summary + sentiment
- Server-side in-memory cache by articleId
- Response: `{ summary: string, sentiment: "positive" | "neutral" | "negative" }`

### `GET /api/briefing`
- Uses Claude Sonnet 4.5 to generate structured daily briefing from top 12 articles
- Cached per day (server-side)
- Sanitizes German quotation marks (`„"`) that break JSON
- Response: `{ briefing: string (JSON), date: string }`

## Architecture Decisions

### NewsAPI Integration
- **Problem:** NewsAPI free tier returns 0 results for `top-headlines?country=de`
- **Solution:** Uses `everything` endpoint with category-specific German search queries (OR-combined keywords per category)
- Cache: 15 min via Next.js `revalidate`

### Dark Mode
- Inline `<script>` in `<head>` prevents flash on load (reads localStorage before paint)
- Key: `mynews-theme` in localStorage ("dark" | "light")
- Falls back to system preference (`prefers-color-scheme`) if no stored value
- Toggle in header and profile page

### AppShell Pattern
- BottomNav and ConsentBanner are rendered via `AppShell` component in root layout
- This ensures navigation is available on ALL pages, not just the home page
- Hidden on `/onboarding` path

### Article Cache
- Live articles from `/api/feed` are stored in a client-side Map (`article-cache.ts`)
- Detail page (`/article/[id]`) checks cache first, then falls back to MOCK_ARTICLES
- Necessary because live article IDs are generated client-side

### Logo Navigation
- `router.push("/")` and `<Link href="/">` did not reliably navigate from sub-pages
- Fixed with `window.location.href = "/"` which forces a full page navigation

### German Quotation Marks in LLM JSON
- Claude sometimes outputs German quotes (`„"`) which break JSON.parse
- Solution: Prompt instructs to avoid them + post-processing replaces Unicode chars (U+201E, U+201C, U+201D, U+00AB, U+00BB) with single quotes

## Persistence (localStorage)

| Key | Purpose |
|-----|---------|
| `mynews-theme` | Dark mode preference ("dark" / "light") |
| `mynews-bookmarks` | Saved articles (JSON array of Article objects) |
| `mynews-onboarding-done` | First-run onboarding completed (boolean) |
| `mynews-consent` | Cookie consent accepted (boolean) |
| `mynews-interests` | User's selected interest categories |

## Categories

9 categories: `for-you`, `politik`, `wirtschaft`, `sport`, `tech`, `wissenschaft`, `unterhaltung`, `gesundheit`, `kultur`

Each has a color, German label, and category-specific search query for NewsAPI.

## Deployment

- **Hosting:** Vercel (auto-deploy on git push to `main`)
- **Live URL:** https://mynews-app-eta.vercel.app
- **Environment:** Set `NEWSAPI_KEY` and `ANTHROPIC_API_KEY` in Vercel dashboard → Settings → Environment Variables

## Language

- UI language: **German** (all labels, buttons, error messages)
- Code language: **English** (variable names, comments, file names)

## Known Issues & Workarounds

1. **NewsAPI Free Tier Limitations:** Only `everything` endpoint works for German news. `top-headlines?country=de` returns 0 results on the free plan.
2. **German Quotation Marks:** LLM JSON output sometimes contains `„"` which breaks parsing. Always sanitize before `JSON.parse`.
3. **Logo Navigation:** Next.js `router.push` and `<Link>` didn't work reliably for the logo. Using `window.location.href` instead.
4. **npm vs pnpm:** Always use `pnpm`. npm fails for some packages (e.g., `@anthropic-ai/sdk`).
5. **Remote Images:** `next.config.ts` allows all image hosts (`hostname: "**"`) because NewsAPI articles come from many different domains.

## Concept Documents

Located in `/Users/robin/Documents/4_AI/MyNews.com/` (parent directory):
- `00-EXECUTIVE-SUMMARY.md` — Business case and vision
- `01-MARKTANALYSE.md` — Market analysis for German news market
- `02-ZIELGRUPPEN.md` — Target audience personas
- `03-PRODUKT-FEATURES.md` — Product feature specifications
- `04-DESIGN-SYSTEM.md` — Design system (colors, typography, spacing)
- `05-CONTENT-STRATEGIE.md` — Content strategy
- `06-MONETARISIERUNG.md` — Monetization model
- `07-TECHNIK-ARCHITEKTUR.md` — Technical architecture
- `08-MVP-ROADMAP.md` — MVP development roadmap
- `09-WETTBEWERB-MATRIX.md` — Competitive analysis

## API Cost Estimates

- **NewsAPI:** Free tier (100 requests/day) — sufficient for prototype
- **Claude Haiku (summaries):** ~$0.01 per summary
- **Claude Sonnet (briefings):** ~$0.03 per briefing (1x daily)
- **Monthly estimate:** < $5/month at prototype traffic levels
