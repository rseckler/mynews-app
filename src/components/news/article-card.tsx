"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Clock,
  HelpCircle,
  TrendingUp,
  Compass,
  Heart,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Article, ArticleVariant } from "@/types";
import {
  getCategoryColor,
  getCategoryLabel,
  formatTimeAgo,
  getFeedReasonLabel,
} from "@/lib/mock-data";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";
import { shareArticle } from "@/lib/share";
import { getFeedback, setFeedback, type FeedbackType } from "@/lib/feedback";

interface ArticleCardProps {
  article: Article;
  variant?: ArticleVariant;
  onSummaryClick?: (article: Article) => void;
}

function FeedReasonIcon({ reason }: { reason: string }) {
  switch (reason) {
    case "trending":
      return <TrendingUp className="size-3" />;
    case "discover":
      return <Compass className="size-3" />;
    default:
      return <Heart className="size-3" />;
  }
}

export function ArticleCard({
  article,
  variant = "standard",
  onSummaryClick,
}: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(article.id));
  const [feedback, setFeedbackState] = useState<FeedbackType>(() => getFeedback(article.id));

  function handleFeedback(type: "like" | "dislike") {
    const result = setFeedback(article.id, type);
    setFeedbackState(result);
  }
  const categoryColor = getCategoryColor(article.category);
  const categoryLabel = getCategoryLabel(article.category);
  const timeAgo = formatTimeAgo(article.publishedAt);

  if (variant === "featured") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="group relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm transition-all duration-200 hover:shadow-md"
      >
        {/* Image */}
        {article.imageUrl && !imageError && (
          <div className="relative aspect-[2/1] w-full overflow-hidden">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Breaking badge */}
            {article.isBreaking && (
              <div className="absolute top-3 left-3">
                <Badge className="animate-pulse border-0 bg-destructive text-white">
                  EILMELDUNG
                </Badge>
              </div>
            )}

            {/* Category badge on image */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <Badge
                className="border-0 text-white"
                style={{ backgroundColor: categoryColor }}
              >
                {categoryLabel}
              </Badge>
              <span className="text-xs text-white/80">{timeAgo}</span>
            </div>
          </div>
        )}

        <div className="p-4 lg:p-5">
          {/* Source */}
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">
              {article.sourceName}
            </span>
            {!article.imageUrl && (
              <>
                <span>·</span>
                <span>{timeAgo}</span>
              </>
            )}
          </div>

          {/* Headline */}
          <Link href={`/article/${article.id}`}>
            <h2 className="mb-2 text-xl font-semibold leading-tight tracking-tight transition-colors hover:text-primary lg:text-2xl">
              {article.title}
            </h2>
          </Link>

          {/* Description */}
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {article.description}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs text-primary hover:text-primary"
                onClick={() => onSummaryClick?.(article)}
              >
                <Sparkles className="size-3.5" />
                KI-Zusammenfassung
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("size-8", bookmarked ? "text-primary" : "text-muted-foreground")}
                    onClick={() => setBookmarked(toggleBookmark(article))}
                  >
                    {bookmarked ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{bookmarked ? "Gespeichert" : "Merken"}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground"
                    onClick={() => shareArticle(article.title, article.url)}
                  >
                    <ExternalLink className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Teilen</TooltipContent>
              </Tooltip>
              <div className="ml-1 flex items-center gap-0.5 border-l border-border/50 pl-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("size-7", feedback === "like" ? "text-green-500" : "text-muted-foreground")}
                      onClick={() => handleFeedback("like")}
                    >
                      <ThumbsUp className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Hilfreich</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("size-7", feedback === "dislike" ? "text-red-500" : "text-muted-foreground")}
                      onClick={() => handleFeedback("dislike")}
                    >
                      <ThumbsDown className="size-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Nicht hilfreich</TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center gap-1 transition-colors hover:text-foreground">
                    <FeedReasonIcon reason={article.feedReason} />
                    <HelpCircle className="size-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {getFeedReasonLabel(article.feedReason)}
                </TooltipContent>
              </Tooltip>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {article.readTimeMinutes} Min.
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  if (variant === "compact") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent/50"
      >
        <div
          className="mt-1.5 h-5 w-1 shrink-0 rounded-full"
          style={{ backgroundColor: categoryColor }}
        />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">{article.sourceName}</span>
            <span>·</span>
            <span>{timeAgo}</span>
          </div>
          <Link href={`/article/${article.id}`}>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors hover:text-primary">
              {article.title}
            </h3>
          </Link>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
              style={{ backgroundColor: categoryColor }}
            >
              {categoryLabel}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {article.readTimeMinutes} Min.
            </span>
          </div>
        </div>
      </motion.article>
    );
  }

  // Standard variant
  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-200 hover:shadow-md"
    >
      <div className="flex gap-0">
        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col p-4">
          {/* Source row */}
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">
              {article.sourceName}
            </span>
            <span>·</span>
            <span>{timeAgo}</span>
            {article.isBreaking && (
              <Badge
                variant="destructive"
                className="ml-auto h-5 animate-pulse text-[10px]"
              >
                EILMELDUNG
              </Badge>
            )}
          </div>

          {/* Headline */}
          <Link href={`/article/${article.id}`}>
            <h3 className="mb-1.5 line-clamp-2 text-base font-semibold leading-snug tracking-tight transition-colors hover:text-primary">
              {article.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {article.description}
          </p>

          {/* Bottom row */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Badge
                variant="secondary"
                className="h-5 border-0 px-1.5 text-[10px] font-medium"
                style={{ color: categoryColor }}
              >
                {categoryLabel}
              </Badge>
              {article.tags.slice(0, 1).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="h-5 border-0 px-1.5 text-[10px]"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-primary"
                onClick={() => onSummaryClick?.(article)}
                aria-label="KI-Zusammenfassung"
              >
                <Sparkles className="size-3.5" />
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center gap-0.5 px-1 text-[10px] text-muted-foreground transition-colors hover:text-foreground">
                    <FeedReasonIcon reason={article.feedReason} />
                    <HelpCircle className="size-2.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {getFeedReasonLabel(article.feedReason)}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Thumbnail */}
        {article.imageUrl && !imageError && (
          <div className="relative hidden w-32 shrink-0 sm:block">
            <Image
              src={article.imageUrl}
              alt=""
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              onError={() => setImageError(true)}
              sizes="128px"
            />
          </div>
        )}
      </div>
    </motion.article>
  );
}
