import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { fetchTopHeadlines } from "@/lib/news/newsapi";
import { MOCK_ARTICLES } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

let cachedDigest: { date: string; content: string } | null = null;

export async function GET() {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 503 }
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  if (cachedDigest && cachedDigest.date === today) {
    return NextResponse.json({ digest: cachedDigest.content, date: today });
  }

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

  const topArticles = articles.slice(0, 15);

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
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: `Du bist der KI-Redakteur von MyNews.com. Erstelle einen "Abend-Digest" - eine Zusammenfassung des Tages für den ${new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}.

Basierend auf diesen Nachrichten des Tages:

${articleList}

Erstelle ein strukturiertes Abend-Digest im folgenden JSON-Format (ohne Markdown-Codeblöcke):

{
  "greeting": "Guten Abend! Hier ist dein Tagesrückblick.",
  "highlight": {
    "emoji": "🔥",
    "headline": "Die wichtigste Story des Tages in einem Satz",
    "summary": "2-3 Sätze warum das heute besonders relevant war."
  },
  "topics": [
    {
      "emoji": "🏛️",
      "category": "Politik",
      "headline": "Kurze Überschrift",
      "summary": "1-2 Sätze Zusammenfassung."
    }
  ],
  "outlook": "Was morgen wichtig wird: 1-2 Sätze Ausblick.",
  "goodnight": "Ein freundlicher Abschluss-Satz."
}

Regeln:
- "highlight" ist DIE Top-Story des Tages
- "topics" enthält 4-5 weitere wichtige Themen
- Verwende passende Emojis pro Kategorie
- Schreibe auf Deutsch, neutral und professionell
- WICHTIG: Verwende KEINE deutschen Anführungszeichen. Verwende stattdessen einfache Anführungszeichen (') für Zitate.`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse digest response" },
        { status: 500 }
      );
    }

    const digest = jsonMatch[0]
      .replace(/\u201E/g, "'")
      .replace(/\u201C/g, "'")
      .replace(/\u201D/g, "'")
      .replace(/\u00AB/g, "'")
      .replace(/\u00BB/g, "'");

    try {
      JSON.parse(digest);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse digest JSON" },
        { status: 500 }
      );
    }

    cachedDigest = { date: today, content: digest };
    return NextResponse.json({ digest, date: today });
  } catch (err) {
    console.error("Digest API error:", err);
    return NextResponse.json(
      { error: "Digest generation failed" },
      { status: 500 }
    );
  }
}
