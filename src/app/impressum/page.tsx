import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
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

      <article className="prose prose-sm dark:prose-invert mx-auto max-w-3xl px-4 py-8 lg:px-8">
        <h1>Impressum</h1>
        <p>Angaben gemäß § 5 TMG</p>

        <h2>Anbieter</h2>
        <p>
          MyNews.com<br />
          Ein Joint Venture von Highlight Communications AG &amp; Sport1 Medien GmbH
        </p>
        <p>
          Highlight Communications AG<br />
          Netziloweg 2<br />
          CH-8154 Oberglatt<br />
          Schweiz
        </p>

        <h2>Vertreten durch</h2>
        <p>
          Bernhard Burgener, Verwaltungsratspräsident<br />
          Hasan Dilsiz, CFO
        </p>

        <h2>Kontakt</h2>
        <p>
          E-Mail: redaktion@mynews.com<br />
          Telefon: +41 44 850 70 70
        </p>

        <h2>Handelsregister</h2>
        <p>
          Handelsregisteramt des Kantons Zürich<br />
          UID: CHE-106.842.723
        </p>

        <h2>Verantwortlich für den Inhalt (gem. § 55 Abs. 2 RStV)</h2>
        <p>
          Redaktion MyNews.com<br />
          redaktion@mynews.com
        </p>

        <h2>Haftungsausschluss</h2>
        <h3>Haftung für Inhalte</h3>
        <p>
          Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
          Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
          nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
          Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
          Informationen zu überwachen.
        </p>

        <h3>Haftung für Links</h3>
        <p>
          Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
          Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
          Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
          Seiten verantwortlich.
        </p>

        <h3>KI-generierte Inhalte</h3>
        <p>
          MyNews.com verwendet künstliche Intelligenz (KI) zur Zusammenfassung und Aufbereitung
          von Nachrichteninhalten. KI-generierte Inhalte sind entsprechend gekennzeichnet. Die
          KI-Zusammenfassungen ersetzen nicht die Originalartikel der jeweiligen Nachrichtenquellen.
          Trotz sorgfältiger Prüfung kann keine Garantie für die vollständige Korrektheit
          KI-generierter Zusammenfassungen übernommen werden.
        </p>

        <h2>Urheberrecht</h2>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
          dem Urheberrecht. Nachrichtenartikel und -inhalte Dritter werden mit Quellenangabe
          dargestellt und verlinken stets auf die Originalquelle. Die Vervielfältigung, Bearbeitung,
          Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen
          der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
        </p>

        <hr />
        <p className="text-xs text-muted-foreground">Stand: Februar 2026</p>
      </article>
    </div>
  );
}
