import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, FileText, Package, ReceiptText, Settings2, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Business dashboard" };

export default async function BusinessDashboard({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;
  const supabase = await createClient();
  const { data: business, error } = await supabase
    .from("businesses")
    .select("id, name, business_type")
    .eq("id", businessId)
    .single();

  if (error || !business) {
    notFound();
  }

  const modules = [
    {
      title: "Billing & invoices",
      description: "Create GST invoices, quotations, and downloadable documents.",
      icon: FileText,
      phase: "Phase 2"
    },
    {
      title: "Products & inventory",
      description: "Manage products, suppliers, purchase entries, and stock levels.",
      icon: Package,
      phase: "Phase 3"
    },
    {
      title: "Expenses & purchases",
      description: "Record business costs and review purchase history.",
      icon: ReceiptText,
      phase: "Phase 3"
    },
    {
      title: "Reports",
      description: "Review sales, expense, and basic tax summaries.",
      icon: BarChart3,
      phase: "Phase 4"
    }
  ];

  return (
    <div>
      <header className="page-heading">
        <div>
          <p className="muted" style={{ margin: "0 0 6px", fontSize: 12 }}>{business.business_type || "Business workspace"}</p>
          <h1 className="page-title">{business.name}</h1>
          <p className="page-description">Your workspace is ready. Set up your business details before the next modules are added.</p>
        </div>
        <Link className="btn btn-secondary" href={"/app/businesses/" + businessId + "/settings"}><Settings2 size={16} /> Business settings</Link>
      </header>

      <section className="card" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
          <div className="business-symbol"><ShieldCheck size={20} /></div>
          <div>
            <h2 className="card-title">Your business workspace is set up</h2>
            <p className="muted" style={{ margin: "6px 0 0", maxWidth: 690, lineHeight: 1.7 }}>
              Phase 1 gives you secure access, business settings, and a foundation for the billing and management tools. No financial totals or transactions are shown until those features are implemented.
            </p>
            <Link href={"/app/businesses/" + businessId + "/settings"} className="inline-link" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 13 }}>
              Review business details <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <header style={{ marginBottom: 13 }}>
        <h2 className="card-title" style={{ fontSize: 16 }}>Your business tools</h2>
        <p className="page-description" style={{ marginTop: 5 }}>These modules will be enabled as the next development phases are completed.</p>
      </header>

      <div className="module-grid">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <div className="card module-card" key={module.title}>
              <div className="module-icon"><Icon size={19} /></div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <h3 className="card-title">{module.title}</h3>
                  <span className="status-pill">{module.phase} · Coming soon</span>
                </div>
                <p className="muted" style={{ margin: "8px 0 0", lineHeight: 1.6 }}>{module.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
