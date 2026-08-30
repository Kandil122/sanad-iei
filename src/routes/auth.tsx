import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | سند" },
      {
        name: "description",
        content: "سجّل دخولك إلى سند بحساب جوجل أو بالبريد الإلكتروني لمتابعة تقدم طفلك وحفظ نتائجه.",
      },
      { property: "og:title", content: "تسجيل الدخول | سند" },
      {
        property: "og:description",
        content: "حساب واحد لكل طفل: حفظ النتائج وتقارير تقدم خاصة بك.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) void navigate({ to: "/reports", replace: true });
    });
    void supabase.auth.getSession().then(({ data: got }) => {
      if (got.session) void navigate({ to: "/reports", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  const google = async () => {
    setError(null);
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("تعذّر تسجيل الدخول بجوجل، حاول مرة أخرى.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/reports", replace: true });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (mode === "signup" && !agree) {
      setError("يجب الموافقة على اتفاقية الاستخدام أولًا.");
      return;
    }
    setBusy(true);
    if (mode === "signup") {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      setBusy(false);
      if (err) {
        setError(err.message);
        return;
      }
      if (!data.session) {
        setMessage("أرسلنا رسالة تأكيد إلى بريدك، افتحها لتفعيل الحساب.");
      }
      return;
    }
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) setError("البريد أو كلمة المرور غير صحيحة.");
  };

  return (
    <AppShell>
      <section className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-[2rem] bg-card p-7 shadow-play">
          <div className="grid place-items-center gap-2 text-center">
            <span className="grid size-16 place-items-center rounded-3xl bg-sun text-4xl">🌟</span>
            <h1 className="font-display text-2xl font-extrabold text-ink">
              {mode === "signin" ? "تسجيل الدخول" : "حساب جديد"}
            </h1>
            <p className="text-sm text-muted-foreground">
              حساب لكل طفل: تُحفظ النتائج وتظهر في تقارير التقدم.
            </p>
          </div>

          <button
            onClick={() => void google()}
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-background px-5 py-3.5 text-base font-extrabold text-ink shadow-card disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.7z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.1-4 1.1a7 7 0 0 1-6.6-4.8H1.4v3.1A12 12 0 0 0 12 24z"
              />
              <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1z" />
              <path
                fill="#EA4335"
                d="M12 4.8c1.8 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1A7 7 0 0 1 12 4.8z"
              />
            </svg>
            الدخول بحساب جوجل
          </button>

          <div className="my-5 flex items-center gap-3 text-xs font-bold text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> أو <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={(e) => void submit(e)} className="grid gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="rounded-2xl border-2 border-border bg-background px-4 py-3 text-base font-bold text-ink outline-none focus:border-primary"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="rounded-2xl border-2 border-border bg-background px-4 py-3 text-base font-bold text-ink outline-none focus:border-primary"
            />

            {mode === "signup" && (
              <label className="flex items-start gap-3 rounded-2xl bg-muted p-3 text-sm font-bold text-foreground">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 size-4"
                />
                <span>
                  أوافق على{" "}
                  <Link to="/agreement" className="text-primary underline">
                    اتفاقية الاستخدام وسياسة الخصوصية
                  </Link>
                </span>
              </label>
            )}

            {error && <p className="text-sm font-bold text-destructive">{error}</p>}
            {message && <p className="text-sm font-bold text-success">{message}</p>}

            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-primary px-6 py-3.5 text-base font-extrabold text-primary-foreground shadow-card disabled:opacity-60"
            >
              {mode === "signin" ? "دخول" : "إنشاء الحساب"}
            </button>
          </form>

          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setMessage(null);
            }}
            className="mt-4 w-full text-sm font-extrabold text-primary"
          >
            {mode === "signin" ? "ليس لديك حساب؟ أنشئ حسابًا" : "لديك حساب؟ سجّل الدخول"}
          </button>
        </div>
      </section>
    </AppShell>
  );
}
