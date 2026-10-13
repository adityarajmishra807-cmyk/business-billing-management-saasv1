import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedAppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("businesses")
    .select("id, name, created_by")
    .order("created_at", { ascending: true });

  const businesses = (data ?? []).map((item) => ({
    id: String(item.id),
    name: String(item.name),
    created_by: String(item.created_by)
  }));

  const fullName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
  const displayName = fullName || user.email || "Account";
  const initials = displayName
    .split(/[@ ._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <AppShell
      userName={displayName}
      userEmail={user.email ?? ""}
      initials={initials || "U"}
      userId={user.id}
      businesses={businesses}
    >
      {children}
    </AppShell>
  );
}
