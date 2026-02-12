"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookmarkCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/types";
import { getBookmarks, removeBookmark } from "@/lib/bookmarks";
import { getCategoryColor, getCategoryLabel, formatTimeAgo } from "@/lib/mock-data";

export default function SavedPage() {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  function handleRemove(id: string) {
    removeBookmark(id);
    setBookmarks((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
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
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
        <div className="mb-6 flex items-center gap-2">
          <BookmarkCheck className="size-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">
            Gespeicherte Artikel
          </h1>
          <Badge variant="secondary" className="ml-1">
            {bookmarks.length}
          </Badge>
        </div>

        {bookmarks.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card px-6 py-16 text-center">
            <BookmarkCheck className="mx-auto mb-3 size-8 text-muted-foreground" />
            <p className="font-medium">Noch keine Artikel gespeichert</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tippe auf das Lesezeichen-Symbol, um Artikel zu speichern.
            </p>
            <Link href="/">
              <Button variant="default" size="sm" className="mt-4">
                Zum Feed
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((article, i) => {
              const color = getCategoryColor(article.category);
              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.05 }}
                  className="group flex items-start gap-4 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-border"
                >
                  <Link href={`/article/${article.id}`} className="flex-1">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemove(article.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
