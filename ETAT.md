# État du projet

Mis à jour le 5 novembre 2026.

## Objectif du moment

Rendre le projet présentable et savoir le présenter à l'oral, d'ici fin novembre 2026.
Rencontres avec les entreprises : 12 novembre, 16 novembre, puis d'autres en novembre. Les entretiens techniques viendront après.

## Où on en est

- **Phase** : préparation à l'entretien. Code gelé.
- **Produit** : authentification JWT, rôles (`VISITOR`, `STAFF`, `ADMIN`), CRUD des œuvres en API et en interface admin, 77 tests, CI obligatoire.
- **Dépôt** : nettoyé fin octobre (dépendances à jour, README pour les recruteurs). Fiche projet, état et doc d'authentification ajoutés le 5 novembre.

## Chemin critique

Un pitch du projet de 2 minutes, prêt pour le 12 novembre.

## Reprendre ici

Écrire le pitch de 2 minutes : quoi, pourquoi, comment, limites, suite.
Impact : fort. Charge : moyenne.

## Prochaines actions

1. Yanis + Claude : écrire et répéter le pitch de 2 minutes. Charge moyenne.
2. Yanis + Claude : préparer les questions techniques probables (auth, rôles, tests, architecture). Charge lourde.
3. Claude : inventorier l'ancien dépôt `TheFiveDoors` (issues, PR, branche `feature/admin-artist-crud`) dès que l'accès fonctionne. Charge légère.
4. Yanis : archiver l'ancien dossier iCloud `TheFiveDoors`, une fois l'inventaire fait. Charge légère.

## Questions ouvertes

- **Rafraîchissement du jeton non branché** (la session dure 15 minutes) : corriger avant les entretiens, ou seulement le documenter ?
  Option recommandée : décider après le pitch, selon le temps restant. Le documenter suffit déjà à éviter le piège.
- **Montrer Notion en entretien ?**
  Option recommandée : seulement si on le demande, avec une page publique nettoyée.

## Parking

- Le middleware ne vérifie pas `issuer` et `audience` du jeton, contrairement à `requireAuth()`.
- `ADMIN` et `STAFF` ont aujourd'hui les mêmes droits.
- Paquets Supabase encore déclarés dans `package.json`.
