import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const speakArabic = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ text: z.string().min(1).max(300) }).parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("TTS not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini-tts",
        input: data.text,
        voice: "alloy",
        response_format: "mp3",
        instructions:
          "Speak in clear, warm Modern Standard Arabic, slowly and gently, as if talking to a young child.",
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`TTS failed: ${response.status} ${detail}`);
    }

    const buffer = await response.arrayBuffer();
    return { audio: Buffer.from(buffer).toString("base64") };
  });
