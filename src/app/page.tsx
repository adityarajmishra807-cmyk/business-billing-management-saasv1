import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Auth-dependent entry route must be rendered at request time, not prerendered.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  redirect(user ? "/app" : "/login");
}
