import Link from "next/link";
import { ArrowUpRight, Building2, Plus, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function WorkspacePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: businesses, error } = await supabase
    .from("businesses")
    .select("id, name, business_type, created_by, created_at")
    .order("created_at", { ascending: true });

  const availableBusinesses = businesses ?? [];
  const ownedCount = availableBusinesses.filter((business) => business.created_by === user.id).length;
  const canCreate = ownedCount < 3;

  return (
    <div>
      <header className="page-heading">
        <div>
          <h1 className="page-title">Your workspaces</h1>
          <p className="page-description">Choose a business to open its workspace, or create a new business profile.</p>
        </div>
        {canCreate ? (
          <Link className="btn btn-primary" href="/app/businesses/new"><Plus size={16} /> New business</Link>
        ) : null}
      </header>

      {error ? (
        <div className="form-message error">We couldn&apos;t load your business profiles. Refresh the page and try again.</div>
      ) : null}

      {availableBusinesses.length === 0 ? (
        <section className="empty-panel">
          <div className="business-symbol"><Building2 size={20} /></div>
          <h2 className="card-title">Set up your first business</h2>
          <p className="muted" style={{ maxWidth: 460, margin: 0, lineHeight: 1.65 }}>
            Add your business details to create a workspace. Your GSTIN can be saved here, but it will not be verified against a government portal in Phase 1.
          </p>
          <Link className="btn btn-primary" href="/app/businesses/new"><Plus size={16} /> Create business profile</Link>
        </section>
      ) : (
        <div className="content-grid">
          {availableBusinesses.map((business) => (
            <Link className="card business-card" href={"/app/businesses/" + business.id} key={business.id}>
              <div>
                <div className="business-symbol"><Building2 size={20} /></div>
                <h2 className="card-title" style={{ marginTop: 15 }}>{business.name}</h2>
                <p className="muted" style={{ margin: "6px 0 0" }}>
                  {business.business_type || "Business workspace"}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <span className="status-pill"><ShieldCheck size={12} style={{ marginRight: 5 }} /> Authorized workspace</span>
                <ArrowUpRight size={17} color="#2F6FED" />
              </div>
            </Link>
          ))}
          {canCreate ? (
            <Link className="card business-card" href="/app/businesses/new" style={{ borderStyle: "dashed", background: "transparent", justifyContent: "center" }}>
              <div className="business-symbol"><Plus size={20} /></div>
              <div>
                <h2 className="card-title" style={{ marginTop: 12 }}>Add another business</h2>
                <p className="muted" style={{ margin: "6px 0 0" }}>{ownedCount} of 3 business profiles used</p>
              </div>
            </Link>
          ) : (
            <div className="card" style={{ background: "#f8fafc" }}>
              <h2 className="card-title">Business profile limit reached</h2>
              <p className="muted" style={{ lineHeight: 1.6 }}>This account can create up to 3 business profiles in the current plan.</p>
            </div>
          )}
        </div>
      )}

      <div className="notice" style={{ marginTop: 20 }}>
        <ShieldCheck size={17} />
        <span>Each workspace is protected by database access rules. Only businesses your account is allowed to access are shown here.</span>
      </div>
    </div>
  );
}
