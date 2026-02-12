import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Datenschutzerklärung" };

export default function DatenschutzPage() {
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
        <h1>Datenschutzerklärung</h1>
        <p>Stand: Februar 2026</p>

        <h2>1. Verantwortlicher</h2>
        <p>
          Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br />
          MyNews.com (Highlight Communications AG &amp; Sport1 Medien GmbH)<br />
          E-Mail: datenschutz@mynews.com
        </p>

        <h2>2. Überblick der Verarbeitungen</h2>
        <p>
          Die nachfolgende Übersicht fasst die Arten der verarbeiteten Daten und die Zwecke
          ihrer Verarbeitung zusammen und verweist auf die betroffenen Personen.
        </p>

        <h2>3. Erhobene Daten</h2>
        <h3>3.1 Automatisch erhobene Daten</h3>
        <p>
          Beim Besuch unserer Website werden automatisch folgende Daten durch unseren
          Hosting-Provider (Vercel Inc.) erhoben:
        </p>
        <ul>
          <li>IP-Adresse (anonymisiert)</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>Aufgerufene Seite / URL</li>
          <li>Browsertyp und -version</li>
          <li>Betriebssystem</li>
          <li>Referrer-URL</li>
        </ul>
        <p>
          Diese Daten werden zur Sicherstellung des Betriebs und zur Fehleranalyse verwendet.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
        </p>

        <h3>3.2 Lokale Speicherung (localStorage)</h3>
        <p>
          MyNews.com speichert bestimmte Einstellungen lokal in Ihrem Browser (localStorage).
          Diese Daten werden <strong>nicht</strong> an unsere Server übertragen:
        </p>
        <ul>
          <li><strong>Theme-Einstellung</strong> (Hell/Dunkel-Modus)</li>
          <li><strong>Lesezeichen</strong> (gespeicherte Artikel)</li>
          <li><strong>Interessen</strong> (gewählte Nachrichtenkategorien)</li>
          <li><strong>Cookie-Einwilligung</strong> (Zustimmungsstatus)</li>
          <li><strong>Quelleneinstellungen</strong> (aktivierte/deaktivierte Nachrichtenquellen)</li>
        </ul>
        <p>
          Sie können diese Daten jederzeit durch Löschen des Browser-Caches entfernen.
        </p>

        <h2>4. Drittanbieter-Dienste</h2>

        <h3>4.1 Vercel (Hosting)</h3>
        <p>
          Diese Website wird bei Vercel Inc. (San Francisco, USA) gehostet.
          Vercel verarbeitet Zugriffsdaten gemäß deren Datenschutzerklärung.
          Die Datenübertragung in die USA erfolgt auf Grundlage von
          EU-Standardvertragsklauseln.
        </p>

        <h3>4.2 NewsAPI.org (Nachrichtenquellen)</h3>
        <p>
          Wir beziehen Nachrichteninhalte über die API von NewsAPI.org. Bei der
          Abfrage werden keine personenbezogenen Daten Ihrer Nutzer an NewsAPI übermittelt.
          Die API-Aufrufe erfolgen serverseitig.
        </p>

        <h3>4.3 RSS-Feeds (Nachrichtenquellen)</h3>
        <p>
          Wir rufen öffentlich zugängliche RSS-Feeds deutscher Nachrichtenportale ab.
          Diese Abrufe erfolgen serverseitig; Ihre personenbezogenen Daten werden dabei
          nicht an die Nachrichtenquellen weitergegeben.
        </p>

        <h3>4.4 Anthropic (KI-Zusammenfassungen)</h3>
        <p>
          Für KI-Zusammenfassungen und Briefings verwenden wir die API von Anthropic (Claude).
          Es werden ausschließlich Nachrichteninhalte (Titel, Beschreibung) zur Verarbeitung
          übermittelt — keine personenbezogenen Nutzerdaten.
        </p>

        <h3>4.5 OpenAI (Text-to-Speech)</h3>
        <p>
          Für die Audio-Wiedergabe von Briefings verwenden wir die OpenAI TTS API.
          Es werden ausschließlich die Briefing-Texte übermittelt —
          keine personenbezogenen Nutzerdaten.
        </p>

        <h2>5. Cookies</h2>
        <p>
          MyNews.com verwendet <strong>keine</strong> Tracking-Cookies. Wir setzen ausschließlich
          technisch notwendige Cookies ein, die für den Betrieb der Website erforderlich sind.
          Weitere Informationen finden Sie in unseren{" "}
          <Link href="/cookies">Cookie-Einstellungen</Link>.
        </p>

        <h2>6. Ihre Rechte</h2>
        <p>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
        <ul>
          <li><strong>Auskunftsrecht</strong> (Art. 15 DSGVO)</li>
          <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li>
          <li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO)</li>
          <li><strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
          <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
          <li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO)</li>
        </ul>
        <p>
          Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: datenschutz@mynews.com
        </p>

        <h2>7. Beschwerderecht</h2>
        <p>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die
          Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
        </p>

        <h2>8. Änderungen</h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte
          Rechtslagen oder bei Änderungen des Dienstes anzupassen.
        </p>

        <hr />
        <p className="text-xs text-muted-foreground">Stand: Februar 2026</p>
      </article>
    </div>
  );
}
