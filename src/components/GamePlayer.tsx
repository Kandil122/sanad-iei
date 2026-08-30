import { Check, RotateCcw, Star, Volume2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { buildRounds, type Round } from "@/lib/games";
import { saveGameSession } from "@/lib/progress";
import { speak as speakArabic } from "@/lib/speech";
import type { Game } from "@/lib/content";

function speak(text: string) {
  void speakArabic(text);
}


export function GamePlayer({ game, onClose }: { game: Game; onClose: () => void }) {
  const [rounds, setRounds] = useState<Round[]>(() => buildRounds(game.id));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [correct, setCorrect] = useState(false);
  const [done, setDone] = useState(false);
  const [ordered, setOrdered] = useState<string[]>([]);
  const startedAt = useRef(Date.now());
  const saved = useRef(false);

  const round = rounds[index];

  const shuffledSteps = useMemo(() => {
    if (!round || round.type !== "order") return [];
    return [...round.steps].sort(() => Math.random() - 0.5);
  }, [round]);

  useEffect(() => {
    if (round) speak(round.prompt);
  }, [round]);

  useEffect(() => {
    if (!done || saved.current) return;
    saved.current = true;
    void saveGameSession({
      game_id: game.id,
      game_title: game.title,
      category: game.category,
      score,
      total: rounds.length,
      seconds_played: Math.round((Date.now() - startedAt.current) / 1000),
    });
  }, [done, game.id, game.title, game.category, score, rounds.length]);

  const restart = () => {
    setRounds(buildRounds(game.id));
    setIndex(0);
    setScore(0);
    setDone(false);
    setOrdered([]);
    setCorrect(false);
    setWrong(null);
    startedAt.current = Date.now();
    saved.current = false;
  };

  const next = () => {
    setCorrect(false);
    setOrdered([]);
    if (index + 1 >= rounds.length) setDone(true);
    else setIndex((i) => i + 1);
  };

  const handlePick = (key: string) => {
    if (!round || round.type !== "pick" || correct) return;
    if (key === round.answerKey) {
      setCorrect(true);
      setWrong(null);
      setScore((s) => s + 1);
      speak("أحسنت");
      setTimeout(next, 900);
    } else {
      setWrong(key);
      setTimeout(() => setWrong(null), 600);
    }
  };

  const handleStep = (step: string) => {
    if (!round || round.type !== "order" || correct) return;
    if (round.steps[ordered.length] === step) {
      const nextOrdered = [...ordered, step];
      setOrdered(nextOrdered);
      speak(step);
      if (nextOrdered.length === round.steps.length) {
        setCorrect(true);
        setScore((s) => s + 1);
        setTimeout(next, 1200);
      }
    } else {
      setWrong(step);
      setTimeout(() => setWrong(null), 600);
    }
  };

  return (
    <div className="rounded-[2rem] bg-card p-6 shadow-play sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-extrabold text-ink">
          {game.emoji} {game.title}
        </h2>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-extrabold text-accent-foreground">
            <Star className="size-4" /> {score}
          </span>
          <button
            onClick={() => round && speak(round.prompt)}
            className="grid size-10 place-items-center rounded-2xl bg-sun text-ink"
            aria-label="سماع السؤال"
          >
            <Volume2 className="size-4" />
          </button>

          <button
            onClick={restart}
            className="grid size-10 place-items-center rounded-2xl bg-muted text-foreground"
            aria-label="إعادة اللعبة"
          >
            <RotateCcw className="size-4" />
          </button>
          <button
            onClick={onClose}
            className="grid size-10 place-items-center rounded-2xl bg-muted text-destructive"
            aria-label="إغلاق اللعبة"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {done ? (
        <div className="mt-8 grid place-items-center rounded-3xl bg-muted py-14 text-center">
          <span className="text-7xl">🎉</span>
          <p className="mt-4 font-display text-2xl font-extrabold text-ink">
            {score} / {rounds.length} 🌟
          </p>
          <div className="mt-5 flex gap-3">
            <button
              onClick={restart}
              className="rounded-full bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-card"
            >
              إعادة
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-card px-6 py-3 text-sm font-extrabold text-foreground shadow-card"
            >
              رجوع
            </button>
          </div>
        </div>
      ) : round?.type === "pick" ? (
        <>
          <div className="mt-6 grid place-items-center rounded-3xl bg-muted px-4 py-10 text-center">
            {round.display && (
              <span
                className={`max-w-full break-words text-6xl leading-tight ${correct ? "" : "animate-float"}`}
              >
                {round.display}
              </span>
            )}
            <p className="mt-3 text-lg font-extrabold text-ink">{round.prompt}</p>
            {correct && (
              <p className="mt-3 flex items-center gap-2 text-lg font-extrabold text-success">
                <Check className="size-5" /> أحسنت!
              </p>
            )}
          </div>

          <div
            className={`mt-5 grid gap-3 ${round.options.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}
          >
            {round.options.map((option) => (
              <button
                key={option.key}
                onClick={() => handlePick(option.key)}
                className={`tile-pop flex flex-col items-center justify-center gap-2 rounded-3xl border-4 px-2 py-8 shadow-card hover:-translate-y-1 ${
                  wrong === option.key
                    ? "border-destructive bg-destructive/10"
                    : "border-transparent bg-background"
                }`}
              >
                <span className="break-words text-center text-4xl leading-snug">{option.emoji}</span>
                {option.label && <span className="text-sm font-extrabold text-ink">{option.label}</span>}
              </button>
            ))}
          </div>
        </>
      ) : round?.type === "order" ? (
        <>
          <div className="mt-6 rounded-3xl bg-muted p-5">
            <p className="text-lg font-extrabold text-ink">{round.prompt}</p>
            <ol className="mt-4 space-y-2">
              {round.steps.map((_, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 text-sm font-bold text-ink shadow-card"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sun text-xs font-extrabold text-ink">
                    {i + 1}
                  </span>
                  {ordered[i] ?? <span className="text-muted-foreground">…</span>}
                </li>
              ))}
            </ol>
            {correct && (
              <p className="mt-4 flex items-center gap-2 text-lg font-extrabold text-success">
                <Check className="size-5" /> ترتيب صحيح، أحسنت!
              </p>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {shuffledSteps
              .filter((s) => !ordered.includes(s))
              .map((step) => (
                <button
                  key={step}
                  onClick={() => handleStep(step)}
                  className={`tile-pop rounded-3xl border-4 px-4 py-5 text-start text-sm font-extrabold text-ink shadow-card hover:-translate-y-1 ${
                    wrong === step
                      ? "border-destructive bg-destructive/10"
                      : "border-transparent bg-background"
                  }`}
                >
                  {step}
                </button>
              ))}
          </div>
        </>
      ) : null}

      {!done && (
        <p className="mt-4 text-center text-xs font-bold text-muted-foreground">
          {index + 1} / {rounds.length}
        </p>
      )}
    </div>
  );
}
