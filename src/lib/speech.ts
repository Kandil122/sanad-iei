import { speakArabic } from "./tts.functions";

const cache = new Map<string, string>();
let current: HTMLAudioElement | null = null;

function clean(text: string) {
  return text.replace(/[^\p{L}\p{N}\s؟!،.]/gu, "").trim();
}

function fallback(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const arabic = voices.find((v) => v.lang?.toLowerCase().startsWith("ar"));
  if (arabic) utter.voice = arabic;
  utter.lang = arabic?.lang ?? "ar-SA";
  utter.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function play(base64: string) {
  const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
  current?.pause();
  current = audio;
  void audio.play().catch(() => {});
}

/** Speak Arabic text aloud (server TTS with browser speech fallback). */
export async function speak(text: string) {
  if (typeof window === "undefined") return;
  const input = clean(text);
  if (!input) return;

  const cached = cache.get(input);
  if (cached) {
    play(cached);
    return;
  }

  try {
    const { audio } = await speakArabic({ data: { text: input } });
    cache.set(input, audio);
    play(audio);
  } catch {
    fallback(input);
  }
}

export function stopSpeaking() {
  current?.pause();
  current = null;
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
