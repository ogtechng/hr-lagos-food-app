# HR Portal — My Lagos Food App

HR Portal is a Next.js application for public job discovery, no-registration applications, CV uploads, admin review, and application reporting for My Lagos Food App hiring operations.

## Project Overview

The MVP includes:

- Public careers landing page
- Public jobs listing and published job detail pages
- No-registration application submission flow
- CV upload to Supabase Storage
- Supabase Auth admin login
- Protected admin dashboard
- Entity and job management
- Application review, admin notes, accept/reject decisions
- Email notification attempts with email logs
- Reports page with filters and CSV export

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui-style primitives with Base UI
- Drizzle ORM
- PostgreSQL / Supabase database
- Supabase Auth and Supabase Storage
- Zod validation
- Resend email API

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Fill in all required values in `.env.local`, then run migrations and start the dev server.

## Environment Variables

```txt
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_CV_BUCKET=
RESEND_API_KEY=
ADMIN_NOTIFICATION_EMAIL=
ADMIN_EMAILS=
MAX_CV_UPLOAD_SIZE_MB=5
```

Notes:

- `DATABASE_URL` should point to the PostgreSQL database used by Drizzle.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe for browser use.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. Never expose it to the client.
- `SUPABASE_CV_BUCKET` is the bucket used for applicant CV uploads.
- `MAX_CV_UPLOAD_SIZE_MB` falls back to `5` if unset.
- `RESEND_API_KEY` enables email sending. Without it, email attempts are logged as failed without blocking saved applications.
- `ADMIN_NOTIFICATION_EMAIL` receives new-application notifications.
- `ADMIN_EMAILS` is a comma-separated fallback allowlist for admin access.

## Database Setup

The database schema lives under:

```txt
app/api/_db/schema/
```

Drizzle configuration:

```txt
app/api/drizzle.config.ts
```

Existing migrations are stored in:

```txt
app/api/_db/migrations/
```

## Drizzle Migration Commands

Generate a migration after schema changes:

```bash
npm run db:generate
```

Apply migrations:

```bash
npm run db:migrate
```

For development-only schema sync:

```bash
npm run db:push
```

Do not use `db:push` as the production migration strategy.

## Seed Instructions

No seed script is currently included.

For manual MVP setup, create at least:

- One active entity
- One published job attached to that entity
- One Supabase Auth user whose email is listed in `ADMIN_EMAILS`

Recommended future improvement: add a typed seed script for default entities and sample jobs.

## Supabase Setup

1. Create a Supabase project.
2. Copy the project URL into `NEXT_PUBLIC_SUPABASE_URL`.
3. Copy the anon key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copy the service role key into `SUPABASE_SERVICE_ROLE_KEY`.
5. Use the database connection string for `DATABASE_URL`.
6. Run Drizzle migrations.

## CV Bucket Setup

Create a Supabase Storage bucket named by `SUPABASE_CV_BUCKET`, for example:

```txt
cvs
```

Recommended production setup:

- Use a private bucket.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.
- Generate signed CV URLs only after admin authorization.

Current implementation note:

- CV uploads use the server-side service role client.
- New CV uploads store `cv_storage_path`.
- Admin CV viewing goes through a protected signed URL endpoint.
- Legacy application rows without `cv_storage_path` need a backfill before CV viewing works from a private bucket.

## Admin User Setup

1. Create an admin user in Supabase Auth.
2. Add the admin email to `ADMIN_EMAILS`.
3. Multiple admins can be comma-separated:

```txt
ADMIN_EMAILS=admin@example.com,ops@example.com
```

Preferred future approach:

- Store admin authorization in Supabase `app_metadata.role = "admin"`.
- Keep `ADMIN_EMAILS` only as a fallback or bootstrap allowlist.

## Email Setup

Set:

```txt
RESEND_API_KEY=
ADMIN_NOTIFICATION_EMAIL=
```

The system sends or attempts:

- Applicant application received email
- Admin new application email
- Applicant accepted email
- Applicant rejected email

If Resend is not configured, application/status updates still save successfully and email logs record failed attempts.

## Running Development Server

```bash
npm run dev
```

Default local URL:

```txt
http://localhost:3000
```

## Running Production Build

```bash
npm run typecheck
npm run lint
npm run build
npm run start
```

## Vercel Deployment Notes

1. Create a Vercel project from the repository.
2. Add all required environment variables in Vercel Project Settings.
3. Ensure `DATABASE_URL` points to the production database.
4. Run migrations against production before exposing the app.
5. Verify Supabase Auth redirect/domain settings include the production domain.
6. Verify Supabase Storage bucket exists.
7. Verify Resend sender/domain setup.

## Deployment Checklist

- [ ] Production environment variables configured
- [ ] Drizzle migrations applied
- [ ] Supabase Auth user created for admin
- [ ] `ADMIN_EMAILS` includes at least one real admin
- [ ] `SUPABASE_CV_BUCKET` created
- [ ] CV bucket privacy policy reviewed
- [ ] Resend API key configured
- [ ] Admin notification email configured
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Public jobs page tested with real published job
- [ ] Application submission tested with PDF, DOC, and DOCX
- [ ] Admin login tested
- [ ] Reports CSV export tested as admin

## Security Notes

- Admin routes are protected by `proxy.ts` and server-side `requireAdmin()` calls.
- Every admin `/api/v1` route handler also calls `requireAdmin()`, so client-side mutation hooks never carry the trust boundary.
- Public job pages only fetch published jobs.
- CV uploads validate extension, MIME type, file size, and file signature.
- The service role key is only used in server-side Supabase utilities/services.
- Report export requires admin authorization.
- Public JSON application creation is disabled; applicants must use the validated public form.
- New admin CV access uses signed URLs generated after admin authorization.

## Known TODOs

- Backfill `cv_storage_path` for any legacy application rows before making an existing public bucket private.
- Add rate limiting or abuse prevention to the public application submission flow.
- Add a production seed script for default entities/admin test data.
- Replace `ADMIN_EMAILS` fallback with Supabase `app_metadata.role = "admin"` for long-term authorization management.
# hr-lagos-food-app
