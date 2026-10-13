"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Building2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FileText,
  LayoutDashboard,
  Menu,
  Package,
  ReceiptText,
  Settings2,
  ShieldCheck,
  Users,
  Wallet
} from "lucide-react";
import { SignOutButton } from "@/components/sign-out-button";

type BusinessOption = {
  id: string;
  name: string;
  created_by: string;
};

type AppShellProps = {
  children: ReactNode;
  userName: string;
  userEmail: string;
  initials: string;
  userId: string;
  businesses: BusinessOption[];
};

const comingSoon = [
  { label: "Invoices", icon: FileText },
  { label: "Quotations", icon: ReceiptText },
  { label: "Customers", icon: Users },
  { label: "Products", icon: Package },
  { label: "Purchases", icon: Wallet },
  { label: "Stock", icon: Package },
  { label: "Expenses", icon: ReceiptText },
  { label: "Reports", icon: BarChart3 }
];

export function AppShell({ children, userName, userEmail, initials, userId, businesses }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const businessMatch = pathname.match(/\/app\/businesses\/([^/]+)/);
  const selectedBusinessId = businessMatch && businessMatch[1] !== "new" ? businessMatch[1] : "";
  const currentBusiness = businesses.find((business) => business.id === selectedBusinessId);

  const navigateTo = (value: string) => {
    router.push(value ? "/app/businesses/" + value : "/app");
    setMobileOpen(false);
  };

  return (
    <div className="app-frame">
      {mobileOpen ? (
        <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} style={{
          position: "fixed", inset: 0, zIndex: 25, background: "rgba(9, 19, 33, 0.42)", border: 0
        }} />
      ) : null}
      <aside className={"sidebar" + (mobileOpen ? " sidebar-open" : "")}>
        <Link href="/app" className="brand" onClick={() => setMobileOpen(false)}>
          <span className="brand-mark">K</span>
          <span>Kernel Finance</span>
        </Link>

        <nav className="nav-groups" aria-label="Main navigation">
          <div>
            <div className="nav-group-title">Workspace</div>
            <Link href="/app" onClick={() => setMobileOpen(false)} className={"nav-link" + (pathname === "/app" ? " active" : "")}>
              <LayoutDashboard size={17} /> Dashboard
            </Link>
            <Link
              href={selectedBusinessId ? "/app/businesses/" + selectedBusinessId + "/settings" : "/app"}
              onClick={() => setMobileOpen(false)}
              className={"nav-link" + (pathname.endsWith("/settings") ? " active" : "")}
            >
              <Building2 size={17} /> Business profile
            </Link>
          </div>

          <div>
            <div className="nav-group-title">Business tools</div>
            {comingSoon.map((item) => {
              const Icon = item.icon;
              return (
                <div className="nav-link disabled" key={item.label} aria-disabled="true" title={item.label + " will be available in a later phase"}>
                  <Icon size={16} />
                  <span>{item.label}</span>
                  <span className="soon-label">Soon</span>
                </div>
              );
            })}
          </div>

          <div>
            <div className="nav-group-title">Account</div>
            <div className="nav-link disabled" aria-disabled="true"><CircleHelp size={16} /> Help &amp; support <span className="soon-label">Soon</span></div>
          </div>
        </nav>

        <div className="sidebar-business">
          <div className="sidebar-business-label">CURRENT BUSINESS</div>
          {businesses.length ? (
            <select
              aria-label="Switch business"
              className="field-input"
              value={selectedBusinessId}
              onChange={(event) => navigateTo(event.target.value)}
              style={{ minHeight: 36, background: "#1b2c43", color: "#fff", borderColor: "rgba(220,230,245,.18)", padding: "7px 9px", fontSize: 12 }}
            >
              <option value="">All workspaces</option>
              {businesses.map((business) => <option value={business.id} key={business.id}>{business.name}</option>)}
            </select>
          ) : (
            <div className="sidebar-business-name">No business added yet</div>
          )}
          {currentBusiness ? <div className="sidebar-business-name" style={{ marginTop: 8 }}>{currentBusiness.name}</div> : null}
          <Link href="/app/businesses/new" style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 9, fontSize: 11, color: "#a9c8ff" }}>
            Manage businesses <ChevronRight size={13} />
          </Link>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu-button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label="Toggle navigation">
              <Menu size={16} /> Menu
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, color: "#293b54", fontSize: 12, fontWeight: 650 }}>
              <Building2 size={16} color="#2F6FED" />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 280 }}>
                {currentBusiness?.name || "Business workspaces"}
              </span>
              <ChevronDown size={14} />
            </div>
          </div>

          <div className="topbar-right">
            <div className="topbar-search" aria-label="Search not yet available">Search will be available in a later phase</div>
            <div className="topbar-user">
              <div className="avatar" aria-hidden="true">{initials}</div>
              <div className="topbar-user-details">
                <div style={{ color: "#1d2a3d", fontSize: 12, fontWeight: 700 }}>{userName}</div>
                <div style={{ color: "#718096", fontSize: 11, marginTop: 2 }}>{userEmail || "Signed-in account"}</div>
              </div>
              <ChevronDown size={14} color="#6c7a90" />
            </div>
            <SignOutButton />
          </div>
        </header>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
