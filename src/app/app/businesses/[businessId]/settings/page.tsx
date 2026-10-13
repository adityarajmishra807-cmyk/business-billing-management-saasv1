import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import { notFound } from "next/navigation";
import { BusinessForm } from "@/components/business-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Business settings" };

export default async function BusinessSettingsPage({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;
  const supabase = await createClient();
  const { data: business, error } = await supabase
    .from("businesses")
    .select("id, name, business_type, contact_email, phone, address, gstin")
    .eq("id", businessId)
    .single();

  if (error || !business) {
    notFound();
  }

  return (
    <div>
      <header className="page-heading">
        <div>
          <h1 className="page-title">Business settings</h1>
          <p className="page-description">Update the details saved for this business profile.</p>
        </div>
        <Link className="btn btn-secondary" href={"/app/businesses/" + businessId}><ArrowLeft size={15} /> Back to workspace</Link>
      </header>

      <div className="card" style={{ maxWidth: 820 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <div className="business-symbol"><Building2 size={20} /></div>
          <div>
            <h2 className="card-title">{business.name}</h2>
            <p className="muted" style={{ margin: "4px 0 0", fontSize: 12 }}>Business profile</p>
          </div>
        </div>
        <BusinessForm mode="edit" business={{
          id: business.id,
          name: business.name,
          business_type: business.business_type ?? "",
          contact_email: business.contact_email ?? "",
          phone: business.phone ?? "",
          address: business.address ?? "",
          gstin: business.gstin ?? ""
        }} />
        <p className="muted" style={{ fontSize: 11, lineHeight: 1.6, marginTop: 18 }}>
          GSTIN is stored as business information only. Government verification and GST portal connections are not included in Phase 1.
        </p>
      </div>
    </div>
  );
}
