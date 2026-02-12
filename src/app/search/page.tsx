"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/types";
import { cacheArticles, getCachedArticle } from "@/lib/article-cache";
import { getCategoryColor, getCategoryLabel, formatTimeAgo } from "@/lib/mock-data";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feed?category=for-you")
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles ?? []);
        cacheArticles(data.articles ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.sourceName.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [query, articles]);

  return (
    <div className="min-h-screen bg-background">
      {/* Search header */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
          <Link
            href="/"
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Artikel durchsuchen..."
              autoFocus
              className="h-10 w-full rounded-lg border border-border/50 bg-muted/50 pl-10 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 pb-24 lg:px-8">
        {!query.trim() && (
          <div className="py-16 text-center">
            <Search className="mx-auto mb-3 size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Durchsuche {articles.length} aktuelle Artikel
            </p>
          </div>
        )}

        {query.trim() && results.length === 0 && !loading && (
          <div className="py-16 text-center">
            <p className="font-medium">Keine Ergebnisse</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Für &ldquo;{query}&rdquo; wurden keine Artikel gefunden.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <p className="mb-4 text-sm text-muted-foreground">
              {results.length} Ergebnis{results.length !== 1 ? "se" : ""} für &ldquo;{query}&rdquo;
            </p>
            {results.map((article, i) => {
              const color = getCategoryColor(article.category);
              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                >
                  <Link
                    href={`/article/${article.id}`}
                    className="block rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-border"
                  >
                    <div className="mb-1.5 flex items-center gap-2">
                      <Badge
                        className="border-0 text-xs text-white"
                        style={{ backgroundColor: color }}
                      >
                        {getCategoryLabel(article.category)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {article.sourceName} · {formatTimeAgo(article.publishedAt)}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold leading-snug">
                      {article.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {article.description}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
