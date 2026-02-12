"use client";

import { useState, useEffect, useCallback } from "react";
import { ArticleCard } from "./article-card";
import { AiSummary } from "./ai-summary";
import { CategoryTabs } from "./category-tabs";
import { TrendingTopics } from "./trending-topics";
import { BreakingNewsBanner } from "./breaking-news-banner";
import { MOCK_ARTICLES } from "@/lib/mock-data";
import { cacheArticles } from "@/lib/article-cache";
import type { Article, Category } from "@/types";

export function Feed() {
  const [activeCategory, setActiveCategory] = useState<Category>("for-you");
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"live" | "mock">("mock");
  const [summaryArticle, setSummaryArticle] = useState<Article | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const fetchArticles = useCallback(async (category: Category) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/feed?category=${category}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setArticles(data.articles);
      setSource(data.source);
      cacheArticles(data.articles);
    } catch (err) {
      console.error("Feed fetch error:", err);
      // Fallback to mock data
      const fallback =
        category === "for-you"
          ? MOCK_ARTICLES
          : MOCK_ARTICLES.filter((a) => a.category === category);
      setArticles(fallback);
      setSource("mock");
      cacheArticles(fallback);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles(activeCategory);
  }, [activeCategory, fetchArticles]);

  const breakingArticle = articles.find((a) => a.isBreaking) ?? null;
  const featuredArticle = articles[0];
  const standardArticles = articles.slice(1, 7);
  const compactArticles = articles.slice(7);

  function handleSummaryClick(article: Article) {
    setSummaryArticle(article);
    setSummaryOpen(true);
  }

  function handleCategoryChange(category: Category) {
    setActiveCategory(category);
  }

  return (
    <>
      {/* Breaking News */}
      <BreakingNewsBanner article={breakingArticle} />

      {/* Category Navigation */}
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Source indicator */}
      {!loading && (
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div
              className={`size-1.5 rounded-full ${source === "live" ? "bg-green-500" : "bg-amber-500"}`}
            />
            <span>
              {source === "live"
                ? "Live-Nachrichten via NewsAPI"
                : "Demo-Daten (kein API-Key)"}
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Feed Column */}
          <div className="space-y-4">
            {loading ? (
              <FeedSkeleton />
            ) : (
              <>
                {/* Featured Article */}
                {featuredArticle && (
                  <ArticleCard
                    article={featuredArticle}
                    variant="featured"
                    onSummaryClick={handleSummaryClick}
                  />
                )}

                {/* Standard Articles Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {standardArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="standard"
                      onSummaryClick={handleSummaryClick}
                    />
                  ))}
                </div>

                {/* Compact Articles */}
                {compactArticles.length > 0 && (
                  <div className="rounded-xl border border-border/50 bg-card">
                    <div className="px-4 pt-4 pb-2">
                      <h3 className="text-sm font-semibold text-muted-foreground">
                        Weitere Meldungen
                      </h3>
                    </div>
                    <div className="divide-y divide-border/50">
                      {compactArticles.map((article) => (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          variant="compact"
                          onSummaryClick={handleSummaryClick}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar (Desktop) */}
          <aside className="hidden space-y-4 lg:block">
            <TrendingTopics />

            {/* Info Box */}
            <div className="rounded-xl border border-border/50 bg-card p-4">
              <h3 className="mb-2 text-sm font-semibold">
                Über MyNews.com
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                MyNews.com kuratiert Nachrichten aus vertrauenswürdigen Quellen
                und fasst sie mit KI zusammen. Alle AI-generierten Inhalte sind
                gekennzeichnet.
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <div
                  className={`size-1.5 rounded-full ${source === "live" ? "bg-green-500" : "bg-amber-500"}`}
                />
                <span>
                  {source === "live"
                    ? `${articles.length} Artikel geladen`
                    : "12 Demo-Artikel"}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* AI Summary Overlay */}
      <AiSummary
        article={summaryArticle}
        isOpen={summaryOpen}
        onClose={() => setSummaryOpen(false)}
      />
    </>
  );
}

/** Loading skeleton for the feed */
function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {/* Featured skeleton */}
      <div className="animate-pulse rounded-xl bg-muted/50">
        <div className="aspect-[16/9] rounded-t-xl bg-muted" />
        <div className="space-y-3 p-4">
          <div className="h-5 w-3/4 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
        </div>
      </div>

      {/* Standard grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-border/50 bg-card p-4">
            <div className="mb-3 flex gap-3">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
              </div>
              <div className="size-20 shrink-0 rounded-lg bg-muted" />
            </div>
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
