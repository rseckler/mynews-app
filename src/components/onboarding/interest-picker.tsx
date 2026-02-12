"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/mock-data";
import type { Category } from "@/types";

const SELECTABLE_CATEGORIES = CATEGORIES.filter((c) => c.id !== "for-you");

const MIN_SELECTIONS = 3;

interface InterestPickerProps {
  onComplete: (categories: Category[]) => void;
}

export function InterestPicker({ onComplete }: InterestPickerProps) {
  const [step, setStep] = useState<"welcome" | "pick">("welcome");
  const [selected, setSelected] = useState<Category[]>([]);

  function toggleCategory(id: Category) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  const canContinue = selected.length >= MIN_SELECTIONS;

  return (
    <AnimatePresence mode="wait">
      {step === "welcome" ? (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
          className="flex min-h-[100dvh] flex-col items-center justify-center px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            {/* Logo */}
            <div className="mb-8 flex items-center gap-2.5">
              <div className="grid grid-cols-2 gap-1">
                <div className="size-2.5 rounded-full bg-primary" />
                <div className="size-2.5 rounded-full bg-primary/60" />
                <div className="size-2.5 rounded-full bg-primary/60" />
                <div className="size-2.5 rounded-full bg-primary/30" />
              </div>
              <span className="text-3xl font-extrabold tracking-tight">
                MYNEWS
              </span>
            </div>

            <p className="mb-2 text-sm font-medium tracking-[0.25em] text-muted-foreground uppercase">
              Curated for you
            </p>

            <h1 className="mt-6 max-w-md text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              Deine Nachrichten.
              <br />
              <span className="text-primary">Intelligent kuratiert.</span>
            </h1>

            <p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground">
              KI-gestützte Zusammenfassungen aus vertrauenswürdigen Quellen –
              transparent, personalisiert und immer aktuell.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-10"
            >
              <Button
                size="lg"
                className="gap-2 rounded-full px-8 text-base"
                onClick={() => setStep("pick")}
              >
                Los geht's
                <ArrowRight className="size-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-16 flex items-center gap-4 text-xs text-muted-foreground"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary" />
                KI-Zusammenfassungen
              </div>
              <span className="text-border">|</span>
              <span>Keine Registrierung nötig</span>
              <span className="text-border">|</span>
              <span>DSGVO-konform</span>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="pick"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex min-h-[100dvh] flex-col items-center justify-center px-6"
        >
          <div className="w-full max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-8 text-center"
            >
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Was interessiert dich?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Wähle mindestens {MIN_SELECTIONS} Kategorien für deinen
                personalisierten Feed.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SELECTABLE_CATEGORIES.map((cat, i) => {
                const isSelected = selected.includes(cat.id);
                return (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
                    onClick={() => toggleCategory(cat.id)}
                    className={cn(
                      "group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/30 hover:bg-accent/50"
                    )}
                  >
                    {/* Color dot */}
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-full transition-all duration-200",
                        isSelected ? "scale-110" : "group-hover:scale-105"
                      )}
                      style={{
                        backgroundColor: isSelected
                          ? cat.color
                          : `${cat.color}20`,
                      }}
                    >
                      {isSelected ? (
                        <Check className="size-5 text-white" />
                      ) : (
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isSelected
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {cat.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Continue button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              className="mt-8 flex flex-col items-center gap-3"
            >
              <Button
                size="lg"
                className="w-full max-w-xs gap-2 rounded-full text-base"
                disabled={!canContinue}
                onClick={() => onComplete(selected)}
              >
                Feed anzeigen
                <ArrowRight className="size-4" />
              </Button>
              <p className="text-xs text-muted-foreground">
                {selected.length} von {MIN_SELECTIONS} ausgewählt
                {canContinue && " ✓"}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
