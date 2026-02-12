"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {/* Top section */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-1.5">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="size-1.5 rounded-full bg-primary" />
                <div className="size-1.5 rounded-full bg-primary/60" />
                <div className="size-1.5 rounded-full bg-primary/60" />
                <div className="size-1.5 rounded-full bg-primary/30" />
              </div>
              <span className="text-sm font-extrabold tracking-tight">
                MYNEWS
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              AI-kuratierte Nachrichten aus vertrauenswürdigen Quellen.
              Personalisiert, transparent, aktuell.
            </p>
          </div>

          {/* Produkt */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Produkt
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
                  Startseite
                </Link>
              </li>
              <li>
                <Link href="/briefing" className="text-muted-foreground transition-colors hover:text-foreground">
                  Morgen-Briefing
                </Link>
              </li>
              <li>
                <Link href="/digest" className="text-muted-foreground transition-colors hover:text-foreground">
                  Abend-Digest
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-muted-foreground transition-colors hover:text-foreground">
                  Suche
                </Link>
              </li>
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Rechtliches
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/impressum" className="text-muted-foreground transition-colors hover:text-foreground">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-muted-foreground transition-colors hover:text-foreground">
                  Datenschutzerklärung
                </Link>
              </li>
              <li>
                <Link href="/nutzungsbedingungen" className="text-muted-foreground transition-colors hover:text-foreground">
                  Nutzungsbedingungen
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground transition-colors hover:text-foreground">
                  Cookie-Einstellungen
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Kontakt
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Highlight Communications AG</li>
              <li>Sport1 Medien GmbH</li>
              <li>redaktion@mynews.com</li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} MyNews.com. Alle Rechte vorbehalten.</p>
          <p>
            Powered by Claude AI · Daten via NewsAPI + RSS
          </p>
        </div>
      </div>
    </footer>
  );
}
