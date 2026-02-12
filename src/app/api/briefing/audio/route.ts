import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Cache audio for the current day to avoid re-generating
let cachedAudio: { date: string; data: ArrayBuffer } | null = null;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured" },
      { status: 503 }
    );
  }

  const { text } = await request.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json(
      { error: "text is required" },
      { status: 400 }
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  // Return cached audio if available for today
  if (cachedAudio && cachedAudio.date === today) {
    return new Response(cachedAudio.data, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  // Trim text to stay within TTS limits (~4096 chars)
  const trimmedText = text.slice(0, 4000);

  try {
    const res = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: trimmedText,
        voice: "nova",
        response_format: "mp3",
        speed: 1.0,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenAI TTS error:", res.status, err);
      return NextResponse.json(
        { error: "TTS generation failed" },
        { status: 500 }
      );
    }

    const data = await res.arrayBuffer();

    // Cache for the day
    cachedAudio = { date: today, data };

    return new Response(data, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err) {
    console.error("TTS API error:", err);
    return NextResponse.json(
      { error: "TTS generation failed" },
      { status: 500 }
    );
  }
}
