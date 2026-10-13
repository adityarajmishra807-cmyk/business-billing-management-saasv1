import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { redirect } from "next/navigation";
import { BusinessForm } from "@/components/business-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Create business" };

export default async function NewBusinessPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count } = await supabase
    .from("businesses")
    .select("id", { count: "exact", head: true })
    .eq("created_by", user.id);

  if ((count ?? 0) >= 3) {
    return (
      <div>
        <header className="page-heading">
          <div>
            <h1 className="page-title">Business profile limit reached</h1>
            <p className="page-description">One account can create up to three business profiles in this version.</p>
          </div>
          <Link className="btn btn-secondary" href="/app"><ArrowLeft size={15} /> Back to workspaces</Link>
        </header>
        <div className="notice"><Building2 size={17} /><span>You already have three business profiles. Open an existing workspace or contact your administrator if your requirements have changed.</span></div>
      </div>
    );
  }

  return (
    <div>
      <header className="page-heading">
        <div>
          <h1 className="page-title">Create a business</h1>
          <p className="page-description">Add the details used to identify this workspace and its future documents.</p>
        </div>
        <Link className="btn btn-secondary" href="/app"><ArrowLeft size={15} /> Back</Link>
      </header>
      <div className="card" style={{ maxWidth: 820 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <div className="business-symbol"><Building2 size={20} /></div>
          <div>
            <h2 className="card-title">Business details</h2>
            <p className="muted" style={{ margin: "4px 0 0", fontSize: 12 }}>Fields marked required must be completed.</p>
          </div>
        </div>
        <BusinessForm mode="create" />
      </div>
    </div>
  );
}
