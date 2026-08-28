import { createFileRoute } from "@tanstack/react-router";
import { Check, RotateCcw, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { categories, games, type GameCategory } from "@/lib/content";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "ألعاب تعليمية عربية للأطفال | أوتسيمو" },
      {
        name: "description",
        content:
          "أكثر من ٦٠ لعبة تعليمية بالعربية للأطفال: الأساسيات، اللغة والنطق، المهارات الحياتية، الرياضيات والمهارات الاجتماعية — والعب مباشرة لعبة طابِق الصور.",
      },
      { property: "og:title", content: "ألعاب تعليمية عربية للأطفال | أوتسيمو" },
      {
        property: "og:description",
        content: "مكتبة ألعاب عربية مقسّمة حسب المهارة، مع لعبة تفاعلية تلعبها الآن.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GamesPage,
});

const POOL = ["🍎", "🐶", "🚗", "⭐", "🌸", "🐟", "🎈", "🍌", "🐱", "🚀"];

function buildRound() {
  const shuffled = [...POOL].sort(() => Math.random() - 0.5);
  const target = shuffled[0]!;
  const options = [target, shuffled[1]!, shuffled[2]!].sort(() => Math.random() - 0.5);
  return { target, options };
}

function MatchingGame() {
  const [round, setRound] = useState(buildRound);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);

  const handlePick = (option: string) => {
    if (option === round.target) {
      setCorrect(true);
      setWrong(null);
      setScore((s) => s + 1);
      setTimeout(() => {
        setCorrect(false);
        setRound(buildRound());
      }, 800);
    } else {
      setWrong(option);
      setTimeout(() => setWrong(null), 600);
    }
  };

  return (
    <div className="rounded-[2rem] bg-card p-6 shadow-play sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-ink">🧩 طابِق الصور</h2>
          <p className="text-sm text-muted-foreground">اختر الصورة المشابهة للصورة الكبيرة.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-extrabold text-accent-foreground">
            <Star className="size-4" /> النقاط: {score}
          </span>
          <button
            onClick={() => {
              setScore(0);
              setRound(buildRound());
            }}
            className="grid size-10 place-items-center rounded-2xl bg-muted text-foreground"
            aria-label="إعادة اللعبة"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid place-items-center rounded-3xl bg-muted py-10">
        <span className={`text-7xl ${correct ? "" : "animate-float"}`}>{round.target}</span>
        {correct && (
          <p className="mt-3 flex items-center gap-2 text-lg font-extrabold text-success">
            <Check className="size-5" /> أحسنت!
          </p>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {round.options.map((option) => (
          <button
            key={option}
            onClick={() => handlePick(option)}
            className={`tile-pop grid place-items-center rounded-3xl border-4 py-8 text-5xl shadow-card hover:-translate-y-1 ${
              wrong === option
                ? "border-destructive bg-destructive/10"
                : "border-transparent bg-background"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function GamesPage() {
  const [active, setActive] = useState<GameCategory | "الكل">("الكل");
  const filtered = useMemo(
    () => (active === "الكل" ? games : games.filter((g) => g.category === active)),
    [active],
  );

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">مكتبة الألعاب</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          ألعاب قصيرة مصمّمة لمهارة واحدة في كل مرة، مع تعزيز فوري وبدون مؤثرات مزعجة.
        </p>

        <div className="mt-8">
          <MatchingGame />
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {(["الكل", ...categories] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-5 py-2 text-sm font-extrabold transition-colors ${
                active === cat
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <article key={g.id} className="tile-pop rounded-3xl bg-card p-6 shadow-card">
              <div className="flex items-center gap-3">
                <span className="grid size-14 place-items-center rounded-2xl bg-muted text-3xl">
                  {g.emoji}
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-ink">{g.title}</h3>
                  <p className="text-xs font-bold text-secondary">{g.category}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{g.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">
                  حوالي {g.minutes} دقائق
                </span>
                {g.playable ? (
                  <span className="rounded-full bg-success px-4 py-1.5 text-xs font-extrabold text-success-foreground">
                    قابلة للعب الآن
                  </span>
                ) : (
                  <span className="rounded-full bg-muted px-4 py-1.5 text-xs font-extrabold text-muted-foreground">
                    قريبًا
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
