import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("TTS: OPENAI_API_KEY not set");
    return NextResponse.json(
      { error: "OPENAI_API_KEY ist nicht konfiguriert. Bitte in den Vercel-Umgebungsvariablen setzen." },
      { status: 503 }
    );
  }

  let body: { text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültiger Request-Body" }, { status: 400 });
  }

  const { text } = body;
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Text ist erforderlich" }, { status: 400 });
  }

  // Trim text to stay within TTS limits (~4096 chars)
  const trimmedText = text.slice(0, 4000);

  try {
    console.log(`TTS: Generating audio for ${trimmedText.length} chars...`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 50000); // 50s timeout

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
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenAI TTS error:", res.status, errText);
      return NextResponse.json(
        { error: `OpenAI TTS Fehler (${res.status}): ${errText.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const data = await res.arrayBuffer();
    console.log(`TTS: Success, ${data.byteLength} bytes`);

    return new Response(data, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("TTS API error:", err);
    const message = err instanceof Error && err.name === "AbortError"
      ? "Audio-Generierung hat zu lange gedauert (Timeout)"
      : "Audio-Generierung fehlgeschlagen";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/** Health check – verify OPENAI_API_KEY is set */
export async function GET() {
  const hasKey = !!process.env.OPENAI_API_KEY;
  return NextResponse.json({ configured: hasKey });
}
