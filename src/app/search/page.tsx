"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search, X, Clock, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Article, Category } from "@/types";
import { cacheArticles } from "@/lib/article-cache";
import {
  getCategoryColor,
  getCategoryLabel,
  formatTimeAgo,
  CATEGORIES,
} from "@/lib/mock-data";

type DateFilter = "all" | "today" | "week" | "month";

const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "today", label: "Heute" },
  { value: "week", label: "Diese Woche" },
  { value: "month", label: "Dieser Monat" },
];

function isWithinDateRange(publishedAt: string, range: DateFilter): boolean {
  if (range === "all") return true;
  const now = Date.now();
  const pub = new Date(publishedAt).getTime();
  const diff = now - pub;
  if (range === "today") return diff < 24 * 60 * 60 * 1000;
  if (range === "week") return diff < 7 * 24 * 60 * 60 * 1000;
  return diff < 30 * 24 * 60 * 60 * 1000;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

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

  const activeFilterCount =
    (categoryFilter !== "all" ? 1 : 0) + (dateFilter !== "all" ? 1 : 0);

  const results = useMemo(() => {
    let filtered = articles;

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((a) => a.category === categoryFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      filtered = filtered.filter((a) => isWithinDateRange(a.publishedAt, dateFilter));
    }

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.sourceName.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [query, articles, categoryFilter, dateFilter]);

  // Show results when there's a query or active filters
  const hasActiveSearch = query.trim() || categoryFilter !== "all" || dateFilter !== "all";

  return (
    <div className="min-h-screen bg-background">
      {/* Search header */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4">
          <div className="flex h-14 items-center gap-3">
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
            <Button
              variant={showFilters ? "default" : "ghost"}
              size="icon"
              className="relative size-10 shrink-0"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="size-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border/30 pb-4"
            >
              {/* Category filters */}
              <div className="pt-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Kategorie
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setCategoryFilter("all")}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      categoryFilter === "all"
                        ? "bg-primary text-white"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Alle
                  </button>
                  {CATEGORIES.filter((c) => c.id !== "for-you").map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setCategoryFilter(
                          categoryFilter === cat.id ? "all" : cat.id
                        )
                      }
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        categoryFilter === cat.id
                          ? "text-white"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                      style={
                        categoryFilter === cat.id
                          ? { backgroundColor: cat.color }
                          : undefined
                      }
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date filters */}
              <div className="mt-3">
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  Zeitraum
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DATE_FILTERS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setDateFilter(f.value)}
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        dateFilter === f.value
                          ? "bg-primary text-white"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {f.value !== "all" && <Clock className="size-3" />}
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setCategoryFilter("all");
                    setDateFilter("all");
                  }}
                  className="mt-3 text-xs text-primary hover:underline"
                >
                  Filter zurücksetzen
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 pb-24 lg:px-8">
        {!hasActiveSearch && (
          <div className="py-16 text-center">
            <Search className="mx-auto mb-3 size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Durchsuche {articles.length} aktuelle Artikel
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Nutze die Filter für gezieltere Ergebnisse
            </p>
          </div>
        )}

        {hasActiveSearch && results.length === 0 && !loading && (
          <div className="py-16 text-center">
            <p className="font-medium">Keine Ergebnisse</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {query.trim()
                ? `Für "${query}" wurden keine Artikel gefunden.`
                : "Keine Artikel für die gewählten Filter."}
            </p>
          </div>
        )}

        {hasActiveSearch && results.length > 0 && (
          <div className="space-y-3">
            <p className="mb-4 text-sm text-muted-foreground">
              {results.length} Ergebnis{results.length !== 1 ? "se" : ""}
              {query.trim() ? ` für "${query}"` : ""}
              {categoryFilter !== "all"
                ? ` in ${getCategoryLabel(categoryFilter)}`
                : ""}
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
                        {article.sourceName} ·{" "}
                        {formatTimeAgo(article.publishedAt)}
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
