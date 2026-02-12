"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: "essential",
    name: "Technisch notwendig",
    description:
      "Diese Cookies sind für den Betrieb der Website unbedingt erforderlich. Sie ermöglichen grundlegende Funktionen wie die Seitennavigation und den Zugang zu geschützten Bereichen. Die Website kann ohne diese Cookies nicht ordnungsgemäß funktionieren.",
    required: true,
  },
  {
    id: "preferences",
    name: "Präferenzen",
    description:
      "Präferenz-Cookies ermöglichen der Website, sich an Informationen zu erinnern, die das Verhalten und Erscheinungsbild der Website beeinflussen, wie z.B. die bevorzugte Sprache oder den Dark Mode. Diese Daten werden ausschließlich lokal in Ihrem Browser gespeichert (localStorage).",
    required: false,
  },
  {
    id: "analytics",
    name: "Analyse & Statistik",
    description:
      "Analyse-Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren. Sie werden derzeit nicht eingesetzt. Sollten in Zukunft Analyse-Tools verwendet werden, werden Sie erneut um Ihre Einwilligung gebeten.",
    required: false,
  },
  {
    id: "marketing",
    name: "Marketing",
    description:
      "Marketing-Cookies werden verwendet, um Besuchern relevante Werbung anzuzeigen. MyNews.com setzt derzeit keine Marketing-Cookies ein und plant dies auch nicht.",
    required: false,
  },
];

export default function CookiesPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    essential: true,
    preferences: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mynews-cookie-settings");
      if (raw) setSettings(JSON.parse(raw));
    } catch {}
  }, []);

  function toggleSetting(id: string) {
    if (id === "essential") return; // Cannot disable essential
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function saveSettings() {
    localStorage.setItem("mynews-cookie-settings", JSON.stringify(settings));
    localStorage.setItem("mynews-consent", "true");
    alert("Cookie-Einstellungen gespeichert.");
  }

  function acceptAll() {
    const all = { essential: true, preferences: true, analytics: true, marketing: true };
    setSettings(all);
    localStorage.setItem("mynews-cookie-settings", JSON.stringify(all));
    localStorage.setItem("mynews-consent", "true");
    alert("Alle Cookies akzeptiert.");
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-3xl items-center px-4">
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
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Cookie-Einstellungen</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Hier können Sie einsehen und verwalten, welche Arten von Cookies und lokalen
          Speichermechanismen MyNews.com verwendet.
        </p>

        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm leading-relaxed">
            <strong>Gut zu wissen:</strong> MyNews.com setzt derzeit keine Tracking- oder
            Werbe-Cookies ein. Alle Personalisierungen (Theme, Lesezeichen, Interessen)
            werden ausschließlich lokal in Ihrem Browser gespeichert und niemals an
            unsere Server übertragen.
          </p>
        </div>

        <div className="space-y-4">
          {COOKIE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="rounded-xl border border-border/50 bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold">{cat.name}</h3>
                  {cat.required && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      Erforderlich
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleSetting(cat.id)}
                  disabled={cat.required}
                  className={`flex size-8 items-center justify-center rounded-full transition-colors ${
                    settings[cat.id]
                      ? "bg-green-500/10"
                      : "bg-muted"
                  } ${cat.required ? "cursor-not-allowed opacity-60" : "hover:opacity-80"}`}
                >
                  {settings[cat.id] ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    <X className="size-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {cat.description}
              </p>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={saveSettings} className="flex-1">
            Auswahl speichern
          </Button>
          <Button onClick={acceptAll} variant="outline" className="flex-1">
            Alle akzeptieren
          </Button>
        </div>

        <Separator className="my-6" />

        <div className="prose prose-sm dark:prose-invert">
          <h2>Was sind Cookies?</h2>
          <p>
            Cookies sind kleine Textdateien, die von Websites in Ihrem Browser gespeichert werden.
            Sie dienen dazu, die Website funktionsfähig zu machen, Ihre Einstellungen zu speichern
            oder die Nutzung zu analysieren.
          </p>

          <h2>localStorage</h2>
          <p>
            Neben Cookies verwendet MyNews.com die localStorage-Technologie Ihres Browsers.
            Im Gegensatz zu Cookies werden localStorage-Daten nicht automatisch an den Server
            gesendet. Sie verbleiben ausschließlich auf Ihrem Gerät.
          </p>

          <h2>Gespeicherte Daten im Detail</h2>
          <table>
            <thead>
              <tr>
                <th>Schlüssel</th>
                <th>Zweck</th>
                <th>Art</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>mynews-theme</code></td>
                <td>Hell/Dunkel-Modus</td>
                <td>Präferenz</td>
              </tr>
              <tr>
                <td><code>mynews-bookmarks</code></td>
                <td>Gespeicherte Artikel</td>
                <td>Präferenz</td>
              </tr>
              <tr>
                <td><code>mynews-interests</code></td>
                <td>Interessen-Kategorien</td>
                <td>Präferenz</td>
              </tr>
              <tr>
                <td><code>mynews-consent</code></td>
                <td>Cookie-Einwilligung</td>
                <td>Notwendig</td>
              </tr>
              <tr>
                <td><code>mynews-onboarding-done</code></td>
                <td>Onboarding abgeschlossen</td>
                <td>Notwendig</td>
              </tr>
              <tr>
                <td><code>mynews-disabled-sources</code></td>
                <td>Deaktivierte Quellen</td>
                <td>Präferenz</td>
              </tr>
            </tbody>
          </table>

          <h2>Daten löschen</h2>
          <p>
            Sie können alle lokal gespeicherten Daten jederzeit löschen, indem Sie den
            Browser-Cache und die Website-Daten für mynews.com löschen. In den meisten
            Browsern finden Sie diese Option unter Einstellungen → Datenschutz → Website-Daten.
          </p>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">Stand: Februar 2026</p>
      </div>
    </div>
  );
}
