import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/sign-up-form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <main className="auth-layout">
      <section className="auth-brand-panel">
        <div className="brand">
          <span className="brand-mark">K</span>
          <span>Kernel Finance</span>
        </div>
        <div>
          <h1>Build a clearer view of your business.</h1>
          <p>Create your account, set up a business profile, and prepare your workspace for the tools that come next.</p>
        </div>
        <p>Horizon Works · Business Billing &amp; Management SaaS</p>
      </section>
      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Start by creating your login. You can add your business profile next.</p>
          <SignUpForm />
          <p className="auth-footnote">Already have an account? <Link href="/login">Sign in</Link></p>
        </div>
      </section>
    </main>
  );
}
