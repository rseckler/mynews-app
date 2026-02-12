"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Article } from "@/types";

interface BreakingNewsBannerProps {
  article: Article | null;
}

export function BreakingNewsBanner({ article }: BreakingNewsBannerProps) {
  const [visible, setVisible] = useState(true);

  // Reset visibility when article changes
  useEffect(() => {
    if (article) setVisible(true);
  }, [article]);

  if (!article || !visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden bg-primary text-primary-foreground"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 lg:px-8">
          <div className="flex items-center gap-2">
            <Zap className="size-4 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Eilmeldung
            </span>
          </div>
          <span className="line-clamp-1 flex-1 text-sm font-medium">
            {article.title}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 shrink-0 text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            onClick={() => setVisible(false)}
            aria-label="Schließen"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
