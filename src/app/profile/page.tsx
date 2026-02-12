"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookmarkCheck,
  Settings,
  Sun,
  Moon,
  ChevronRight,
  Sparkles,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getBookmarks } from "@/lib/bookmarks";

export default function ProfilePage() {
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setBookmarkCount(getBookmarks().length);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("mynews-theme", next ? "dark" : "light");
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-3xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Zurück
          </Link>
          <Settings className="size-4 text-muted-foreground" />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-4"
        >
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            <span className="text-2xl font-bold text-primary">N</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">News-Leser</h1>
            <p className="text-sm text-muted-foreground">
              Personalisierte Nachrichten seit heute
            </p>
          </div>
        </motion.div>

        {/* Quick actions */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <Link
            href="/saved"
            className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-border"
          >
            <BookmarkCheck className="size-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">{bookmarkCount} Gespeichert</p>
              <p className="text-xs text-muted-foreground">Artikel</p>
            </div>
          </Link>
          <Link
            href="/briefing"
            className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-border"
          >
            <Sparkles className="size-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Briefing</p>
              <p className="text-xs text-muted-foreground">Tages-Update</p>
            </div>
          </Link>
        </div>

        <Separator className="mb-6" />

        {/* Settings list */}
        <div className="space-y-1">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
              <span className="text-sm font-medium">
                {isDark ? "Dark Mode" : "Light Mode"}
              </span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>

          <button className="flex w-full items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Settings className="size-5" />
              <span className="text-sm font-medium">Interessen anpassen</span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>

          <button className="flex w-full items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Shield className="size-5" />
              <span className="text-sm font-medium">Datenschutz</span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        </div>

        <Separator className="my-6" />

        {/* Footer info */}
        <div className="text-center text-xs text-muted-foreground">
          <p>MyNews.com · Version 1.0 Prototyp</p>
          <p className="mt-1">
            Powered by Claude AI · Daten via NewsAPI
          </p>
        </div>
      </div>
    </div>
  );
}
