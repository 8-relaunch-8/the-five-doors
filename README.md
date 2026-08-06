# The Five Doors

Full-stack museum management web application built with Next.js, TypeScript, and Prisma.

## Overview

This project provides a production-oriented foundation for a museum platform:
- secure JWT authentication
- role-based access control (`VISITOR`, `STAFF`, `ADMIN`)
- artwork management (CRUD) through API + admin UI
- validated backend inputs (Zod)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- Tailwind CSS
- Vitest + Testing Library

## Quick Start

Prerequisites:

- Node.js 20 LTS
- npm

Install and run:

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run dev
```

Application available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env` and set:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="..."
JWT_REFRESH_SECRET="..."
```

Generate JWT secrets:

```bash
openssl rand -hex 64
```

## Main Scripts

```bash
npm run dev            # development server
npm run build          # production build
npm run lint           # ESLint checks
npm run type-check     # TypeScript checks
npm run test           # unit tests
```

## Status

Personal project in progress. Stable technical foundation and runnable locally.

## License

MIT
