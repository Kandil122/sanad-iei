import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GamePlayer } from "@/components/GamePlayer";
import { categories, games, type Game, type GameCategory } from "@/lib/content";


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


function GamesPage() {
  const [active, setActive] = useState<GameCategory | "الكل">("الكل");
  const [current, setCurrent] = useState<Game>(games[0]!);
  const [playing, setPlaying] = useState(false);
  const filtered = useMemo(
    () => (active === "الكل" ? games : games.filter((g) => g.category === active)),
    [active],
  );

  const startGame = (game: Game) => {
    setCurrent(game);
    setPlaying(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">مكتبة الألعاب</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          ألعاب قصيرة مصمّمة لمهارة واحدة في كل مرة، مع تعزيز فوري وبدون مؤثرات مزعجة.
        </p>

        <div className="mt-8">
          {playing ? (
            <GamePlayer
              key={current.id + String(playing)}
              game={current}
              onClose={() => setPlaying(false)}
            />
          ) : (
            <div className="rounded-[2rem] bg-card p-6 text-center shadow-play sm:p-8">
              <span className="text-6xl">🎮</span>
              <h2 className="mt-3 font-display text-2xl font-extrabold text-ink">
                اختر لعبة وابدأ اللعب
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                كل الألعاب أدناه قابلة للعب الآن — اضغط «العب» على أي بطاقة.
              </p>
              <button
                onClick={() => startGame(current)}
                className="mt-5 rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-card"
              >
                العب {current.title}
              </button>
            </div>
          )}
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
