# CLAUDE.md — MyNews.com

## Overview

**MyNews.com** is an AI-powered, personalized news aggregation platform for the German-speaking market. It fetches live German news from 23 RSS feeds + NewsAPI.org, generates AI summaries and briefings via Claude (Anthropic), and offers audio playback via OpenAI TTS — all in a mobile-first, modern UI.

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
- **AI:** Anthropic SDK (`@anthropic-ai/sdk`) — Claude Haiku 4.5 (summaries), Claude Sonnet 4.5 (briefings/digest)
- **Audio:** OpenAI TTS API (`tts-1`, voice: `nova`)
- **News Data:** 23 German RSS feeds + NewsAPI.org (`everything` endpoint)
- **Typography:** `@tailwindcss/typography` (prose styles for legal pages)
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
OPENAI_API_KEY=<OpenAI API key for TTS>
```

- Without `NEWSAPI_KEY`: RSS feeds still work, NewsAPI articles missing
- Without `ANTHROPIC_API_KEY`: AI summaries and briefings return 503
- Without `OPENAI_API_KEY`: Audio playback returns 503

**Important:** When setting `OPENAI_API_KEY` in Vercel, ensure no trailing newlines/whitespace. The code trims it as a safety measure, but the root cause was copy-paste artifacts.

## Project Structure

```
mynews-app/
├── CLAUDE.md                          # This file
├── .env.local                         # API keys (git-ignored)
├── next.config.ts                     # Next.js config (allows all remote image hosts)
├── package.json                       # Dependencies (pnpm)
├── tsconfig.json                      # TypeScript configuration
│
├── public/
│   ├── manifest.json                  # PWA manifest
│   └── icon.svg                       # SVG icon for PWA (512x512)
│
└── src/
    ├── types/index.ts                 # Article, Category, Sentiment, FeedReason types
    │
    ├── app/
    │   ├── layout.tsx                 # Root layout: Inter font, dark mode script, AppShell
    │   ├── globals.css                # Global styles, CSS variables, dark mode, typography plugin
    │   ├── icon.tsx                   # Favicon (32x32 PNG via ImageResponse)
    │   ├── apple-icon.tsx             # Apple touch icon (180x180 PNG via ImageResponse)
    │   ├── page.tsx                   # Home page: Header + Feed + CategoryTabs
    │   │
    │   ├── article/[id]/
    │   │   ├── page.tsx               # Article detail page (client, checks cache)
    │   │   └── article-detail.tsx     # Full article: AI summary, expandable content, bookmarks
    │   │
    │   ├── briefing/
    │   │   ├── page.tsx               # Morgen-Briefing with audio player
    │   │   └── layout.tsx             # Briefing layout metadata
    │   │
    │   ├── digest/
    │   │   ├── page.tsx               # Abend-Digest with audio player
    │   │   └── layout.tsx             # Digest layout metadata
    │   │
    │   ├── search/page.tsx            # Real-time client-side search
    │   ├── saved/page.tsx             # Bookmarked articles list
    │   ├── profile/page.tsx           # Profile: settings, interest picker, source management
    │   │
    │   ├── impressum/page.tsx         # Legal: Impressum (static)
    │   ├── datenschutz/page.tsx       # Legal: Datenschutzerklärung (static)
    │   ├── nutzungsbedingungen/page.tsx # Legal: Nutzungsbedingungen (static)
    │   ├── cookies/page.tsx           # Legal: Cookie-Einstellungen (client, interactive)
    │   │
    │   └── api/
    │       ├── feed/route.ts          # GET — NewsAPI + RSS → Article[] (round-robin interleaved)
    │       ├── summarize/route.ts     # POST — Claude Haiku → summary + sentiment
    │       ├── briefing/route.ts      # GET — Claude Sonnet → daily morning briefing
    │       ├── briefing/audio/route.ts # POST/GET — OpenAI TTS → MP3 audio
    │       └── digest/route.ts        # GET — Claude Sonnet → evening digest
    │
    ├── components/
    │   ├── layout/
    │   │   ├── app-shell.tsx          # Root wrapper: Header, BottomNav, SiteFooter, ConsentBanner
    │   │   ├── header.tsx             # Top bar: Logo, desktop nav, search, dark mode toggle
    │   │   ├── bottom-nav.tsx         # 5-tab mobile navigation (hidden on lg+)
    │   │   ├── site-footer.tsx        # Site footer: brand, product links, legal links, contact
    │   │   └── consent-banner.tsx     # Cookie/privacy consent banner
    │   │
    │   ├── news/
    │   │   ├── feed.tsx               # Main feed: fetches /api/feed, skeleton, load-more
    │   │   ├── article-card.tsx       # Article card (featured/standard/compact variants)
    │   │   ├── ai-summary.tsx         # AI summary overlay (fetches /api/summarize)
    │   │   ├── category-tabs.tsx      # Horizontal category filter (✦ Für Dich prominent)
    │   │   ├── briefing-tabs.tsx      # Morgen/Abend toggle tabs (used on both pages)
    │   │   ├── trending-topics.tsx    # Trending topics sidebar
    │   │   └── breaking-news-banner.tsx # Breaking news alert (only after loading)
    │   │
    │   ├── onboarding/
    │   │   └── interest-picker.tsx    # First-run category selection
    │   │
    │   └── ui/                        # shadcn/ui primitives (button, badge, card, etc.)
    │
    ├── lib/
    │   ├── news/
    │   │   ├── newsapi.ts             # NewsAPI integration (everything endpoint)
    │   │   └── rss-feeds.ts           # 23 RSS feeds: config, parsing, categorization, grouping
    │   ├── article-cache.ts           # Client-side article cache (Map-based)
    │   ├── bookmarks.ts               # localStorage bookmark CRUD
    │   ├── share.ts                   # Web Share API wrapper
    │   ├── feedback.ts                # Article like/dislike feedback (localStorage)
    │   ├── source-prefs.ts            # Source preference (more/less) per sourceName
    │   ├── mock-data.ts               # Mock articles, categories, helpers (formatTimeAgo, etc.)
    │   ├── mock-content.ts            # Mock article body paragraphs (IDs 1-3, 9)
    │   └── utils.ts                   # cn() utility (tailwind-merge + clsx)
    │
    └── hooks/
        └── use-local-storage.ts       # useLocalStorage hook
```

## API Routes

### `GET /api/feed?category=<category>&disabled=<source1,source2>`
- Fetches NewsAPI + 23 RSS feeds in parallel
- Round-robin interleaving by source for diversity
- Deduplicates by URL, filters by category
- `disabled` param excludes specific RSS sources
- Falls back to MOCK_ARTICLES if < 3 results
- Response: `{ articles: Article[], source: "live" | "mock" }`

### `POST /api/summarize`
- Body: `{ title, description, content?, articleId? }`
- Uses Claude Haiku 4.5 to generate 3-sentence German summary + sentiment
- Server-side in-memory cache by articleId
- Response: `{ summary: string, sentiment: "positive" | "neutral" | "negative" }`

### `GET /api/briefing`
- Uses Claude Sonnet 4.5 to generate structured daily morning briefing from top 12 articles
- Cached per day (server-side)
- Sanitizes German quotation marks (`„"`) that break JSON
- Response: `{ briefing: string (JSON), date: string }`

### `GET /api/digest`
- Uses Claude Sonnet 4.5 to generate structured evening digest
- Same pattern as briefing but with evening-specific format (highlight, outlook, goodnight)
- Response: `{ digest: string (JSON), date: string }`

### `POST /api/briefing/audio`
- Body: `{ text: string }`
- Uses OpenAI TTS API (model: `tts-1`, voice: `nova`, MP3)
- Trims text to 4000 chars, trims API key whitespace
- `maxDuration: 60` for Vercel serverless
- Returns `audio/mpeg` binary

### `GET /api/briefing/audio`
- Health check: returns `{ configured: boolean }` for OPENAI_API_KEY status

## RSS Feed Sources (23 feeds)

**Öffentlich-rechtliche (9):** tagesschau, ZDF heute, Deutschlandfunk, Sportschau, NDR, WDR, BR24, SWR, MDR

**Qualitätspresse (7):** Der Spiegel, Die Zeit, Süddeutsche Zeitung, FAZ, taz, Tagesspiegel, n-tv

**Tech & Wissenschaft (4):** heise online, netzpolitik.org, Golem, Spektrum

**Sport (1):** kicker | **Wirtschaft (1):** Handelsblatt | **International (1):** Euronews

All feeds are configurable per user in Profile → Nachrichtenquellen.

## Architecture Decisions

### RSS Feed Integration
- Custom XML parser (regex-based, no library dependencies)
- Handles RSS 2.0 (`<item>`) and Atom (`<entry>`) feeds
- Extracts `content:encoded` for fuller article text
- Keyword-based auto-categorization into 8 categories
- Source toggling via localStorage + `?disabled=` query param

### Feed Diversity (Round-Robin)
- Groups articles by `sourceName`, then picks one from each source in turn
- Prevents clusters from a single dominant source in the feed

### Audio Autoplay Fix
- Browsers block `audio.play()` after async operations (fetch loses user gesture context)
- Fix: `new Audio()` is created immediately during click handler, `src` is set after fetch

### Favicon Strategy
- `src/app/icon.tsx` generates 32x32 PNG via Next.js `ImageResponse` API
- `src/app/apple-icon.tsx` generates 180x180 PNG for Apple devices
- No SVG favicon (not universally supported across browsers)

### Expandable Article Content
- Character-based threshold (250 chars) with sentence boundary splitting
- Gradient fade overlay when collapsed, "Weiterlesen" button with char count
- Falls back to link to original article if no content available

### Breaking News Banner
- Only shown after feed loading completes (prevents flash from mock data)
- Manual dismiss only (no auto-timer)

### Mobile Font Sizes
- Key text elements use responsive sizing: `text-base sm:text-sm`
- Bottom nav labels: `text-xs` (was `text-[10px]`)
- Ensures readability on small screens while maintaining density on desktop

### NewsAPI Integration
- **Problem:** NewsAPI free tier returns 0 results for `top-headlines?country=de`
- **Solution:** Uses `everything` endpoint with category-specific German search queries
- Cache: 15 min via Next.js `revalidate`

### Dark Mode
- Inline `<script>` in `<head>` prevents flash on load (reads localStorage before paint)
- Key: `mynews-theme` in localStorage ("dark" | "light")
- Falls back to system preference (`prefers-color-scheme`)
- Toggle in header and profile page

### AppShell Pattern
- Header, BottomNav, SiteFooter, and ConsentBanner rendered via `AppShell` in root layout
- Ensures navigation and footer on ALL pages
- Hidden on `/onboarding` path

### German Quotation Marks in LLM JSON
- Claude sometimes outputs German quotes (`„"`) which break JSON.parse
- Solution: Prompt instructs to avoid them + post-processing replaces Unicode chars

## Persistence (localStorage)

| Key | Purpose |
|-----|---------|
| `mynews-theme` | Dark mode preference ("dark" / "light") |
| `mynews-bookmarks` | Saved articles (JSON array of Article objects) |
| `mynews-onboarding-done` | First-run onboarding completed (boolean) |
| `mynews-consent` | Cookie consent accepted (boolean) |
| `mynews-cookie-settings` | Granular cookie category preferences (JSON) |
| `mynews-interests` | User's selected interest categories (JSON array) |
| `mynews-disabled-sources` | Disabled RSS source names (JSON array) |
| `mynews-feedback-*` | Article like/dislike per article ID |
| `mynews-source-pref-*` | Source preference (more/less) per source name |

## Categories

9 categories: `for-you`, `politik`, `wirtschaft`, `sport`, `tech`, `wissenschaft`, `unterhaltung`, `gesundheit`, `kultur`

Each has a color, German label, and category-specific search query for NewsAPI. "Für Dich" tab is visually prominent with ✦ icon.

## Legal Pages

- `/impressum` — Angaben gemäß § 5 TMG (Highlight Communications AG, CFO: Hasan Dilsiz)
- `/datenschutz` — DSGVO-konforme Datenschutzerklärung
- `/nutzungsbedingungen` — Nutzungsbedingungen inkl. KI-Inhalte-Klausel
- `/cookies` — Interaktive Cookie-Einstellungen mit Toggle-Buttons

All linked from the site footer.

## Deployment

- **Hosting:** Vercel (auto-deploy on git push to `main`)
- **Live URL:** https://mynews-app-eta.vercel.app
- **Environment Variables (Vercel Dashboard):**
  - `NEWSAPI_KEY` — NewsAPI.org API key
  - `ANTHROPIC_API_KEY` — Anthropic API key
  - `OPENAI_API_KEY` — OpenAI API key (for TTS audio)

**Important:** After changing env vars in Vercel, you must redeploy for changes to take effect.

## Language

- UI language: **German** (all labels, buttons, error messages, legal pages)
- Code language: **English** (variable names, comments, file names)

## Known Issues & Workarounds

1. **NewsAPI Free Tier:** Only `everything` endpoint works for German news. `top-headlines?country=de` returns 0 results.
2. **German Quotation Marks:** LLM JSON output sometimes contains `„"` which breaks parsing. Always sanitize before `JSON.parse`.
3. **Logo Navigation:** Next.js `router.push` and `<Link>` didn't work reliably for the logo. Using `window.location.href` instead.
4. **npm vs pnpm:** Always use `pnpm`. npm fails for some packages.
5. **Remote Images:** `next.config.ts` allows all image hosts (`hostname: "**"`) because articles come from many different domains.
6. **OpenAI API Key Whitespace:** Vercel env vars can contain trailing newlines from copy-paste. Code trims with `.trim().replace(/\s+/g, "")`.
7. **Audio Autoplay:** Browsers require `Audio()` creation during user gesture. Cannot create after async fetch.
8. **RSS Content Varies:** Some feeds provide `content:encoded` (full text), others only short descriptions. Expand feature uses 250-char threshold.

## API Cost Estimates

- **NewsAPI:** Free tier (100 requests/day) — sufficient for prototype
- **RSS Feeds:** Free (public feeds, no API key needed)
- **Claude Haiku (summaries):** ~$0.01 per summary
- **Claude Sonnet (briefings/digest):** ~$0.03 per generation (2x daily)
- **OpenAI TTS:** ~$0.015 per audio generation (~4000 chars)
- **Monthly estimate:** < $10/month at prototype traffic levels

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
