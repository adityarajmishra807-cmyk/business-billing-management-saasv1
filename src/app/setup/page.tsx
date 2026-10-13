import Link from "next/link";
import { AlertTriangle, ExternalLink, Settings2 } from "lucide-react";

export const metadata = { title: "Deployment setup required" };

export default function SetupPage() {
  return (
    <main style={{
      minHeight: "100vh", display: "grid", placeItems: "center",
      padding: 24, background: "#F5F7FB"
    }}>
      <section className="card" style={{ width: "100%", maxWidth: 620, padding: 28 }}>
        <div className="business-symbol" style={{ marginBottom: 18 }}>
          <AlertTriangle size={22} />
        </div>
        <h1 className="page-title" style={{ fontSize: 25 }}>Finish connecting Supabase</h1>
        <p className="page-description" style={{ marginTop: 10 }}>
          The application has deployed, but its database and authentication connection is not configured yet.
          Add the public Supabase project settings in Vercel, then redeploy.
        </p>
        <div style={{ marginTop: 24 }}>
          <h2 className="card-title">Environment variables required</h2>
          <div style={{ display: "grid", gap: 12, marginTop: 13 }}>
            <div style={{ border: "1px solid #E1E7EF", borderRadius: 8, padding: 12, background: "#F8FAFC" }}>
              <code style={{ color: "#14243A", fontWeight: 700 }}>NEXT_PUBLIC_SUPABASE_URL</code>
              <p className="muted" style={{ margin: "5px 0 0", lineHeight: 1.5 }}>
                Your Supabase project URL from Project Settings → API.
              </p>
            </div>
            <div style={{ border: "1px solid #E1E7EF", borderRadius: 8, padding: 12, background: "#F8FAFC" }}>
              <code style={{ color: "#14243A", fontWeight: 700 }}>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>
              <p className="muted" style={{ margin: "5px 0 0", lineHeight: 1.5 }}>
                Your project's publishable key. The legacy anon key is also supported.
              </p>
            </div>
            <div style={{ border: "1px solid #E1E7EF", borderRadius: 8, padding: 12, background: "#F8FAFC" }}>
              <code style={{ color: "#14243A", fontWeight: 700 }}>NEXT_PUBLIC_SITE_URL</code>
              <p className="muted" style={{ margin: "5px 0 0", lineHeight: 1.5 }}>
                The deployed website URL, including https://. Use the same URL in Supabase Auth redirect settings.
              </p>
            </div>
          </div>
        </div>
        <div className="notice" style={{ marginTop: 20 }}>
          <Settings2 size={17} />
          <span>In Vercel, open Project → Settings → Environment Variables. Add these values for Production, then redeploy the latest commit. Never add a service-role key to these public variables.</span>
        </div>
        <div className="form-actions" style={{ marginTop: 20 }}>
          <Link className="btn btn-primary" href="https://vercel.com/dashboard" target="_blank" rel="noreferrer">
            Open Vercel <ExternalLink size={15} />
          </Link>
          <Link className="btn btn-secondary" href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">
            Open Supabase <ExternalLink size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
