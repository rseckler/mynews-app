import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { fetchTopHeadlines } from "@/lib/news/newsapi";
import { MOCK_ARTICLES } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

// Cache briefing for the current day
let cachedBriefing: { date: string; content: string } | null = null;

export async function GET() {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 503 }
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  // Return cached briefing if it's from today
  if (cachedBriefing && cachedBriefing.date === today) {
    return NextResponse.json({ briefing: cachedBriefing.content, date: today });
  }

  // Fetch current articles
  const newsApiKey = process.env.NEWSAPI_KEY;
  let articles;
  if (newsApiKey) {
    try {
      articles = await fetchTopHeadlines(newsApiKey, "de", 5);
    } catch {
      articles = MOCK_ARTICLES;
    }
  } else {
    articles = MOCK_ARTICLES;
  }

  // Take top 12 articles for the briefing
  const topArticles = articles.slice(0, 12);

  const articleList = topArticles
    .map(
      (a, i) =>
        `${i + 1}. [${a.category.toUpperCase()}] ${a.title}\n   ${a.description}\n   Quelle: ${a.sourceName}`
    )
    .join("\n\n");

  try {
    const client = new Anthropic({ apiKey: anthropicKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1200,
      messages: [
        {
          role: "user",
          content: `Du bist der KI-Redakteur von MyNews.com, einer deutschen Nachrichtenplattform. Erstelle ein "Morgen-Briefing" für den ${new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}.

Basierend auf diesen aktuellen Top-Nachrichten:

${articleList}

Erstelle ein strukturiertes Morgen-Briefing im folgenden JSON-Format (ohne Markdown-Codeblöcke):

{
  "greeting": "Guten Morgen! Hier ist dein Briefing für [Wochentag].",
  "topics": [
    {
      "emoji": "🏛️",
      "category": "Politik",
      "headline": "Kurze, knackige Überschrift",
      "summary": "2-3 Sätze Zusammenfassung, neutral und faktisch.",
      "source": "Quellenname"
    }
  ],
  "outro": "Ein motivierender Abschluss-Satz für den Tag."
}

Regeln:
- Erstelle 5-7 Topics, eines pro Nachrichtenkategorie
- Verwende passende Emojis pro Kategorie (🏛️ Politik, 💰 Wirtschaft, ⚽ Sport, 💻 Technologie, 🔬 Wissenschaft, 🎭 Unterhaltung, 🏥 Gesundheit, 🎨 Kultur)
- Schreibe auf Deutsch, neutral und professionell
- Jede Summary sollte 2-3 Sätze haben
- Fasse ähnliche Themen zusammen statt sie doppelt zu nennen
- WICHTIG: Verwende KEINE deutschen Anführungszeichen (also nicht „ oder "). Verwende stattdessen einfache Anführungszeichen (') für Zitate.`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON response — sanitize German quotes that break JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse briefing response" },
        { status: 500 }
      );
    }

    // Replace German quotation marks with safe alternatives
    const briefing = jsonMatch[0]
      .replace(/\u201E/g, "'")  // „
      .replace(/\u201C/g, "'") // "
      .replace(/\u201D/g, "'") // "
      .replace(/\u00AB/g, "'") // «
      .replace(/\u00BB/g, "'"); // »

    // Validate it's parseable JSON
    try {
      JSON.parse(briefing);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse briefing JSON" },
        { status: 500 }
      );
    }

    // Cache for today
    cachedBriefing = { date: today, content: briefing };

    return NextResponse.json({ briefing, date: today });
  } catch (err) {
    console.error("Briefing API error:", err);
    return NextResponse.json(
      { error: "Briefing generation failed" },
      { status: 500 }
    );
  }
}
