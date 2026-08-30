import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Gamepad2, MessageCircleHeart, LineChart, Home, Menu, X, LogOut } from "lucide-react";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

const nav = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/games", label: "الألعاب", icon: Gamepad2 },
  { to: "/aac", label: "لوحة التواصل", icon: MessageCircleHeart },
  { to: "/reports", label: "تقارير التقدم", icon: LineChart },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-sun text-xl shadow-card">
              🌟
            </span>
            <span className="font-display text-2xl font-extrabold text-ink">سند</span>
          </Link>

          <nav className="mr-auto hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "bg-muted text-primary" }}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/games"
            className="hidden rounded-full bg-primary px-5 py-2 text-sm font-extrabold text-primary-foreground shadow-card transition-transform hover:scale-105 md:inline-block"
          >
            ابدأ اللعب
          </Link>

          <button
            aria-label="القائمة"
            onClick={() => setOpen((v) => !v)}
            className="mr-auto grid size-10 place-items-center rounded-2xl bg-muted text-foreground md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open && (
          <nav className="border-t border-border/60 bg-background px-4 py-3 md:hidden">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-2xl px-3 py-3 text-base font-bold text-foreground"
              >
                <item.icon className="size-5 text-primary" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main>{children}</main>

      <footer className="mt-20 border-t border-border/60 bg-card/70">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-extrabold text-ink">سند</p>
            <p className="mt-2 text-sm text-muted-foreground">
              تعليم خاص وعلاج تخاطب للأطفال، بالعربية الفصحى وبأسلوب اللعب.
            </p>
          </div>
          <div>
            <p className="mb-3 font-bold text-foreground">التطبيقات</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>التعليم الخاص</li>
              <li>لوحة التواصل البديل</li>
              <li>علاج التخاطب</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-bold text-foreground">لمن</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>أطفال طيف التوحد</li>
              <li>متلازمة داون</li>
              <li>تأخر النطق واللغة</li>
              <li>صعوبات التعلم</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-bold text-foreground">الدعم</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>الأسئلة الشائعة</li>
              <li>دليل الأهل</li>
              <li>تواصل معنا</li>
            </ul>
          </div>
        </div>
        <p className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} سند — بدون إعلانات، آمن للأطفال.
        </p>
      </footer>
    </div>
  );
}
