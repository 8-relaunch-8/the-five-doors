# État du projet

Mis à jour le 5 novembre 2026.

## Objectif du moment

Stabiliser et documenter le projet pour pouvoir présenter et expliquer chacun de ses choix techniques. Code gelé jusqu'à fin novembre 2026.

## Où on en est

- **Phase** : documentation et consolidation. Code gelé.
- **Produit** : authentification JWT, rôles (`VISITOR`, `STAFF`, `ADMIN`), CRUD des œuvres en API et en interface admin, 77 tests, CI obligatoire.
- **Dépôt** : dépendances à jour, README, doc d'authentification, limites connues suivies en issues (#9 à #17).

## Chemin critique

Une présentation orale du projet en 2 minutes : quoi, pourquoi, comment, limites, suite.

## Reprendre ici

Écrire la présentation de 2 minutes.
Impact : fort. Charge : moyenne.

## Prochaines actions

1. Yanis + Claude : écrire et répéter la présentation de 2 minutes. Charge moyenne.
2. Yanis + Claude : réviser les choix techniques (auth, rôles, tests, architecture) et leurs limites. Charge lourde.
3. Yanis : ajouter des captures d'écran au README (`docs/screenshots/`). Charge légère.

## Questions ouvertes

- **Rafraîchissement du jeton non branché** (la session dure 15 minutes) : le corriger pendant le gel, ou seulement le documenter ?
  Option recommandée : décider après la présentation orale. Il est déjà documenté (#9).

## Parking

- Le middleware ne vérifie pas `issuer` et `audience` du jeton, contrairement à `requireAuth()`.
- `ADMIN` et `STAFF` ont aujourd'hui les mêmes droits.
- Paquets Supabase encore déclarés dans `package.json`.
