"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Calendar,
  RefreshCw,
  Share2,
  Volume2,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { shareArticle } from "@/lib/share";
import { BriefingTabs } from "@/components/news/briefing-tabs";

interface BriefingTopic {
  emoji: string;
  category: string;
  headline: string;
  summary: string;
  source: string;
}

interface BriefingData {
  greeting: string;
  topics: BriefingTopic[];
  outro: string;
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

export default function BriefingPage() {
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  async function fetchBriefing() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/briefing");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const parsed: BriefingData = JSON.parse(data.briefing);
      setBriefing(parsed);
    } catch (err) {
      console.error("Briefing fetch error:", err);
      setError(
        err instanceof Error ? err.message : "Briefing konnte nicht geladen werden"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBriefing();
    return () => {
      // Cleanup audio on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  /** Convert briefing to readable text for TTS */
  function briefingToText(data: BriefingData): string {
    const parts = [data.greeting];
    for (const t of data.topics) {
      parts.push(`${t.category}: ${t.headline}. ${t.summary}`);
    }
    parts.push(data.outro);
    return parts.join("\n\n");
  }

  async function handleAudio() {
    if (!briefing) return;

    // If already playing, toggle pause/play
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

    // Create Audio element immediately during user gesture to unlock playback
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    });
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setAudioProgress(0);
    });

    // Generate audio
    setAudioLoading(true);
    setAudioError(null);
    try {
      const text = briefingToText(briefing);
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

      // Set source and play — audio element was created during user gesture
      audio.src = url;
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Audio error:", err);
      setAudioError(err instanceof Error ? err.message : "Audio-Generierung fehlgeschlagen");
      // Clean up on error
      audioRef.current = null;
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
              onClick={fetchBriefing}
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
                shareArticle(
                  "MyNews Morgen-Briefing",
                  window.location.href
                )
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
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Morgen-Briefing
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
              className="border-0 bg-primary/10 text-primary"
            >
              <Sparkles className="mr-1 size-3" />
              Claude Sonnet
            </Badge>
            <span className="text-xs text-muted-foreground">
              Personalisiert nach deinen Interessen
            </span>
          </div>

          {/* Audio Player */}
          {briefing && !loading && (
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
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  {audioLoading ? (
                    <Loader2 className="size-5 animate-spin text-primary" />
                  ) : isPlaying ? (
                    <Pause className="size-5 text-primary" />
                  ) : (
                    <Play className="ml-0.5 size-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">
                    {audioLoading
                      ? "Audio wird generiert..."
                      : isPlaying
                        ? "Briefing wird vorgelesen"
                        : "Briefing anhören"}
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
              {/* Audio progress bar */}
              {(isPlaying || audioProgress > 0) && (
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-primary"
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

        {/* Loading state */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-4 py-20"
          >
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
              <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-medium">Dein Briefing wird erstellt...</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Claude analysiert die aktuellen Nachrichten
              </p>
            </div>
          </motion.div>
        )}

        {/* Error state */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center"
          >
            <p className="font-medium text-destructive">
              Briefing nicht verfügbar
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={fetchBriefing}
            >
              <RefreshCw className="mr-1.5 size-3.5" />
              Erneut versuchen
            </Button>
          </motion.div>
        )}

        {/* Briefing content */}
        {briefing && !loading && (
          <div className="space-y-6">
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-4"
            >
              <p className="text-lg font-medium leading-relaxed">
                {briefing.greeting}
              </p>
            </motion.div>

            {/* Topics */}
            {briefing.topics.map((topic, i) => {
              const color =
                CATEGORY_COLORS[topic.category] ?? "#0EA5E9";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
                  className="group rounded-xl border border-border/50 bg-card p-5 transition-colors hover:border-border"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-2xl">{topic.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          className="border-0 text-xs text-white"
                          style={{ backgroundColor: color }}
                        >
                          {topic.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {topic.source}
                        </span>
                      </div>
                      <h3 className="mt-1 text-base font-semibold leading-snug">
                        {topic.headline}
                      </h3>
                    </div>
                  </div>
                  <p className="text-base leading-relaxed text-muted-foreground sm:text-sm">
                    {topic.summary}
                  </p>
                </motion.div>
              );
            })}

            {/* Outro */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.15 + briefing.topics.length * 0.08,
              }}
            >
              <Separator className="mb-6" />
              <div className="rounded-xl bg-muted/50 px-5 py-4 text-center">
                <p className="text-sm font-medium">{briefing.outro}</p>
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
