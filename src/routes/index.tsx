import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, BarChart3, Languages, Heart, Play } from "lucide-react";
import heroKids from "@/assets/hero-kids.jpg";
import { AppShell } from "@/components/AppShell";
import { games } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سند | تعليم خاص وعلاج تخاطب للأطفال" },
      {
        name: "description",
        content:
          "منصة سند: أكثر من ٦٠ لعبة تعليمية لأطفال طيف التوحد ومتلازمة داون وتأخر النطق، مع لوحة تواصل بديل وتقارير تقدم للأهل.",
      },
      { property: "og:title", content: "سند | تعليم خاص للأطفال" },
      {
        property: "og:description",
        content: "ألعاب تعليمية عربية، لوحة تواصل بديل، وتقارير تقدم — بدون إعلانات وآمن للأطفال.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: Sparkles,
    title: "منهج شخصي لكل طفل",
    text: "تتكيّف الألعاب مع مستوى طفلك وسرعته، وتتقدّم خطوة بخطوة.",
  },
  {
    icon: Languages,
    title: "عربية كاملة",
    text: "أصوات ونصوص بالعربية الفصحى، وواجهة من اليمين إلى اليسار.",
  },
  {
    icon: BarChart3,
    title: "تقارير مفصّلة للأهل",
    text: "تابع دقائق اللعب، المهارات المكتسبة، ونقاط تحتاج تدريبًا.",
  },
  {
    icon: ShieldCheck,
    title: "آمن وبدون إعلانات",
    text: "لا إعلانات ولا مشتريات داخل اللعب ولا روابط خارجية.",
  },
];

function Index() {
  return (
    <AppShell>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-16 md:grid-cols-2 md:pt-16">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-accent-foreground">
            <Heart className="size-4" /> مصمّم مع أخصائيي تربية خاصة
          </span>
          <h1 className="mt-5 font-display text-4xl leading-[1.2] font-extrabold text-ink sm:text-5xl md:text-6xl">
            تعليم خاص وعلاج تخاطب
            <span className="block text-primary">للأطفال بالعربية</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            أكثر من ٦٠ لعبة تعليمية لأطفال طيف التوحد، متلازمة داون، تأخر النطق وصعوبات التعلم — مع
            لوحة تواصل بديل وتقارير تقدم للأهل.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/games"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-extrabold text-primary-foreground shadow-play transition-transform hover:-translate-y-0.5"
            >
              <Play className="size-5" /> ابدأ اللعب مجانًا
            </Link>
            <Link
              to="/aac"
              className="inline-flex items-center gap-2 rounded-full border-2 border-secondary px-7 py-3.5 text-base font-extrabold text-secondary"
            >
              جرّب لوحة التواصل
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-sm font-bold text-muted-foreground">
            <span>+٦٠ لعبة تعليمية</span>
            <span>٥ مجالات مهارات</span>
            <span>بدون إعلانات</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-6 -right-4 size-24 rounded-full bg-sun opacity-70 blur-2xl" />
          <img
            src={heroKids}
            alt="أطفال يلعبون ألعابًا تعليمية على جهاز لوحي"
            width={1280}
            height={960}
            className="relative w-full rounded-[2rem] border-4 border-card shadow-play"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-3xl bg-card p-6 shadow-card">
              <span className="grid size-12 place-items-center rounded-2xl bg-sea text-primary-foreground">
                <f.icon className="size-6" />
              </span>
              <h3 className="mt-4 text-lg font-extrabold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
              ألعاب مختارة لطفلك
            </h2>
            <p className="mt-2 text-muted-foreground">
              كل لعبة تستهدف مهارة واحدة بجُمل قصيرة وتعزيز فوري.
            </p>
          </div>
          <Link to="/games" className="font-extrabold text-primary">
            كل الألعاب ←
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {games.slice(0, 6).map((g) => (
            <Link
              key={g.id}
              to="/games"
              className="tile-pop grid place-items-center gap-2 rounded-3xl bg-card p-5 text-center shadow-card hover:-translate-y-1 hover:shadow-play"
            >
              <span className="text-5xl">{g.emoji}</span>
              <h3 className="text-sm font-extrabold text-ink">{g.title}</h3>
            </Link>
          ))}
        </div>

      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="rounded-[2.5rem] bg-sun p-10 text-center shadow-play">
          <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
            جاهز لتبدأ رحلة طفلك؟
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink/80">
            ١٥ دقيقة يوميًا كافية لبناء مهارة جديدة. ابدأ بلعبة واحدة اليوم وتابع النتائج في تقارير
            التقدم.
          </p>
          <Link
            to="/games"
            className="mt-7 inline-block rounded-full bg-ink px-8 py-3.5 text-base font-extrabold text-background"
          >
            ابدأ الآن
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
