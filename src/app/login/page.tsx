import type { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/components/sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="auth-layout">
      <section className="auth-brand-panel">
        <div className="brand">
          <span className="brand-mark">K</span>
          <span>Kernel Finance</span>
        </div>
        <div>
          <h1>Your business.<br />Clearly in control.</h1>
          <p>A simple workspace for managing your business operations. Sign in to continue to your workspace.</p>
        </div>
        <p>Horizon Works · Business Billing &amp; Management SaaS</p>
      </section>
      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to access your business workspace.</p>
          <SignInForm />
          <p className="auth-footnote">New to Kernel Finance? <Link href="/register">Create an account</Link></p>
        </div>
      </section>
    </main>
  );
}
