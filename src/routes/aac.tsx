import { speak as speakArabic } from "@/lib/speech";
import { createFileRoute } from "@tanstack/react-router";
import { Volume2, Delete, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { aacBoard } from "@/lib/content";

export const Route = createFileRoute("/aac")({
  head: () => ({
    meta: [
      { title: "لوحة التواصل البديل بالعربية | سند" },
      {
        name: "description",
        content:
          "لوحة تواصل معزّز وبديل (AAC) بالعربية: بطاقات رموز للطلبات والمشاعر والأشخاص، مع نطق الجملة بصوت عربي.",
      },
      { property: "og:title", content: "لوحة التواصل البديل بالعربية" },
      {
        property: "og:description",
        content: "بطاقات رموز عربية تساعد الطفل غير الناطق على تكوين جملة وطلب ما يحتاجه.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AacPage,
});

const speak = (text: string) => {
  void speakArabic(text);
};


function AacPage() {
  const [sentence, setSentence] = useState<{ label: string; emoji: string }[]>([]);

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
          لوحة التواصل البديل
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          اضغط على البطاقات لتكوين جملة، ثم اضغط زر النطق ليسمعها الجميع. مناسبة للأطفال غير الناطقين
          أو محدودي الكلام.
        </p>

        <div className="mt-6 rounded-3xl bg-card p-4 shadow-card">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-h-20 flex-1 flex-wrap items-center gap-2 rounded-2xl bg-muted p-3">
              {sentence.length === 0 ? (
                <span className="px-2 text-sm text-muted-foreground">جملتك ستظهر هنا…</span>
              ) : (
                sentence.map((item, i) => (
                  <span
                    key={`${item.label}-${i}`}
                    className="flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-sm font-bold text-ink shadow-card"
                  >
                    <span className="text-xl">{item.emoji}</span>
                    {item.label}
                  </span>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => speak(sentence.map((s) => s.label).join(" "))}
                disabled={sentence.length === 0}
                className="grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-card disabled:opacity-40"
                aria-label="انطق الجملة"
              >
                <Volume2 className="size-6" />
              </button>
              <button
                onClick={() => setSentence((s) => s.slice(0, -1))}
                className="grid size-14 place-items-center rounded-2xl bg-muted text-foreground"
                aria-label="حذف آخر بطاقة"
              >
                <Delete className="size-6" />
              </button>
              <button
                onClick={() => setSentence([])}
                className="grid size-14 place-items-center rounded-2xl bg-muted text-destructive"
                aria-label="إفراغ الجملة"
              >
                <Trash2 className="size-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {aacBoard.map((group) => (
            <div key={group.group}>
              <h2 className="mb-3 text-xl font-extrabold text-ink">{group.group}</h2>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {group.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setSentence((s) => [...s, item]);
                      speak(item.label);
                    }}
                    className={`tile-pop flex flex-col items-center gap-2 rounded-3xl ${group.color} p-4 text-primary-foreground shadow-card hover:-translate-y-1 hover:shadow-play`}
                  >
                    <span className="text-4xl">{item.emoji}</span>
                    <span className="text-sm font-extrabold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
