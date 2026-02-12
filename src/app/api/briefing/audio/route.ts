import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  const rawKey = process.env.OPENAI_API_KEY;
  if (!rawKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY ist nicht konfiguriert" },
      { status: 503 }
    );
  }

  // Trim whitespace/newlines that may have been introduced during copy-paste
  const apiKey = rawKey.trim().replace(/\s+/g, "");

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
      const errText = await res.text();
      console.error("OpenAI TTS error:", res.status, errText);
      return NextResponse.json(
        { error: `Audio-Generierung fehlgeschlagen (${res.status})` },
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
  } catch (err: unknown) {
    console.error("TTS catch error:", err);
    return NextResponse.json(
      { error: "Audio-Generierung fehlgeschlagen" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ configured: !!process.env.OPENAI_API_KEY });
}
