import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Nutzungsbedingungen" };

export default function NutzungsbedingungenPage() {
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
        <h1>Nutzungsbedingungen</h1>
        <p>Stand: Februar 2026</p>

        <h2>1. Geltungsbereich</h2>
        <p>
          Diese Nutzungsbedingungen gelten für die Nutzung des Nachrichtenportals MyNews.com
          (im Folgenden &quot;Plattform&quot;), betrieben von Highlight Communications AG in
          Zusammenarbeit mit Sport1 Medien GmbH (im Folgenden &quot;Anbieter&quot;).
        </p>
        <p>
          Mit der Nutzung der Plattform erklären Sie sich mit diesen Nutzungsbedingungen
          einverstanden.
        </p>

        <h2>2. Leistungsbeschreibung</h2>
        <p>MyNews.com bietet folgende Dienste:</p>
        <ul>
          <li>Aggregation und Darstellung von Nachrichteninhalten aus öffentlich zugänglichen Quellen</li>
          <li>KI-gestützte Zusammenfassungen von Nachrichtenartikeln</li>
          <li>Personalisierte Morgen-Briefings und Abend-Digests</li>
          <li>Audio-Wiedergabe von Briefings (Text-to-Speech)</li>
          <li>Suchfunktion für Nachrichtenartikel</li>
          <li>Lesezeichen-Funktion zum Speichern von Artikeln</li>
        </ul>

        <h2>3. Verfügbarkeit</h2>
        <p>
          Der Anbieter bemüht sich um eine möglichst hohe Verfügbarkeit der Plattform.
          Ein Anspruch auf ununterbrochene Verfügbarkeit besteht nicht. Der Anbieter behält
          sich das Recht vor, die Plattform jederzeit einzuschränken, zu ändern oder einzustellen.
        </p>

        <h2>4. KI-generierte Inhalte</h2>
        <p>
          MyNews.com nutzt künstliche Intelligenz zur Erstellung von Zusammenfassungen,
          Briefings und Stimmungsanalysen. Für diese Inhalte gilt:
        </p>
        <ul>
          <li>KI-generierte Inhalte sind als solche gekennzeichnet.</li>
          <li>Sie ersetzen nicht die Originalberichterstattung der Nachrichtenquellen.</li>
          <li>
            Der Anbieter übernimmt keine Gewähr für die Vollständigkeit oder Korrektheit
            KI-generierter Zusammenfassungen.
          </li>
          <li>
            Nutzer werden ermutigt, die Originalartikel für eine vollständige
            Information zu konsultieren.
          </li>
        </ul>

        <h2>5. Inhalte Dritter</h2>
        <p>
          Die über MyNews.com angezeigten Nachrichtenartikel stammen von unabhängigen
          Nachrichtenquellen. Der Anbieter übernimmt keine Verantwortung für die Inhalte,
          Richtigkeit oder Aktualität dieser Drittinhalte. Alle Artikel verlinken auf die
          jeweilige Originalquelle.
        </p>

        <h2>6. Nutzungsrechte</h2>
        <p>
          Die Plattform und ihre Inhalte sind urheberrechtlich geschützt. Nutzer dürfen:
        </p>
        <ul>
          <li>Inhalte für den persönlichen, nicht-kommerziellen Gebrauch lesen und speichern</li>
          <li>Artikel über die bereitgestellte Teilen-Funktion weitergeben</li>
        </ul>
        <p>Nicht gestattet ist insbesondere:</p>
        <ul>
          <li>Systematisches Scraping oder automatisiertes Abrufen von Inhalten</li>
          <li>Kommerzielle Weiterverwendung ohne Zustimmung</li>
          <li>Manipulation der Plattform oder ihrer Dienste</li>
        </ul>

        <h2>7. Keine Registrierung</h2>
        <p>
          MyNews.com erfordert aktuell keine Registrierung oder Anmeldung. Personalisierungen
          (Interessen, Lesezeichen, Quelleneinstellungen) werden ausschließlich lokal im
          Browser des Nutzers gespeichert.
        </p>

        <h2>8. Haftungsbeschränkung</h2>
        <p>
          Der Anbieter haftet nicht für Schäden, die aus der Nutzung oder Nichtnutzung
          der Plattform entstehen, soweit nicht Vorsatz oder grobe Fahrlässigkeit vorliegt.
          Dies gilt insbesondere für:
        </p>
        <ul>
          <li>Fehler in KI-generierten Zusammenfassungen</li>
          <li>Ausfälle oder technische Störungen</li>
          <li>Inhalte verlinkter Drittanbieter-Websites</li>
        </ul>

        <h2>9. Änderungen der Nutzungsbedingungen</h2>
        <p>
          Der Anbieter behält sich vor, diese Nutzungsbedingungen jederzeit zu ändern.
          Die jeweils aktuelle Fassung ist auf dieser Seite abrufbar.
        </p>

        <h2>10. Anwendbares Recht</h2>
        <p>
          Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
          UN-Kaufrechts. Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz
          des Anbieters.
        </p>

        <hr />
        <p className="text-xs text-muted-foreground">Stand: Februar 2026</p>
      </article>
    </div>
  );
}
