import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, Trophy, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { games } from "@/lib/content";
import { acceptAgreement, fetchMyProfile, fetchMySessions, type SessionRow } from "@/lib/progress";
import { agreementSections } from "@/routes/agreement";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({
    meta: [
      { title: "تقارير تقدم طفلي | سند" },
      {
        name: "description",
        content:
          "تقارير خاصة بحسابك في سند: دقائق اللعب اليومية، دقة إجابات طفلك، والتقدم في كل مجال مهاري.",
      },
      { property: "og:title", content: "تقارير تقدم طفلي | سند" },
      {
        property: "og:description",
        content: "تابع تقدم طفلك: وقت اللعب، دقة الإجابات، والمهارات التي أتمّها.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const categoryLabels = [
  "الأساسيات",
  "اللغة والنطق",
  "المهارات الحياتية",
  "الرياضيات",
  "المهارات الاجتماعية",
] as const;

function buildWeek(rows: SessionRow[]) {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const key = d.toDateString();
    const minutes = Math.round(
      rows
        .filter((r) => new Date(r.created_at).toDateString() === key)
        .reduce((sum, r) => sum + r.seconds_played, 0) / 60,
    );
    return { day: dayNames[d.getDay()]!, minutes };
  });
}

function buildSkills(rows: SessionRow[]) {
  return categoryLabels.map((name) => {
    const inCat = rows.filter(
      (r) => r.category === name || games.find((g) => g.id === r.game_id)?.category === name,
    );
    const total = inCat.reduce((s, r) => s + r.total, 0);
    const score = inCat.reduce((s, r) => s + r.score, 0);
    return { name, value: total ? Math.round((score / total) * 100) : 0 };
  });
}

function streakDays(rows: SessionRow[]) {
  const played = new Set(rows.map((r) => new Date(r.created_at).toDateString()));
  let streak = 0;
  const d = new Date();
  while (played.has(d.toDateString())) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function AgreementGate({ onAccepted }: { onAccepted: () => void }) {
  const [childName, setChildName] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-[2rem] bg-card p-7 shadow-play">
        <h1 className="font-display text-2xl font-extrabold text-ink">اتفاقية الاستخدام</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          قبل حفظ نتائج طفلك، وافق على الاتفاقية.
        </p>
        <div className="mt-5 grid gap-3">
          {agreementSections.map((s) => (
            <div key={s.title} className="flex gap-3 rounded-2xl bg-muted p-4">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <p className="font-extrabold text-ink">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
        <input
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder="اسم الطفل (اختياري)"
          className="mt-5 w-full rounded-2xl border-2 border-border bg-background px-4 py-3 font-bold text-ink outline-none focus:border-primary"
        />
        <button
          disabled={busy}
          onClick={() => {
            setBusy(true);
            void acceptAgreement(childName.trim() || undefined)
              .then(onAccepted)
              .finally(() => setBusy(false));
          }}
          className="mt-4 w-full rounded-full bg-primary px-6 py-3.5 text-base font-extrabold text-primary-foreground shadow-card disabled:opacity-60"
        >
          أوافق وأتابع
        </button>
        <Link to="/agreement" className="mt-3 block text-center text-sm font-extrabold text-primary">
          قراءة النص كاملًا
        </Link>
      </div>
    </section>
  );
}

function ReportsPage() {
  const profile = useQuery({ queryKey: ["profile"], queryFn: fetchMyProfile });
  const sessions = useQuery({ queryKey: ["sessions"], queryFn: fetchMySessions });

  if (profile.data && !profile.data.agreement_accepted_at) {
    return (
      <AppShell>
        <AgreementGate onAccepted={() => void profile.refetch()} />
      </AppShell>
    );
  }

  const rows = sessions.data ?? [];
  const week = buildWeek(rows);
  const skills = buildSkills(rows);
  const totalScore = rows.reduce((s, r) => s + r.score, 0);
  const totalQuestions = rows.reduce((s, r) => s + r.total, 0);
  const minutes = Math.round(rows.reduce((s, r) => s + r.seconds_played, 0) / 60);

  const stats = [
    { icon: Clock, label: "دقائق اللعب", value: String(minutes) },
    { icon: Trophy, label: "نجوم مكتسبة", value: String(totalScore) },
    {
      icon: Target,
      label: "دقة الإجابات",
      value: totalQuestions ? `${Math.round((totalScore / totalQuestions) * 100)}٪` : "—",
    },
    { icon: TrendingUp, label: "أيام متواصلة", value: String(streakDays(rows)) },
  ];

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">تقارير التقدم</h1>
        <p className="mt-2 text-muted-foreground">
          {profile.data?.child_name
            ? `تقدّم ${profile.data.child_name}`
            : (profile.data?.display_name ?? "حسابك")}
        </p>

        {rows.length === 0 && !sessions.isLoading && (
          <div className="mt-6 grid place-items-center gap-3 rounded-[2rem] bg-card p-10 text-center shadow-card">
            <span className="text-6xl">🎮</span>
            <p className="font-extrabold text-ink">لا نتائج بعد — ابدأ أول لعبة!</p>
            <Link
              to="/games"
              className="rounded-full bg-primary px-7 py-3 text-base font-extrabold text-primary-foreground shadow-card"
            >
              العب الآن
            </Link>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl bg-card p-6 shadow-card">
              <span className="grid size-11 place-items-center rounded-2xl bg-sun text-ink">
                <s.icon className="size-5" />
              </span>
              <p className="mt-4 font-display text-3xl font-extrabold text-ink">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <div className="rounded-3xl bg-card p-6 shadow-card lg:col-span-3">
            <h2 className="text-lg font-extrabold text-ink">دقائق اللعب اليومية</h2>
            <div className="mt-4 h-72" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={week}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      fontFamily: "var(--font-sans)",
                    }}
                    formatter={(v) => [`${v} دقيقة`, "وقت اللعب"]}
                  />
                  <Bar dataKey="minutes" radius={[10, 10, 0, 0]} fill="var(--chart-1)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl bg-card p-6 shadow-card lg:col-span-2">
            <h2 className="text-lg font-extrabold text-ink">التقدم في المهارات</h2>
            <div className="mt-5 space-y-5">
              {skills.map((s) => (
                <div key={s.name}>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold">
                    <span className="text-foreground">{s.name}</span>
                    <span className="text-muted-foreground">{s.value}٪</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-sea" style={{ width: `${s.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {rows.length > 0 && (
          <div className="mt-8 rounded-3xl bg-card p-6 shadow-card">
            <h2 className="text-lg font-extrabold text-ink">آخر الجلسات</h2>
            <ul className="mt-4 divide-y divide-border">
              {rows.slice(0, 10).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3 text-sm font-bold">
                  <span className="text-ink">
                    {games.find((g) => g.id === r.game_id)?.emoji ?? "🎯"} {r.game_title}
                  </span>
                  <span className="text-muted-foreground">
                    {r.score} / {r.total} · {new Date(r.created_at).toLocaleDateString("ar-EG")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </AppShell>
  );
}
