"use client";

import { useActionState } from "react";
import Link from "next/link";
import { LoaderCircle, Save } from "lucide-react";
import { createBusinessAction, updateBusinessAction, type ActionState } from "@/app/actions";

type BusinessData = {
  id: string;
  name: string;
  business_type: string;
  contact_email: string;
  phone: string;
  address: string;
  gstin: string;
};

type BusinessFormProps = {
  mode: "create" | "edit";
  business?: BusinessData;
};

const initialState: ActionState = {};

export function BusinessForm({ mode, business }: BusinessFormProps) {
  const action = mode === "create" ? createBusinessAction : updateBusinessAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="auth-form" style={{ gap: 16 }}>
      {mode === "edit" && business ? <input type="hidden" name="business_id" value={business.id} /> : null}
      {state.error ? <div role="alert" className="form-message error">{state.error}</div> : null}
      {state.success ? <div role="status" className="form-message success">{state.success}</div> : null}

      <div className="form-grid">
        <label className="field">
          <span className="field-label">Business name <span style={{ color: "#DC2626" }}>*</span></span>
          <input className="field-input" name="name" defaultValue={business?.name ?? ""} maxLength={120} placeholder="e.g. Acme Traders" required />
        </label>
        <label className="field">
          <span className="field-label">Business type</span>
          <input className="field-input" name="business_type" defaultValue={business?.business_type ?? ""} maxLength={80} placeholder="e.g. Retail, Services" />
        </label>
        <label className="field">
          <span className="field-label">Contact email</span>
          <input className="field-input" name="contact_email" defaultValue={business?.contact_email ?? ""} type="email" maxLength={254} placeholder="business@example.com" />
        </label>
        <label className="field">
          <span className="field-label">Phone number</span>
          <input className="field-input" name="phone" defaultValue={business?.phone ?? ""} type="tel" maxLength={30} placeholder="Business contact number" />
        </label>
        <label className="field">
          <span className="field-label">GSTIN <span className="muted">(optional)</span></span>
          <input className="field-input" name="gstin" defaultValue={business?.gstin ?? ""} maxLength={20} autoCapitalize="characters" placeholder="Enter GSTIN if applicable" />
        </label>
        <label className="field">
          <span className="field-label">Address</span>
          <input className="field-input" name="address" defaultValue={business?.address ?? ""} maxLength={500} placeholder="Business address" />
        </label>
      </div>

      {mode === "create" ? (
        <div className="notice">
          <span>ⓘ</span>
          <span>GSTIN is saved as profile information only. Verification and government portal connections are not included in Phase 1.</span>
        </div>
      ) : null}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
          {pending ? "Saving..." : mode === "create" ? "Create business" : "Save changes"}
        </button>
        <Link className="btn btn-secondary" href={mode === "edit" && business ? "/app/businesses/" + business.id : "/app"}>Cancel</Link>
      </div>
    </form>
  );
}
