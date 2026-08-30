import { supabase } from "@/integrations/supabase/client";

export type SessionRow = {
  id: string;
  game_id: string;
  game_title: string;
  category: string | null;
  score: number;
  total: number;
  seconds_played: number;
  created_at: string;
};

export async function saveGameSession(input: {
  game_id: string;
  game_title: string;
  category?: string | null;
  score: number;
  total: number;
  seconds_played: number;
}) {
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user.id;
  if (!userId) return;
  await supabase.from("game_sessions").insert({ ...input, user_id: userId });
}

export async function fetchMySessions(): Promise<SessionRow[]> {
  const { data, error } = await supabase
    .from("game_sessions")
    .select("id, game_id, game_title, category, score, total, seconds_played, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data ?? []) as SessionRow[];
}

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  child_name: string | null;
  agreement_accepted_at: string | null;
};

export async function fetchMyProfile(): Promise<Profile | null> {
  const { data: auth } = await supabase.auth.getSession();
  const userId = auth.session?.user.id;
  if (!userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url, child_name, agreement_accepted_at")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  if (data) return data as Profile;
  // Fallback in case the profile row is missing.
  const { data: created } = await supabase
    .from("profiles")
    .insert({ id: userId })
    .select("id, display_name, avatar_url, child_name, agreement_accepted_at")
    .maybeSingle();
  return (created as Profile) ?? null;
}

export async function acceptAgreement(childName?: string) {
  const { data: auth } = await supabase.auth.getSession();
  const userId = auth.session?.user.id;
  if (!userId) throw new Error("لا توجد جلسة");
  const patch: Record<string, unknown> = { agreement_accepted_at: new Date().toISOString() };
  if (childName) patch['child_name'] = childName;
  const { error } = await supabase.from("profiles").update(patch).eq("id", userId);
  if (error) throw error;
}
