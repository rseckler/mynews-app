import type { Article, Category } from "@/types";

interface RSSFeedConfig {
  url: string;
  name: string;
  defaultCategory: Category;
  group: "öffentlich-rechtlich" | "qualitätspresse" | "tech" | "sport" | "wirtschaft" | "international";
}

/**
 * All available German news RSS feeds.
 * Exported so the profile page can display/toggle them.
 */
export const RSS_FEEDS: RSSFeedConfig[] = [
  // ── Öffentlich-rechtliche ──
  {
    url: "https://www.tagesschau.de/xml/rss2/",
    name: "tagesschau",
    defaultCategory: "politik",
    group: "öffentlich-rechtlich",
  },
  {
    url: "https://www.zdf.de/rss/zdf/nachrichten",
    name: "ZDF heute",
    defaultCategory: "politik",
    group: "öffentlich-rechtlich",
  },
  {
    url: "https://www.deutschlandfunk.de/nachrichten-100.rss",
    name: "Deutschlandfunk",
    defaultCategory: "politik",
    group: "öffentlich-rechtlich",
  },
  {
    url: "https://www.sportschau.de/index~rss2.xml",
    name: "Sportschau",
    defaultCategory: "sport",
    group: "öffentlich-rechtlich",
  },
  {
    url: "https://www.ndr.de/nachrichten/index-rss.xml",
    name: "NDR",
    defaultCategory: "politik",
    group: "öffentlich-rechtlich",
  },
  {
    url: "https://www1.wdr.de/nachrichten/index-rss.xml",
    name: "WDR",
    defaultCategory: "politik",
    group: "öffentlich-rechtlich",
  },
  {
    url: "https://www.br.de/nachrichten/feed/",
    name: "BR24",
    defaultCategory: "politik",
    group: "öffentlich-rechtlich",
  },
  {
    url: "https://www.swr.de/~rss/swraktuell-all-100.xml",
    name: "SWR",
    defaultCategory: "politik",
    group: "öffentlich-rechtlich",
  },
  {
    url: "https://www.mdr.de/nachrichten/index-rss.xml",
    name: "MDR",
    defaultCategory: "politik",
    group: "öffentlich-rechtlich",
  },
  // ── Qualitätspresse ──
  {
    url: "https://www.spiegel.de/schlagzeilen/index.rss",
    name: "Der Spiegel",
    defaultCategory: "politik",
    group: "qualitätspresse",
  },
  {
    url: "https://www.zeit.de/news/index",
    name: "Die Zeit",
    defaultCategory: "politik",
    group: "qualitätspresse",
  },
  {
    url: "https://rss.sueddeutsche.de/rss/Topthemen",
    name: "Süddeutsche Zeitung",
    defaultCategory: "politik",
    group: "qualitätspresse",
  },
  {
    url: "https://www.faz.net/rss/aktuell/",
    name: "FAZ",
    defaultCategory: "politik",
    group: "qualitätspresse",
  },
  {
    url: "https://taz.de/!p4608;rss/",
    name: "taz",
    defaultCategory: "politik",
    group: "qualitätspresse",
  },
  {
    url: "https://www.tagesspiegel.de/contentexport/feed/home",
    name: "Tagesspiegel",
    defaultCategory: "politik",
    group: "qualitätspresse",
  },
  {
    url: "https://www.n-tv.de/rss",
    name: "n-tv",
    defaultCategory: "politik",
    group: "qualitätspresse",
  },
  // ── Tech & Wissenschaft ──
  {
    url: "https://www.heise.de/rss/heise-top-atom.xml",
    name: "heise online",
    defaultCategory: "tech",
    group: "tech",
  },
  {
    url: "https://www.netzpolitik.org/feed/",
    name: "netzpolitik.org",
    defaultCategory: "tech",
    group: "tech",
  },
  {
    url: "https://rss.golem.de/rss.php?feed=RSS2.0",
    name: "Golem",
    defaultCategory: "tech",
    group: "tech",
  },
  {
    url: "https://www.spektrum.de/alias/rss/spektrum-de-rss-feed/996406",
    name: "Spektrum",
    defaultCategory: "wissenschaft",
    group: "tech",
  },
  // ── Sport ──
  {
    url: "https://newsfeed.kicker.de/news/aktuell",
    name: "kicker",
    defaultCategory: "sport",
    group: "sport",
  },
  // ── Wirtschaft ──
  {
    url: "https://www.handelsblatt.com/contentexport/feed/top",
    name: "Handelsblatt",
    defaultCategory: "wirtschaft",
    group: "wirtschaft",
  },
  // ── International ──
  {
    url: "https://de.euronews.com/rss",
    name: "Euronews",
    defaultCategory: "politik",
    group: "international",
  },
];

/** Get list of feed names grouped for the profile UI */
export function getFeedGroups(): { group: string; feeds: { name: string; url: string }[] }[] {
  const groups = new Map<string, { name: string; url: string }[]>();
  const groupLabels: Record<string, string> = {
    "öffentlich-rechtlich": "Öffentlich-Rechtliche",
    "qualitätspresse": "Qualitätspresse",
    "tech": "Tech & Wissenschaft",
    "sport": "Sport",
    "wirtschaft": "Wirtschaft",
    "international": "International",
  };
  for (const feed of RSS_FEEDS) {
    const label = groupLabels[feed.group] ?? feed.group;
    const list = groups.get(label) ?? [];
    list.push({ name: feed.name, url: feed.url });
    groups.set(label, list);
  }
  return [...groups.entries()].map(([group, feeds]) => ({ group, feeds }));
}

/** Keyword → Category mapping for auto-categorization */
const CATEGORY_KEYWORDS: { category: Category; keywords: string[] }[] = [
  {
    category: "sport",
    keywords: ["sport", "fußball", "bundesliga", "champions league", "formel 1", "olympi", "handball", "tennis", "dfb", "kicker", "tor ", "trainer"],
  },
  {
    category: "wirtschaft",
    keywords: ["wirtschaft", "börse", "aktien", "dax", "unternehmen", "inflation", "ezb", "handel", "konjunktur", "finanzen", "bank"],
  },
  {
    category: "tech",
    keywords: ["technologie", "digital", "ki ", "künstliche intelligenz", "software", "apple", "google", "microsoft", "startup", "app ", "cyber", "internet", "computer"],
  },
  {
    category: "wissenschaft",
    keywords: ["wissenschaft", "forschung", "studie", "klima", "weltraum", "nasa", "universität", "medizinisch"],
  },
  {
    category: "gesundheit",
    keywords: ["gesundheit", "corona", "impf", "krankenhaus", "medizin", "who", "pandemie", "pflege", "patient"],
  },
  {
    category: "kultur",
    keywords: ["kultur", "museum", "theater", "ausstellung", "literatur", "film", "oscar", "buch", "kunst"],
  },
  {
    category: "unterhaltung",
    keywords: ["unterhaltung", "promi", "tv ", "fernsehen", "show", "streaming", "musik", "konzert", "star "],
  },
];

function categorize(title: string, description: string, defaultCat: Category): Category {
  const text = `${title} ${description}`.toLowerCase();
  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((kw) => text.includes(kw))) {
      return category;
    }
  }
  return defaultCat;
}

function estimateReadTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 200));
}

/** Extract text between XML tags (simple, no nested tags) */
function extractTag(xml: string, tag: string): string {
  // Try CDATA first
  const cdataRe = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, "i");
  const cdataMatch = xml.match(cdataRe);
  if (cdataMatch) return cdataMatch[1].trim();

  // Plain text
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = xml.match(re);
  return match ? match[1].trim() : "";
}

/** Extract image URL from enclosure tag or content */
function extractImage(itemXml: string): string | undefined {
  // Try <enclosure> tag (ZDF)
  const encMatch = itemXml.match(/<enclosure[^>]+url="([^"]+)"[^>]*type="image/i);
  if (encMatch) return encMatch[1];

  // Try <media:content> or <media:thumbnail>
  const mediaMatch = itemXml.match(/<media:(?:content|thumbnail)[^>]+url="([^"]+)"/i);
  if (mediaMatch) return mediaMatch[1];

  // Try img tag in content/description
  const imgMatch = itemXml.match(/<img[^>]+src="([^"]+)"/i);
  if (imgMatch) return imgMatch[1];

  return undefined;
}

/** Strip HTML tags from text */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/\s+/g, " ")
    .trim();
}

/** Parse a single RSS feed and return Article[] */
async function parseFeed(config: RSSFeedConfig): Promise<Article[]> {
  try {
    const res = await fetch(config.url, {
      redirect: "follow",
      next: { revalidate: 900 }, // Cache 15 min
      headers: { "User-Agent": "MyNews/1.0" },
    });

    if (!res.ok) {
      console.error(`RSS ${config.name}: ${res.status} ${res.statusText}`);
      return [];
    }

    const xml = await res.text();

    // Extract all <item> or <entry> blocks (RSS 2.0 + Atom)
    const items: string[] = [];
    const itemRe = /<(?:item|entry)>([\s\S]*?)<\/(?:item|entry)>/gi;
    let match;
    while ((match = itemRe.exec(xml)) !== null) {
      items.push(match[1]);
    }

    const articles: Article[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const title = stripHtml(extractTag(item, "title"));
      const rawDesc = extractTag(item, "description") || extractTag(item, "summary");
      const description = stripHtml(rawDesc);
      // Also extract content:encoded or content for fuller article text
      const rawContent = extractTag(item, "content:encoded") || extractTag(item, "content");
      const content = rawContent ? stripHtml(rawContent) : "";
      const link = extractTag(item, "link")
        || (item.match(/<link[^>]+href="([^"]+)"/i)?.[1] ?? ""); // Atom feeds
      const pubDate = extractTag(item, "pubDate")
        || extractTag(item, "published")
        || extractTag(item, "updated");
      const imageUrl = extractImage(item);

      if (!title || !link) continue;

      const category = categorize(title, description, config.defaultCategory);

      articles.push({
        id: `rss-${config.name.toLowerCase().replace(/\s+/g, "-")}-${i}`,
        title,
        description: description || title,
        content: content || description || undefined,
        url: link,
        imageUrl,
        sourceName: config.name,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        category,
        language: "de",
        readTimeMinutes: estimateReadTime(`${title} ${description} ${content}`),
        tags: [],
        feedReason: "interest",
      });
    }

    return articles;
  } catch (err) {
    console.error(`RSS ${config.name} error:`, err);
    return [];
  }
}

const SOURCES_KEY = "mynews-disabled-sources";

/** Get list of disabled source names from localStorage (called server-side: returns empty) */
export function getDisabledSources(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SOURCES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Fetch articles from all configured RSS feeds.
 * Each feed is fetched in parallel; failures are silently skipped.
 * Optionally pass disabledSources to filter out specific feeds.
 */
export async function fetchRSSFeeds(disabledSources?: string[]): Promise<Article[]> {
  const activeFeedConfigs = disabledSources
    ? RSS_FEEDS.filter((f) => !disabledSources.includes(f.name))
    : RSS_FEEDS;

  const results = await Promise.all(activeFeedConfigs.map(parseFeed));
  const allArticles = results.flat();

  // Sort by publishedAt descending
  allArticles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Deduplicate by URL
  const seen = new Set<string>();
  return allArticles.filter((a) => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });
}
