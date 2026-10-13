"use client";

import { useActionState } from "react";
import { LoaderCircle, LogIn } from "lucide-react";
import { signInAction, type ActionState } from "@/app/actions";

const initialState: ActionState = {};

export function SignInForm() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <form action={formAction} className="auth-form">
      {state.error ? <div role="alert" className="form-message error">{state.error}</div> : null}
      {state.success ? <div role="status" className="form-message success">{state.success}</div> : null}
      <label className="field">
        <span className="field-label">Email address</span>
        <input className="field-input" type="email" name="email" autoComplete="email" placeholder="you@company.com" required />
      </label>
      <label className="field">
        <span className="field-label">Password</span>
        <input className="field-input" type="password" name="password" autoComplete="current-password" placeholder="Enter your password" required />
      </label>
      <button type="submit" className="btn btn-primary" disabled={pending} style={{ width: "100%", marginTop: 3 }}>
        {pending ? <LoaderCircle size={16} className="animate-spin" /> : <LogIn size={16} />}
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
