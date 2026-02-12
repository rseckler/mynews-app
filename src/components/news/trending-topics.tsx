"use client";

import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCategoryColor, TRENDING_TOPICS } from "@/lib/mock-data";
import type { Article, Category, TrendingTopic } from "@/types";

interface TrendingTopicsProps {
  articles?: Article[];
}

/** Extract trending topics from live articles by counting source names and picking top keywords */
function extractTopics(articles: Article[]): TrendingTopic[] {
  if (articles.length === 0) return TRENDING_TOPICS;

  // Count articles per category (excluding "for-you")
  const catCount = new Map<Category, number>();
  for (const a of articles) {
    if (a.category !== "for-you") {
      catCount.set(a.category, (catCount.get(a.category) ?? 0) + 1);
    }
  }

  // Extract most-mentioned keywords from titles
  const wordCount = new Map<string, { count: number; category: Category }>();
  const stopWords = new Set([
    "der", "die", "das", "und", "in", "von", "zu", "für", "mit", "auf",
    "ist", "im", "den", "des", "ein", "eine", "als", "an", "nach", "aus",
    "wird", "hat", "sich", "bei", "nicht", "über", "wie", "vor", "oder",
    "auch", "zum", "zur", "bis", "dem", "noch", "werden", "um", "es",
    "sind", "kann", "neue", "neuer", "neues", "mehr", "nun", "soll",
    "laut", "news", "dass", "was", "wer", "war", "aber", "so", "the",
    "and", "for", "that", "this", "with", "from", "have", "has", "will",
  ]);

  for (const a of articles) {
    const words = a.title
      .replace(/[^\w\sÄÖÜäöüß-]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopWords.has(w.toLowerCase()));

    for (const word of words) {
      const key = word.charAt(0).toUpperCase() + word.slice(1);
      const existing = wordCount.get(key);
      if (existing) {
        existing.count++;
      } else {
        wordCount.set(key, { count: 1, category: a.category });
      }
    }
  }

  // Sort by frequency, take top 6
  const sorted = [...wordCount.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6);

  return sorted.map(([label, { count, category }], i) => ({
    id: `live-${i}`,
    label,
    articleCount: count,
    category,
  }));
}

export function TrendingTopics({ articles }: TrendingTopicsProps) {
  const topics = articles ? extractTopics(articles) : TRENDING_TOPICS;

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Trending</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <button key={topic.id} className="group">
            <Badge
              variant="secondary"
              className="cursor-pointer border-0 transition-colors group-hover:bg-primary/10 group-hover:text-primary"
            >
              <span
                className="mr-1.5 inline-block size-1.5 rounded-full"
                style={{ backgroundColor: getCategoryColor(topic.category) }}
              />
              {topic.label}
              <span className="ml-1.5 text-muted-foreground">
                {topic.articleCount}
              </span>
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}
