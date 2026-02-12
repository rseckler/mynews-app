"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Clock,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  Share2,
  ChevronDown,
  ChevronUp,
  Info,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Article } from "@/types";
import {
  getCategoryColor,
  getCategoryLabel,
  formatTimeAgo,
  getFeedReasonLabel,
} from "@/lib/mock-data";
import { getArticleContent } from "@/lib/mock-content";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";

interface ArticleDetailProps {
  article: Article;
}

function SentimentDot({ sentiment }: { sentiment?: string }) {
  const color =
    sentiment === "positive"
      ? "bg-sentiment-positive"
      : sentiment === "negative"
        ? "bg-sentiment-negative"
        : "bg-sentiment-neutral";
  const label =
    sentiment === "positive"
      ? "Positiv"
      : sentiment === "negative"
        ? "Negativ"
        : "Neutral";
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={`size-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}

export function ArticleDetail({ article }: ArticleDetailProps) {
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [whyOpen, setWhyOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(article.id));
  const [aiSummary, setAiSummary] = useState<string | null>(article.aiSummary ?? null);
  const [aiSentiment, setAiSentiment] = useState<string | undefined>(article.sentiment);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const categoryColor = getCategoryColor(article.category);
  const categoryLabel = getCategoryLabel(article.category);
  const contentParagraphs = getArticleContent(article.id);

  // Fetch AI summary on mount if not available
  useEffect(() => {
    if (aiSummary) return;

    setSummaryLoading(true);
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
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !data.error) {
          setAiSummary(data.summary);
          setAiSentiment(data.sentiment);
        }
      })
      .catch(() => {})
      .finally(() => setSummaryLoading(false));
  }, [article, aiSummary]);

  const summaryPoints = aiSummary
    ? aiSummary.split(". ").filter((s) => s.trim().length > 0)
    : [];

  return (
    <div className="bg-background pb-20 lg:pb-0">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Zurück
          </Link>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={`size-8 ${bookmarked ? "text-primary" : ""}`}
              onClick={() => setBookmarked(toggleBookmark(article))}
            >
              {bookmarked ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="size-8">
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-6 lg:px-8 lg:pt-10">
        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4 flex flex-wrap items-center gap-2 text-sm"
        >
          <Badge
            className="border-0 text-white"
            style={{ backgroundColor: categoryColor }}
          >
            {categoryLabel}
          </Badge>
          <span className="text-muted-foreground">
            {article.sourceName}
          </span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            {formatTimeAgo(article.publishedAt)}
          </span>
          {article.author && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{article.author}</span>
            </>
          )}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl"
        >
          {article.title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mb-6 text-lg leading-relaxed text-muted-foreground"
        >
          {article.description}
        </motion.p>

        {/* Image */}
        {article.imageUrl && !imageError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl"
          >
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </motion.div>
        )}

        {/* AI Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="mb-8 overflow-hidden rounded-xl border border-primary/20 bg-primary/5"
        >
          <button
            onClick={() => setSummaryOpen(!summaryOpen)}
            className="flex w-full items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span className="text-sm font-semibold">
                KI-Zusammenfassung
              </span>
              <Badge
                variant="secondary"
                className="h-5 border-0 bg-primary/10 px-1.5 text-[10px] text-primary"
              >
                AI
              </Badge>
            </div>
            {summaryOpen ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </button>

          {summaryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Separator className="bg-primary/10" />
              <div className="space-y-3 px-4 py-4">
                {summaryLoading && (
                  <div className="flex items-center justify-center gap-2 py-4">
                    <Loader2 className="size-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">
                      KI analysiert den Artikel...
                    </span>
                  </div>
                )}
                {!summaryLoading && summaryPoints.length === 0 && (
                  <p className="py-2 text-center text-sm text-muted-foreground">
                    Zusammenfassung nicht verfügbar.
                  </p>
                )}
                {!summaryLoading && summaryPoints.map((point, i) => (
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
              <div className="flex items-center justify-between border-t border-primary/10 px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <SentimentDot sentiment={aiSentiment} />
                  <span className="text-[10px] text-muted-foreground">
                    Erstellt:{" "}
                    {new Date().toLocaleDateString("de-DE")} · Claude Haiku
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Article content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mb-8 space-y-4"
        >
          {contentParagraphs.length > 0 ? (
            contentParagraphs.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed">
                {paragraph}
              </p>
            ))
          ) : (
            <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
              <p>
                Der vollständige Artikel ist beim Originalverlag verfügbar.
              </p>
            </div>
          )}
        </motion.div>

        <Separator className="mb-6" />

        {/* Source link */}
        <div className="mb-6">
          <button
            onClick={() => window.open(article.url, "_blank")}
            className="inline-flex h-11 items-center gap-2 rounded-lg px-6 text-sm font-semibold text-white shadow-md transition-colors hover:opacity-90 print:!bg-[#0EA5E9]"
            style={{ backgroundColor: "#0EA5E9", color: "#FFFFFF", border: "none" }}
          >
            <ExternalLink className="size-4" />
            Original bei {article.sourceName} lesen
          </button>
        </div>

        {/* "Warum sehe ich das?" */}
        <div className="rounded-xl border border-border/50 bg-card">
          <button
            onClick={() => setWhyOpen(!whyOpen)}
            className="flex w-full items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-2 text-sm">
              <HelpCircle className="size-4 text-muted-foreground" />
              <span className="font-medium">
                Warum sehe ich das?
              </span>
            </div>
            {whyOpen ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </button>

          {whyOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Separator />
              <div className="space-y-3 px-4 py-4">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">
                      {getFeedReasonLabel(article.feedReason)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {article.feedReason === "interest" &&
                        `Dieser Artikel passt zu deinen gewählten Interessen im Bereich "${categoryLabel}".`}
                      {article.feedReason === "trending" &&
                        "Dieser Artikel wird gerade von vielen Nutzern gelesen und ist ein aktuelles Trend-Thema."}
                      {article.feedReason === "discover" &&
                        "Dieser Artikel kommt aus einer Kategorie außerhalb deiner üblichen Interessen, um deinen Horizont zu erweitern."}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    MyNews.com verwendet keine personenbezogenen Daten für
                    Empfehlungen. Die Personalisierung basiert ausschließlich
                    auf deinen gewählten Interessenkategorien.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {article.readTimeMinutes} Min. Lesezeit
          </span>
        </div>
      </article>
    </div>
  );
}
