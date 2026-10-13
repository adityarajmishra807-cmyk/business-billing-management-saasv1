"use client";

import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/actions";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button type="submit" aria-label="Sign out" title="Sign out" className="btn btn-secondary" style={{ minHeight: 34, padding: "7px 9px" }}>
        <LogOut size={15} />
      </button>
    </form>
  );
}
