import type { Article, Category } from "@/types";

interface RSSFeedConfig {
  url: string;
  name: string;
  defaultCategory: Category;
}

/**
 * German public broadcaster RSS feeds.
 * All feeds return standard RSS 2.0 with <item> elements.
 */
const RSS_FEEDS: RSSFeedConfig[] = [
  // Öffentlich-rechtliche
  {
    url: "https://www.tagesschau.de/xml/rss2/",
    name: "tagesschau",
    defaultCategory: "politik",
  },
  {
    url: "https://www.zdf.de/rss/zdf/nachrichten",
    name: "ZDF heute",
    defaultCategory: "politik",
  },
  {
    url: "https://www.deutschlandfunk.de/nachrichten-100.rss",
    name: "Deutschlandfunk",
    defaultCategory: "politik",
  },
  {
    url: "https://www.sportschau.de/index~rss2.xml",
    name: "Sportschau",
    defaultCategory: "sport",
  },
  // Qualitätspresse
  {
    url: "https://www.spiegel.de/schlagzeilen/index.rss",
    name: "Der Spiegel",
    defaultCategory: "politik",
  },
  {
    url: "https://www.zeit.de/news/index",
    name: "Die Zeit",
    defaultCategory: "politik",
  },
  // Tech & Wissenschaft
  {
    url: "https://www.heise.de/rss/heise-top-atom.xml",
    name: "heise online",
    defaultCategory: "tech",
  },
  {
    url: "https://www.netzpolitik.org/feed/",
    name: "netzpolitik.org",
    defaultCategory: "tech",
  },
];

/** Keyword → Category mapping for auto-categorization */
const CATEGORY_KEYWORDS: { category: Category; keywords: string[] }[] = [
  {
    category: "sport",
    keywords: ["sport", "fußball", "bundesliga", "champions league", "formel 1", "olympi", "handball", "tennis", "dfb"],
  },
  {
    category: "wirtschaft",
    keywords: ["wirtschaft", "börse", "aktien", "dax", "unternehmen", "inflation", "ezb", "handel", "konjunktur"],
  },
  {
    category: "tech",
    keywords: ["technologie", "digital", "ki ", "künstliche intelligenz", "software", "apple", "google", "microsoft", "startup", "app "],
  },
  {
    category: "wissenschaft",
    keywords: ["wissenschaft", "forschung", "studie", "klima", "weltraum", "nasa", "universität"],
  },
  {
    category: "gesundheit",
    keywords: ["gesundheit", "corona", "impf", "krankenhaus", "medizin", "who", "pandemie", "pflege"],
  },
  {
    category: "kultur",
    keywords: ["kultur", "museum", "theater", "ausstellung", "literatur", "film", "oscar", "buch"],
  },
  {
    category: "unterhaltung",
    keywords: ["unterhaltung", "promi", "tv ", "fernsehen", "show", "streaming", "musik", "konzert"],
  },
];

function categorize(title: string, description: string): Category {
  const text = `${title} ${description}`.toLowerCase();
  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((kw) => text.includes(kw))) {
      return category;
    }
  }
  return "politik"; // default for news from public broadcasters
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

    // Extract all <item> blocks
    const items: string[] = [];
    const itemRe = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemRe.exec(xml)) !== null) {
      items.push(match[1]);
    }

    const articles: Article[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const title = stripHtml(extractTag(item, "title"));
      const rawDesc = extractTag(item, "description");
      const description = stripHtml(rawDesc);
      const link = extractTag(item, "link");
      const pubDate = extractTag(item, "pubDate");
      const imageUrl = extractImage(item);

      if (!title || !link) continue;

      const category = categorize(title, description);

      articles.push({
        id: `rss-${config.name.toLowerCase().replace(/\s+/g, "-")}-${i}`,
        title,
        description: description || title,
        url: link,
        imageUrl,
        sourceName: config.name,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        category,
        language: "de",
        readTimeMinutes: estimateReadTime(`${title} ${description}`),
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

/**
 * Fetch articles from all configured German public broadcaster RSS feeds.
 * Each feed is fetched in parallel; failures are silently skipped.
 */
export async function fetchRSSFeeds(): Promise<Article[]> {
  const results = await Promise.all(RSS_FEEDS.map(parseFeed));
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
