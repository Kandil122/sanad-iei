import { createFileRoute } from "@tanstack/react-router";
import { Clock, Trophy, Target, TrendingUp } from "lucide-react";
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

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "تقارير تقدم الطفل | أوتسيمو بالعربية" },
      {
        name: "description",
        content:
          "لوحة الأهل في أوتسيمو بالعربية: دقائق اللعب اليومية، المهارات المكتسبة، ونسب التقدم في كل مجال مهاري.",
      },
      { property: "og:title", content: "تقارير تقدم الطفل | أوتسيمو بالعربية" },
      {
        property: "og:description",
        content: "تابع تقدم طفلك أسبوعيًا: وقت اللعب، دقة الإجابات، والمهارات التي أتمّها.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

const week = [
  { day: "السبت", minutes: 12 },
  { day: "الأحد", minutes: 18 },
  { day: "الاثنين", minutes: 9 },
  { day: "الثلاثاء", minutes: 22 },
  { day: "الأربعاء", minutes: 15 },
  { day: "الخميس", minutes: 26 },
  { day: "الجمعة", minutes: 14 },
];

const skills = [
  { name: "التمييز البصري", value: 82 },
  { name: "المفردات والنطق", value: 64 },
  { name: "المهارات الحياتية", value: 48 },
  { name: "الرياضيات المبكرة", value: 37 },
  { name: "المهارات الاجتماعية", value: 55 },
];

const stats = [
  { icon: Clock, label: "دقائق هذا الأسبوع", value: "١١٦" },
  { icon: Trophy, label: "مهارات مكتسبة", value: "٢٣" },
  { icon: Target, label: "دقة الإجابات", value: "٧٨٪" },
  { icon: TrendingUp, label: "أيام متواصلة", value: "٦" },
];

function ReportsPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">تقارير التقدم</h1>
        <p className="mt-2 text-muted-foreground">ملخص أسبوع سليم — بيانات تجريبية للعرض.</p>

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

        <div className="mt-8 rounded-3xl bg-card p-6 shadow-card">
          <h2 className="text-lg font-extrabold text-ink">توصيات الأخصائي</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>• كرّر لعبة «كلماتي الأولى» ٣ مرات أسبوعيًا لتثبيت المفردات الجديدة.</li>
            <li>• الرياضيات المبكرة تحتاج دعمًا: ابدأ بلعبة «عُدّ معي» بمستوى أسهل.</li>
            <li>• استخدم لوحة التواصل وقت الطعام لتعميم الطلب في مواقف حقيقية.</li>
          </ul>
        </div>
      </section>
    </AppShell>
  );
}
