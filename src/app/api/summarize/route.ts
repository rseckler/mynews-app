import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";

// Simple in-memory cache to avoid re-summarizing the same article
const cache = new Map<string, { summary: string; sentiment: string }>();

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 503 }
    );
  }

  const { title, description, content, articleId } = await request.json();

  if (!title || !description) {
    return NextResponse.json(
      { error: "title and description are required" },
      { status: 400 }
    );
  }

  // Check cache
  if (articleId && cache.has(articleId)) {
    return NextResponse.json(cache.get(articleId));
  }

  const articleText = [title, description, content]
    .filter(Boolean)
    .join("\n\n");

  try {
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Du bist ein Nachrichten-Analyst für MyNews.com, eine deutsche News-Plattform. Analysiere den folgenden Nachrichtenartikel und erstelle:

1. Eine prägnante Zusammenfassung in genau 3 kurzen Sätzen auf Deutsch.
2. Eine Sentiment-Bewertung: "positive", "neutral" oder "negative".

Antworte NUR im folgenden JSON-Format, ohne Markdown-Codeblöcke:
{"summary": "Satz 1. Satz 2. Satz 3.", "sentiment": "neutral"}

Artikel:
${articleText}`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);
    const response = {
      summary: result.summary ?? "",
      sentiment: result.sentiment ?? "neutral",
    };

    // Cache result
    if (articleId) {
      cache.set(articleId, response);
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error("Summarize API error:", err);
    return NextResponse.json(
      { error: "AI summarization failed" },
      { status: 500 }
    );
  }
}
