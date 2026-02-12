import { NextResponse } from "next/server";
import { fetchTopHeadlines } from "@/lib/news/newsapi";
import { MOCK_ARTICLES } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "for-you";

  const apiKey = process.env.NEWSAPI_KEY;

  let articles;

  if (apiKey) {
    try {
      const allArticles = await fetchTopHeadlines(apiKey, "de", 8);

      if (category === "for-you") {
        articles = allArticles;
      } else {
        articles = allArticles.filter((a) => a.category === category);
      }

      // If we got very few results, mix in some mock data
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
  } else {
    // No API key — use mock data
    articles =
      category === "for-you"
        ? MOCK_ARTICLES
        : MOCK_ARTICLES.filter((a) => a.category === category);
  }

  return NextResponse.json({ articles, source: apiKey ? "live" : "mock" });
}
