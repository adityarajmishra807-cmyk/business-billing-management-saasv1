# Phase 1 Implementation Notes

This file documents the implementation approach. The full PRD and UI/UX guide should remain separate reference documents unless the project owner asks to add them to the repository.

## Implemented in this branch

- Next.js App Router application scaffold with TypeScript and Tailwind CSS.
- Supabase server client and session-refresh middleware.
- Sign-in, registration, sign-out, and email confirmation callback.
- Protected app route group.
- Business workspace list, create profile, business dashboard shell, and edit settings.
- Three-business limit checked in the action and enforced again by a PostgreSQL trigger.
- Supabase migration for profiles, businesses, memberships, and RLS policies.
- Responsive design tokens and components based on the UI/UX reference.

## Must be configured by the project owner

- Create the Supabase project and apply the migration.
- Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and NEXT_PUBLIC_SITE_URL.
- Configure Supabase Auth site and redirect URLs.
- Install dependencies and run typecheck, lint, and build.
- Test tenant isolation with two real test accounts before production deployment.

## Known Phase 1 limits

- GSTIN is stored as text only; no government verification is made.
- No invoices, inventory, purchases, expenses, reports, payment gateway, subscription billing, or government integrations are implemented.
- Search and help items are visual placeholders.
- Logo upload, email/password recovery, team invitations, and full administrator workflows are not implemented.
