"use client";

import { useActionState } from "react";
import { LoaderCircle, UserPlus } from "lucide-react";
import { signUpAction, type ActionState } from "@/app/actions";

const initialState: ActionState = {};

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="auth-form">
      {state.error ? <div role="alert" className="form-message error">{state.error}</div> : null}
      {state.success ? <div role="status" className="form-message success">{state.success}</div> : null}
      <label className="field">
        <span className="field-label">Full name <span className="muted">(optional)</span></span>
        <input className="field-input" type="text" name="fullName" autoComplete="name" placeholder="Your name" />
      </label>
      <label className="field">
        <span className="field-label">Email address</span>
        <input className="field-input" type="email" name="email" autoComplete="email" placeholder="you@company.com" required />
      </label>
      <label className="field">
        <span className="field-label">Password</span>
        <input className="field-input" type="password" name="password" autoComplete="new-password" minLength={8} placeholder="At least 8 characters" required />
      </label>
      <button type="submit" className="btn btn-primary" disabled={pending} style={{ width: "100%", marginTop: 3 }}>
        {pending ? <LoaderCircle size={16} className="animate-spin" /> : <UserPlus size={16} />}
        {pending ? "Creating account..." : "Create account"}
      </button>
      <p className="muted" style={{ margin: "0", fontSize: 11, lineHeight: 1.5 }}>
        Account creation uses the authentication rules configured in the connected Supabase project.
      </p>
    </form>
  );
}
