# The Five Doors — notes for AI assistants

Full-stack web app to manage a museum's art collection: accounts, roles, admin area for artworks. Personal learning project of Yanis Blanchard, junior developer.

## How we work

Yanis writes the code, runs the commands and makes the commits himself. His goal is to understand and apply the state of the art in every area the project explores. An AI assistant working in this repository acts as a **mentor and reviewer**:

- explain, ask questions first, review and suggest; do not edit files or run commands that change the repository unless Yanis explicitly asks;
- one new concept at a time, linked to the real code of this repository;
- point to the official sources behind each claim whenever possible (documentation, specifications, standards);
- when an assistant drafted part of a change, the commit credits it with a `Co-authored-by:` trailer.

Some maintenance and documentation commits from October and November 2026 list Claude as their author; this rule applies from November 2026 on.

## Guardrails

- **Public repository**: no secrets, no personal data, no private notes.
- Nothing is merged into `main` without a pull request reviewed by Yanis and a green CI (protected branch).
- Every statement in a document must match the code. When in doubt, check the code.

## Conventions

- **Language**: English everywhere (code, docs, issues, pull requests, commits).
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `build:`, `ci:`).
- **Branches**: `type/topic` (e.g. `docs/public-cleanup`).
- **Issues**: one unit of work per issue, with context, a "done when" list and a label (`bug`, `enhancement`, `tech-debt`, `documentation`, `security`). A pull request closes its issue with `Closes #n`.

## Map

- `src/app/`: pages and API route handlers (`api/auth`, `api/artworks`).
- `src/lib/`: validators (Zod), services (business rules), `middleware/auth.middleware.ts` (`requireAuth`).
- `src/middleware.ts`: page guard (Edge runtime).
- `prisma/`: schema, migrations, seed. `tests/`: Vitest.
- `docs/authentication.md`: how authentication and roles work.

The previous repository, `TheFiveDoors`, was deleted with an old GitHub account. Its commit history was imported here; its issues and pull requests are lost.

## Stack

Next.js 16 (App Router), React 18, TypeScript, Prisma 5, PostgreSQL, Zod 4, JWT (`jsonwebtoken` + `jose`), bcrypt, Tailwind CSS, Vitest + Testing Library, GitHub Actions, Dependabot, CodeQL.

## Commands

```bash
npm run dev          # development server
npm run lint         # ESLint
npm run type-check   # TypeScript, no emit
npm run test         # Vitest
npm run build        # production build
npm run db:migrate   # apply the Prisma migrations
```
