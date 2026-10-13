# Business Billing & Management SaaS

Phase 1 foundation by Horizon Works.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth and PostgreSQL
- Supabase Row Level Security (RLS)

## Phase 1 scope

- Register, sign in, and sign out.
- Protected application routes.
- Create, edit, list, and select business profiles.
- Maximum of three business profiles created per account.
- Basic dashboard shell with future modules marked as coming soon.
- Business-level data isolation enforced by PostgreSQL RLS and server-side checks.
- Responsive navigation and mobile-friendly forms.

Invoices, GST calculations, PDFs, inventory, purchases, expenses, financial reports, payment gateway, subscription billing, and government APIs are not implemented in Phase 1.

## Local setup

1. Install Node.js 20.9 or later (use a current supported LTS release).
2. Install dependencies with npm install.
3. Create a Supabase project.
4. Copy .env.example to .env.local and set the public Supabase project URL and anon/publishable key.
5. Run the SQL migration in supabase/migrations/202610130001_foundation.sql using the Supabase SQL editor or your migration workflow.
6. Configure the Supabase Auth site URL and redirect URL to include the local app URL, normally http://localhost:3000/auth/callback.
7. Start the app with npm run dev.

For production, set the same environment variables in your hosting provider. Never commit real credentials or expose the service-role key in the browser.

## Useful commands

- npm run dev — local development
- npm run build — production build
- npm run start — run production build
- npm run lint — ESLint
- npm run typecheck — TypeScript check

## Security notes

- The database migration enables RLS for profiles, businesses, and business_members.
- The owner membership is created in the database when a business is created.
- A database trigger enforces the three-business limit under concurrent requests.
- The business creator is immutable after creation.
- The Supabase service-role key is not used by this application.
- Test tenant isolation with at least two separate accounts before production handover.

## Phase 1 UX

Use the supplied Kernel Finance UI/UX reference document as the visual guide: dark navy sidebar, light workspace, restrained blue accents, clear forms, responsive behavior, and realistic empty states. Dashboard financial totals and transaction rows are intentionally omitted until those modules exist.
