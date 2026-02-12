"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "mynews-consent";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Small delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
    setVisible(false);
  }

  function acceptEssential() {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ accepted: "essential", date: new Date().toISOString() }));
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-x-0 bottom-0 z-[60] p-4 lg:bottom-4 lg:left-auto lg:right-4 lg:max-w-md"
        >
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/95 p-5 shadow-2xl backdrop-blur-xl">
            {/* Close */}
            <button
              onClick={acceptEssential}
              className="absolute top-3 right-3 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Schließen"
            >
              <X className="size-4" />
            </button>

            {/* Content */}
            <div className="flex gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="size-4 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold">
                  Datenschutz & Cookies
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  MyNews.com speichert Ihre Interessen lokal auf Ihrem Gerät, um
                  den Feed zu personalisieren. Wir verwenden keine
                  Tracking-Cookies und geben keine Daten an Dritte weiter.{" "}
                  <a href="#" className="text-primary underline-offset-2 hover:underline">
                    Mehr erfahren
                  </a>
                </p>

                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={accept}
                  >
                    Alle akzeptieren
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={acceptEssential}
                  >
                    Nur essenzielle
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
