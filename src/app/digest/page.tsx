"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Moon,
  Loader2,
  Calendar,
  RefreshCw,
  Share2,
  Star,
  ArrowRight,
  Volume2,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { shareArticle } from "@/lib/share";
import { BriefingTabs } from "@/components/news/briefing-tabs";

interface DigestTopic {
  emoji: string;
  category: string;
  headline: string;
  summary: string;
}

interface DigestData {
  greeting: string;
  highlight: {
    emoji: string;
    headline: string;
    summary: string;
  };
  topics: DigestTopic[];
  outlook: string;
  goodnight: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Politik: "#EF4444",
  Wirtschaft: "#F59E0B",
  Sport: "#22C55E",
  Technologie: "#3B82F6",
  Wissenschaft: "#8B5CF6",
  Unterhaltung: "#EC4899",
  Gesundheit: "#14B8A6",
  Kultur: "#6366F1",
};

export default function DigestPage() {
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  async function fetchDigest() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/digest");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const parsed: DigestData = JSON.parse(data.digest);
      setDigest(parsed);
    } catch (err) {
      console.error("Digest fetch error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Digest konnte nicht geladen werden"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDigest();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  function digestToText(data: DigestData): string {
    const parts = [data.greeting];
    parts.push(`Top-Story: ${data.highlight.headline}. ${data.highlight.summary}`);
    for (const t of data.topics) {
      parts.push(`${t.category}: ${t.headline}. ${t.summary}`);
    }
    parts.push(`Ausblick: ${data.outlook}`);
    parts.push(data.goodnight);
    return parts.join("\n\n");
  }

  async function handleAudio() {
    if (!digest) return;
    if (audioRef.current && audioUrlRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }
    setAudioLoading(true);
    setAudioError(null);
    try {
      const text = digestToText(digest);
      const res = await fetch("/api/briefing/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.addEventListener("timeupdate", () => {
        if (audio.duration) setAudioProgress((audio.currentTime / audio.duration) * 100);
      });
      audio.addEventListener("ended", () => { setIsPlaying(false); setAudioProgress(0); });
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Audio error:", err);
      setAudioError(err instanceof Error ? err.message : "Audio-Generierung fehlgeschlagen");
    } finally {
      setAudioLoading(false);
    }
  }

  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={fetchDigest}
              disabled={loading}
            >
              <RefreshCw
                className={`size-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() =>
                shareArticle("MyNews Abend-Digest", window.location.href)
              }
            >
              <Share2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
        {/* Morgen / Abend Toggle */}
        <div className="mb-6">
          <BriefingTabs />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10">
              <Moon className="size-5 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Abend-Digest
              </h1>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="size-3.5" />
                <span>{today}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="border-0 bg-indigo-500/10 text-indigo-500"
            >
              <Moon className="mr-1 size-3" />
              Tagesrückblick
            </Badge>
            <span className="text-xs text-muted-foreground">
              Powered by Claude Sonnet
            </span>
          </div>

          {/* Audio Player */}
          {digest && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-4"
            >
              <button
                onClick={handleAudio}
                disabled={audioLoading}
                className="flex w-full items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 transition-colors hover:border-border"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10">
                  {audioLoading ? (
                    <Loader2 className="size-5 animate-spin text-indigo-500" />
                  ) : isPlaying ? (
                    <Pause className="size-5 text-indigo-500" />
                  ) : (
                    <Play className="ml-0.5 size-5 text-indigo-500" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">
                    {audioLoading
                      ? "Audio wird generiert..."
                      : isPlaying
                        ? "Digest wird vorgelesen"
                        : "Digest anhören"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {audioLoading
                      ? "OpenAI TTS"
                      : isPlaying
                        ? `${Math.round(audioProgress)}% abgespielt`
                        : "KI-Stimme · ca. 2 Min."}
                  </p>
                </div>
                <Volume2 className="size-4 shrink-0 text-muted-foreground" />
              </button>
              {(isPlaying || audioProgress > 0) && (
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${audioProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
              {audioError && (
                <p className="mt-2 text-xs text-destructive">
                  {audioError}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-4 py-20"
          >
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />
              <div className="relative flex size-16 items-center justify-center rounded-full bg-indigo-500/10">
                <Loader2 className="size-8 animate-spin text-indigo-500" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-medium">Dein Tagesrückblick wird erstellt...</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Claude fasst den Tag zusammen
              </p>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center"
          >
            <p className="font-medium text-destructive">
              Digest nicht verfügbar
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={fetchDigest}
            >
              <RefreshCw className="mr-1.5 size-3.5" />
              Erneut versuchen
            </Button>
          </motion.div>
        )}

        {/* Digest content */}
        {digest && !loading && (
          <div className="space-y-6">
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-5 py-4"
            >
              <p className="text-lg font-medium leading-relaxed">
                {digest.greeting}
              </p>
            </motion.div>

            {/* Highlight - Top Story */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="rounded-xl border-2 border-amber-500/30 bg-amber-500/5 p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <Star className="size-5 text-amber-500" />
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  Top-Story des Tages
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-3xl">{digest.highlight.emoji}</span>
                <div>
                  <h2 className="text-lg font-bold leading-snug">
                    {digest.highlight.headline}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {digest.highlight.summary}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Topics */}
            {digest.topics.map((topic, i) => {
              const color =
                CATEGORY_COLORS[topic.category] ?? "#0EA5E9";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.08 }}
                  className="rounded-xl border border-border/50 bg-card p-5 transition-colors hover:border-border"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{topic.emoji}</span>
                    <div>
                      <Badge
                        className="mb-1.5 border-0 text-xs text-white"
                        style={{ backgroundColor: color }}
                      >
                        {topic.category}
                      </Badge>
                      <h3 className="text-base font-semibold leading-snug">
                        {topic.headline}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {topic.summary}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Outlook */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.2 + digest.topics.length * 0.08,
              }}
              className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-4"
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <ArrowRight className="size-4 text-primary" />
                Ausblick auf morgen
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {digest.outlook}
              </p>
            </motion.div>

            {/* Goodnight */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.25 + digest.topics.length * 0.08,
              }}
            >
              <Separator className="mb-6" />
              <div className="rounded-xl bg-muted/50 px-5 py-4 text-center">
                <p className="text-sm font-medium">{digest.goodnight}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Erstellt um{" "}
                  {new Date().toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  Uhr · Powered by Claude Sonnet
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
