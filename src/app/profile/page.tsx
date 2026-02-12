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
  ChevronDown,
  ChevronUp,
  Sparkles,
  Shield,
  Rss,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getBookmarks } from "@/lib/bookmarks";
import { getFeedGroups, RSS_FEEDS } from "@/lib/news/rss-feeds";
import { CATEGORIES } from "@/lib/mock-data";
import type { Category } from "@/types";

const SOURCES_KEY = "mynews-disabled-sources";

function getDisabledSources(): string[] {
  try {
    const raw = localStorage.getItem(SOURCES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setDisabledSources(sources: string[]) {
  localStorage.setItem(SOURCES_KEY, JSON.stringify(sources));
}

const SELECTABLE_CATEGORIES = CATEGORIES.filter((c) => c.id !== "for-you");

export default function ProfilePage() {
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [interestsOpen, setInterestsOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<Category[]>([]);
  const [disabledSources, setDisabledState] = useState<string[]>([]);

  useEffect(() => {
    setBookmarkCount(getBookmarks().length);
    setIsDark(document.documentElement.classList.contains("dark"));
    setDisabledState(getDisabledSources());
    // Load saved interests
    try {
      const raw = localStorage.getItem("mynews-interests");
      if (raw) setSelectedInterests(JSON.parse(raw));
    } catch {}
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("mynews-theme", next ? "dark" : "light");
  }

  function toggleInterest(id: Category) {
    const updated = selectedInterests.includes(id)
      ? selectedInterests.filter((c) => c !== id)
      : [...selectedInterests, id];
    setSelectedInterests(updated);
    localStorage.setItem("mynews-interests", JSON.stringify(updated));
  }

  function toggleSource(name: string) {
    const updated = disabledSources.includes(name)
      ? disabledSources.filter((s) => s !== name)
      : [...disabledSources, name];
    setDisabledState(updated);
    setDisabledSources(updated);
  }

  const feedGroups = getFeedGroups();
  const activeCount = RSS_FEEDS.length - disabledSources.length;

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
        <div className="mb-6 grid grid-cols-3 gap-3">
          <Link
            href="/saved"
            className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-border"
          >
            <BookmarkCheck className="size-5 text-primary" />
            <div className="text-center">
              <p className="text-sm font-semibold">{bookmarkCount}</p>
              <p className="text-xs text-muted-foreground">Gespeichert</p>
            </div>
          </Link>
          <Link
            href="/briefing"
            className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-border"
          >
            <Sparkles className="size-5 text-primary" />
            <div className="text-center">
              <p className="text-sm font-semibold">Morgen</p>
              <p className="text-xs text-muted-foreground">Briefing</p>
            </div>
          </Link>
          <Link
            href="/digest"
            className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card p-4 transition-colors hover:border-border"
          >
            <Moon className="size-5 text-indigo-500" />
            <div className="text-center">
              <p className="text-sm font-semibold">Abend</p>
              <p className="text-xs text-muted-foreground">Digest</p>
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

          <button
            onClick={() => setInterestsOpen(!interestsOpen)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <Settings className="size-5" />
              <span className="text-sm font-medium">Interessen anpassen</span>
            </div>
            {interestsOpen ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </button>

          {interestsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="px-3 pb-3"
            >
              <p className="mb-3 text-xs text-muted-foreground">
                Wähle die Kategorien, die dich interessieren. Dein Feed wird entsprechend angepasst.
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SELECTABLE_CATEGORIES.map((cat) => {
                  const isSelected = selectedInterests.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleInterest(cat.id)}
                      className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2.5 text-sm font-medium transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div
                        className="flex size-6 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: isSelected ? cat.color : `${cat.color}20`,
                        }}
                      >
                        {isSelected && <Check className="size-3.5 text-white" />}
                      </div>
                      <span className={isSelected ? "text-foreground" : "text-muted-foreground"}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {selectedInterests.length} von {SELECTABLE_CATEGORIES.length} Kategorien ausgewählt
              </p>
            </motion.div>
          )}

          <button className="flex w-full items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Shield className="size-5" />
              <span className="text-sm font-medium">Datenschutz</span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        </div>

        <Separator className="my-6" />

        {/* Source Management */}
        <div className="rounded-xl border border-border/50 bg-card">
          <button
            onClick={() => setSourcesOpen(!sourcesOpen)}
            className="flex w-full items-center justify-between px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <Rss className="size-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-semibold">Nachrichtenquellen</p>
                <p className="text-xs text-muted-foreground">
                  {activeCount} von {RSS_FEEDS.length} Quellen aktiv
                </p>
              </div>
            </div>
            {sourcesOpen ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </button>

          {sourcesOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Separator />
              <div className="space-y-4 p-4">
                {feedGroups.map((group) => (
                  <div key={group.group}>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.group}
                    </h4>
                    <div className="space-y-1">
                      {group.feeds.map((feed) => {
                        const isActive = !disabledSources.includes(feed.name);
                        return (
                          <button
                            key={feed.name}
                            onClick={() => toggleSource(feed.name)}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-muted/50"
                          >
                            <span className={`text-sm ${isActive ? "font-medium" : "text-muted-foreground"}`}>
                              {feed.name}
                            </span>
                            {isActive ? (
                              <div className="flex size-6 items-center justify-center rounded-full bg-green-500/10">
                                <Check className="size-3.5 text-green-500" />
                              </div>
                            ) : (
                              <div className="flex size-6 items-center justify-center rounded-full bg-muted">
                                <X className="size-3.5 text-muted-foreground" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  Deaktivierte Quellen erscheinen nicht mehr im Feed.
                  Änderungen werden beim nächsten Laden wirksam.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        <Separator className="my-6" />

        {/* Footer info */}
        <div className="text-center text-xs text-muted-foreground">
          <p>MyNews.com · Version 1.0 Prototyp</p>
          <p className="mt-1">
            Powered by Claude AI · Daten via NewsAPI + RSS
          </p>
        </div>
      </div>
    </div>
  );
}
