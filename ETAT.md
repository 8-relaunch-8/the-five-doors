# État du projet

Mis à jour le 6 novembre 2026, au soir.

## Objectif du moment

Un projet lisible et vrai : un README juste ligne à ligne, chaque limite connue et expliquée, chaque choix technique compris et expliqué à voix haute. Code gelé jusqu'à fin novembre 2026.

## Où on en est

- **Phase** : documentation et consolidation. Code gelé.
- **Produit** : authentification JWT, rôles (`VISITOR`, `STAFF`, `ADMIN`), CRUD des œuvres en API et en interface admin, 77 tests, CI obligatoire.
- **Relecture de code du 6/11** (relecture indépendante, revérifiée dans le code) :
  - `src/app/api/auth/delete/route.ts` ne vérifie aucun jeton et supprime un identifiant écrit en dur (« Temporary », commit `56e1e0c`, 13 janvier) ; son test valide ce comportement. Aucune interface ne l'appelle (bouton « Coming soon » désactivé). C'est la seule route sensible sans contrôle.
  - Le README actuel dit deux choses fausses : « view and delete your profile » et « every protected API route checks the token and the role again ».
  - Next.js 16 déprécie `middleware.ts` au profit de `proxy.ts` (Node.js) : la justification « deux bibliothèques JWT à cause du runtime Edge » est à revoir.
  - `password` est optionnel dans le schéma Prisma : trace du passage de Supabase à l'authentification maison (migrations du 12 et du 16 janvier).
- **README court** : brouillon prêt (environ 400 mots), pas encore vérifié ligne à ligne ni poussé.

## Chemin critique

Savoir expliquer à voix haute, sans notes, le parcours complet d'un login, puis la route de suppression.

## Reprendre ici

Relire le projet avec Claude Agent dans Zed (lecture seule) pour se le réapproprier, en suivant le parcours d'un login fichier par fichier : formulaire, `AuthContext`, route `login`, services, cookies, middleware.
Impact : fort. Charge : moyenne.

## Prochaines actions

1. Yanis + Claude Agent (Zed) : relecture du parcours du login. Compte rendu de séance à la fin. Charge moyenne.
2. Yanis + Claude : répondre à voix haute sur la route de suppression, puis écrire la décision. Charge moyenne.
3. Yanis + Claude : README court, vérifié ligne à ligne contre le code, puis PR. Charge moyenne.
4. Yanis + Claude : audit de ce qui est difficile à expliquer (`package.json` et Supabase, dépendances mal rangées, auteurs des commits et trailers `Claude-Session:`), puis tri. Charge moyenne.
5. Yanis + Claude : les questions techniques les plus probables, à voix haute, la première étant le login en 2 minutes. Charge lourde.

## Questions ouvertes

- **Route de suppression** : la corriger pendant le gel (cinq lignes et trois tests), ou seulement l'ouvrir en issue et la documenter ?
  Option recommandée : décider demain ; dans les deux cas, une issue publique et une ligne dans les limites du README.
- **Rafraîchissement du jeton non branché** (#9) : le documenter suffit pendant le gel.

## Parking

- Migrer `middleware.ts` vers `proxy.ts` (après le gel).
- `ADMIN` et `STAFF` ont aujourd'hui les mêmes droits (#13).
- Paquets Supabase encore déclarés dans `package.json` (#17).
