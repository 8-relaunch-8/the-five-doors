# The Five Doors

Full-stack museum web application with Next.js, Prisma, and Supabase.

## Getting Started

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- Supabase (PostgreSQL)
- Tailwind CSS
- JWT Authentication

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npx prisma studio    # Database GUI
npx prisma migrate   # Run migrations
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

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

Generate JWT secrets: `openssl rand -hex 64`

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin pages
│   └── ...               # Public pages
├── components/           # React components
├── contexts/             # React contexts
├── lib/
│   ├── services/         # Business logic
│   ├── validators/       # Zod schemas
│   └── middleware/       # Auth helpers
└── types/                # TypeScript types

prisma/
└── schema.prisma         # Database schema
```

## License

MIT
