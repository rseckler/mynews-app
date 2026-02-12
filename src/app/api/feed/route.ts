import { NextResponse } from "next/server";
import { fetchTopHeadlines } from "@/lib/news/newsapi";
import { fetchRSSFeeds } from "@/lib/news/rss-feeds";
import { MOCK_ARTICLES } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "for-you";

  const apiKey = process.env.NEWSAPI_KEY;

  let articles;

  try {
    // Fetch NewsAPI and RSS feeds in parallel
    const [newsApiArticles, rssArticles] = await Promise.all([
      apiKey
        ? fetchTopHeadlines(apiKey, "de", 8).catch((err) => {
            console.error("NewsAPI error:", err);
            return [];
          })
        : Promise.resolve([]),
      fetchRSSFeeds().catch((err) => {
        console.error("RSS feeds error:", err);
        return [];
      }),
    ]);

    // Merge all articles
    const allArticles = [...newsApiArticles, ...rssArticles];

    // Deduplicate by URL (in case same story appears in both)
    const seen = new Set<string>();
    const deduped = allArticles.filter((a) => {
      if (seen.has(a.url)) return false;
      seen.add(a.url);
      return true;
    });

    // Sort by publishedAt descending
    deduped.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    if (category === "for-you") {
      articles = deduped;
    } else {
      articles = deduped.filter((a) => a.category === category);
    }

    // If we got very few results, mix in mock data
    if (articles.length < 3) {
      const mockFiltered =
        category === "for-you"
          ? MOCK_ARTICLES
          : MOCK_ARTICLES.filter((a) => a.category === category);
      articles = [...articles, ...mockFiltered].slice(0, 20);
    }
  } catch (err) {
    console.error("Feed API error, falling back to mock:", err);
    articles =
      category === "for-you"
        ? MOCK_ARTICLES
        : MOCK_ARTICLES.filter((a) => a.category === category);
  }

  const source =
    apiKey || articles.some((a) => a.id.startsWith("rss-"))
      ? "live"
      : "mock";

  return NextResponse.json({ articles, source });
}
