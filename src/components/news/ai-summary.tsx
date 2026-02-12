"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Article } from "@/types";
import {
  getCategoryColor,
  getCategoryLabel,
  getFeedReasonLabel,
} from "@/lib/mock-data";

interface AiSummaryProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

function SentimentBadge({ sentiment }: { sentiment?: string }) {
  const config = {
    positive: {
      label: "Positiv",
      className: "bg-sentiment-positive/10 text-sentiment-positive",
    },
    negative: {
      label: "Negativ",
      className: "bg-sentiment-negative/10 text-sentiment-negative",
    },
    neutral: {
      label: "Neutral",
      className: "bg-sentiment-neutral/10 text-sentiment-neutral",
    },
  };
  const c = config[sentiment as keyof typeof config] ?? config.neutral;
  return (
    <Badge variant="secondary" className={`border-0 text-xs ${c.className}`}>
      {c.label}
    </Badge>
  );
}

// Client-side summary cache
const summaryCache = new Map<
  string,
  { summary: string; sentiment: string }
>();

export function AiSummary({ article, isOpen, onClose }: AiSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [sentiment, setSentiment] = useState<string>("neutral");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !article) return;

    // Check client cache
    const cached = summaryCache.get(article.id);
    if (cached) {
      setSummary(cached.summary);
      setSentiment(cached.sentiment);
      return;
    }

    // Use existing aiSummary from article if available
    if (article.aiSummary) {
      setSummary(article.aiSummary);
      setSentiment(article.sentiment ?? "neutral");
      return;
    }

    // Fetch from API
    setLoading(true);
    setError(null);
    setSummary(null);

    fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: article.title,
        description: article.description,
        content: article.content,
        articleId: article.id,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setSummary(data.summary);
        setSentiment(data.sentiment ?? "neutral");
        summaryCache.set(article.id, {
          summary: data.summary,
          sentiment: data.sentiment ?? "neutral",
        });
      })
      .catch((err) => {
        console.error("Summary fetch error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [isOpen, article]);

  if (!article) return null;

  const categoryColor = getCategoryColor(article.category);
  const summaryPoints = summary
    ? summary.split(". ").filter((s) => s.trim().length > 0)
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg lg:bottom-8 lg:inset-x-auto lg:left-1/2 lg:w-[480px] lg:-translate-x-1/2"
          >
            <div className="relative overflow-hidden rounded-t-2xl border border-border/50 bg-card/95 shadow-2xl backdrop-blur-xl lg:rounded-2xl">
              {/* Category color bar */}
              <div
                className="h-1 w-full"
                style={{ backgroundColor: categoryColor }}
              />

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
                    <Sparkles className="size-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">
                      KI-Zusammenfassung
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      {loading
                        ? "Wird erstellt..."
                        : `Erstellt: ${new Date().toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })} · Claude Haiku`}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={onClose}
                  aria-label="Schließen"
                >
                  <X className="size-4" />
                </Button>
              </div>

              <Separator className="mx-5 w-auto" />

              {/* Summary content */}
              <div className="space-y-3 px-5 py-4">
                {loading && (
                  <div className="flex items-center justify-center gap-2 py-6">
                    <Loader2 className="size-5 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">
                      KI analysiert den Artikel...
                    </span>
                  </div>
                )}
                {error && (
                  <div className="rounded-lg bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
                    <p>Zusammenfassung nicht verfügbar.</p>
                    <p className="mt-1 text-xs opacity-70">{error}</p>
                  </div>
                )}
                {!loading && !error && summaryPoints.map((point, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className="mt-1.5 size-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: categoryColor }}
                    />
                    <p className="text-sm leading-relaxed">
                      {point.endsWith(".") ? point : `${point}.`}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="mx-5 w-auto" />

              {/* Meta row */}
              <div className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2">
                  <SentimentBadge sentiment={loading ? undefined : sentiment} />
                  <Badge
                    variant="secondary"
                    className="border-0 text-xs"
                    style={{ color: categoryColor }}
                  >
                    {getCategoryLabel(article.category)}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  Quelle: {article.sourceName}
                </span>
              </div>

              <Separator className="mx-5 w-auto" />

              {/* Actions */}
              <div className="flex items-center gap-2 px-5 py-3 pb-5">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 gap-1.5"
                  asChild
                >
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-3.5" />
                    Original lesen
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <HelpCircle className="size-3.5" />
                  Warum sehe ich das?
                </Button>
              </div>

              {/* Feed reason tooltip */}
              <div className="bg-muted/50 px-5 py-2.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="size-3" />
                  <span>{getFeedReasonLabel(article.feedReason)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
