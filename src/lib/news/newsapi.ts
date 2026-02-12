import type { Article, Category } from "@/types";

const NEWSAPI_BASE = "https://newsapi.org/v2";

/** Category-specific German search queries for the "everything" endpoint */
const CATEGORY_QUERIES: Record<Category, string> = {
  "for-you": "Deutschland OR Nachrichten",
  politik: "Politik OR Regierung OR Bundestag OR Wahl OR Partei",
  wirtschaft: "Wirtschaft OR Börse OR Unternehmen OR Aktien OR DAX",
  sport: "Fußball OR Bundesliga OR Sport OR Champions League OR Formel 1",
  tech: "Technologie OR KI OR Apple OR Google OR Software OR Startup",
  wissenschaft: "Wissenschaft OR Forschung OR Studie OR Universität",
  unterhaltung: "Film OR Musik OR Kino OR Streaming OR Serie",
  gesundheit: "Gesundheit OR Ernährung OR Krankheit OR WHO OR Medizin",
  kultur: "Kultur OR Museum OR Theater OR Ausstellung OR Literatur",
};

const ALL_CATEGORIES: Category[] = [
  "politik",
  "wirtschaft",
  "sport",
  "tech",
  "wissenschaft",
  "unterhaltung",
  "gesundheit",
  "kultur",
];

interface NewsApiArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

function estimateReadTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 200));
}

function toArticle(
  raw: NewsApiArticle,
  category: Category,
  index: number
): Article | null {
  // Skip removed/empty articles
  if (!raw.title || raw.title === "[Removed]") return null;
  if (!raw.description) return null;

  return {
    id: `news-${category}-${index}`,
    title: raw.title,
    description: raw.description,
    content: raw.content ?? undefined,
    url: raw.url,
    imageUrl: raw.urlToImage ?? undefined,
    sourceName: raw.source.name,
    author: raw.author ?? undefined,
    publishedAt: raw.publishedAt,
    category,
    sentiment: undefined,
    language: "de",
    readTimeMinutes: estimateReadTime(
      `${raw.title} ${raw.description} ${raw.content ?? ""}`
    ),
    tags: [],
    feedReason: "interest",
  };
}

/**
 * Fetch German news from NewsAPI using the "everything" endpoint.
 * Uses category-specific search queries to get relevant German articles.
 */
export async function fetchTopHeadlines(
  apiKey: string,
  _country = "de",
  pageSize = 5
): Promise<Article[]> {
  const allArticles: Article[] = [];

  // Fetch each category in parallel
  const fetches = ALL_CATEGORIES.map(async (cat) => {
    try {
      const query = encodeURIComponent(CATEGORY_QUERIES[cat]);
      const url = `${NEWSAPI_BASE}/everything?q=${query}&language=de&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${apiKey}`;
      const res = await fetch(url, { next: { revalidate: 900 } }); // Cache 15 min

      if (!res.ok) {
        console.error(`NewsAPI ${cat}: ${res.status} ${res.statusText}`);
        return [];
      }

      const data: NewsApiResponse = await res.json();

      return data.articles
        .map((raw, i) => toArticle(raw, cat, i))
        .filter((a): a is Article => a !== null);
    } catch (err) {
      console.error(`NewsAPI ${cat} error:`, err);
      return [];
    }
  });

  const results = await Promise.all(fetches);
  for (const articles of results) {
    allArticles.push(...articles);
  }

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
