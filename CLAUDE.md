# The Five Doors — fiche projet

Application web full stack de gestion de la collection d'un musée : comptes, rôles, espace d'administration des œuvres.
Projet personnel de Yanis, présenté sur son CV pour sa recherche d'alternance.

## Boussole

Le projet réussit s'il permet à Yanis de :

- présenter un projet full stack propre, simple et authentique de développeur junior ;
- expliquer chaque choix technique, ses limites et la suite possible, à l'oral, en entretien technique.

Améliorer le produit n'est **pas** l'objectif du moment.

## Garde-fous

- **Gel du code jusqu'à fin novembre 2026** : seulement de la documentation et du nettoyage sans risque. Toute exception se décide explicitement.
- **Dépôt public** : aucun secret, aucune donnée personnelle, aucune note privée (prompts, notes de cours).
- Rien ne se fusionne sur `main` sans pull request relue par Yanis et CI verte (branche protégée).
- Chaque affirmation d'un document doit correspondre au code. En cas de doute, on vérifie dans le code.

## Conventions

- **Langue** : code, README, `docs/`, issues et PR en anglais ; `CLAUDE.md` et `ETAT.md` en français.
- **Commits** : Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `build:`, `ci:`).
- **Branches** : `type/sujet` (ex. `docs/project-hygiene`).
- **Issues** : une unité de travail par issue, avec contexte, critère de fini et étiquette (`bug`, `enhancement`, `tech-debt`, `documentation`). Une PR ferme son issue avec `Closes #n`.

## Où vit chaque information

- **Ce dépôt** : la seule source de vérité (code, docs, état du projet).
- **`ETAT.md`** : où en est le projet aujourd'hui, réécrit à chaque fin de session.
- **Issues GitHub** : le travail à faire et la dette technique connue.
- **Notion « The Five Doors »** : archive du backlog et des notes d'apprentissage, de janvier à mars 2026. Plus mis à jour.
- **Ancien dépôt `8-relaunch-8/TheFiveDoors`** : archive. Son historique de commits a été repris ici ; ses anciennes issues et PR y restent.

## Pile technique

Next.js 16 (App Router), React 18, TypeScript, Prisma 5, PostgreSQL, Zod 4, JWT (`jsonwebtoken` + `jose`), bcrypt, Tailwind CSS, Vitest + Testing Library, GitHub Actions, Dependabot, CodeQL.

## Commandes

```bash
npm run dev          # serveur de développement
npm run lint         # ESLint
npm run type-check   # TypeScript sans compilation
npm run test         # Vitest
npm run build        # build de production
```
