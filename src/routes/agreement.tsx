import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/agreement")({
  head: () => ({
    meta: [
      { title: "اتفاقية الاستخدام وسياسة الخصوصية | سند" },
      {
        name: "description",
        content:
          "اتفاقية استخدام تطبيق سند وسياسة الخصوصية: كيف نحفظ بيانات الحساب ونتائج الطفل، وحقوق الأهل في حذفها.",
      },
      { property: "og:title", content: "اتفاقية الاستخدام | سند" },
      {
        property: "og:description",
        content: "شروط استخدام سند وحماية بيانات الأطفال — بدون إعلانات ولا بيع بيانات.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AgreementPage,
});

export const agreementSections = [
  {
    icon: "👨‍👩‍👧",
    title: "الحساب للأهل",
    body: "يُنشئ الحساب أحد الوالدين أو المعلّم المسؤول (١٨ سنة أو أكثر)، ويستخدم الطفل التطبيق تحت إشرافه.",
  },
  {
    icon: "🔒",
    title: "ما نحفظه",
    body: "بريدك الإلكتروني واسمك من حساب جوجل، واسم الطفل إن أدخلته، ونتائج الألعاب (الدرجة والوقت) لعرض تقارير التقدم.",
  },
  {
    icon: "🚫",
    title: "ما لا نفعله",
    body: "لا إعلانات، ولا بيع أو مشاركة بيانات طفلك مع أطراف خارجية، ولا مشتريات داخل اللعب.",
  },
  {
    icon: "🗑️",
    title: "حقوقك",
    body: "يمكنك طلب حذف حسابك وكل نتائج طفلك في أي وقت، وسنحذفها نهائيًا.",
  },
  {
    icon: "🩺",
    title: "ليس تشخيصًا طبيًا",
    body: "سند أداة تعليمية مساندة، ولا تُغني عن أخصائي التربية الخاصة أو علاج التخاطب.",
  },
];

function AgreementPage() {
  return (
    <AppShell>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
          اتفاقية الاستخدام والخصوصية
        </h1>
        <div className="mt-8 grid gap-4">
          {agreementSections.map((s) => (
            <div key={s.title} className="flex gap-4 rounded-3xl bg-card p-6 shadow-card">
              <span className="text-4xl">{s.icon}</span>
              <div>
                <h2 className="text-lg font-extrabold text-ink">{s.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
        <Link
          to="/auth"
          className="mt-8 inline-block rounded-full bg-primary px-7 py-3.5 text-base font-extrabold text-primary-foreground shadow-card"
        >
          متابعة إلى تسجيل الدخول
        </Link>
      </section>
    </AppShell>
  );
}
