import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { GamePlayer } from "@/components/GamePlayer";
import { categories, games, type Game, type GameCategory } from "@/lib/content";


export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "ألعاب تعليمية عربية للأطفال | سند" },
      {
        name: "description",
        content:
          "أكثر من ٦٠ لعبة تعليمية بالعربية للأطفال: الأساسيات، اللغة والنطق، المهارات الحياتية، الرياضيات والمهارات الاجتماعية — والعب مباشرة لعبة طابِق الصور.",
      },
      { property: "og:title", content: "ألعاب تعليمية عربية للأطفال | سند" },
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
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">الألعاب</h1>

        <div className="mt-8">
          {playing ? (
            <GamePlayer
              key={current.id + String(playing)}
              game={current}
              onClose={() => setPlaying(false)}
            />
          ) : (
            <button
              onClick={() => startGame(current)}
              className="grid w-full place-items-center gap-3 rounded-[2rem] bg-card p-10 shadow-play"
            >
              <span className="text-7xl">🎮</span>
              <span className="rounded-full bg-primary px-8 py-3 text-base font-extrabold text-primary-foreground shadow-card">
                العب
              </span>
            </button>
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

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((g) => (
            <button
              key={g.id}
              onClick={() => startGame(g)}
              aria-label={g.title}
              className="tile-pop grid place-items-center gap-3 rounded-3xl bg-card p-6 text-center shadow-card hover:-translate-y-1 hover:shadow-play"
            >
              <span className="grid size-20 place-items-center rounded-3xl bg-muted text-5xl">
                {g.emoji}
              </span>
              <span className="text-base font-extrabold text-ink">{g.title}</span>
            </button>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

