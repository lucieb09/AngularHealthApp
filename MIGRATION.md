# Migration AngularJS vers Angular 22

Date : 23 novembre 2026  
Dépôt source : `lucieb09/AngularHealthApp`  
Branche de travail locale : `codex/angularjs-to-angular22`

## Résumé

L’application d’origine est un petit calculateur de santé de démonstration, écrit en AngularJS 1.2.9. Elle chargeait les scripts à la main depuis `index.html`, utilisait Jasmine 2.0.2 dans un fichier `test.html` et ne définissait ni `package.json` ni chaîne de build moderne.

J’ai retenu une réécriture directe en Angular 22.3.0. Le projet ne contient que 22 fichiers d’application JavaScript, des fonctions de calcul locales et aucun backend. Un mode hybride avec `ngUpgrade` aurait ajouté deux frameworks et des dépendances de transition sans apporter de bénéfice suffisant pour cette taille d’application. L’application finale n’utilise donc plus AngularJS.

## Fonctionnement conservé

- Valeurs initiales : homme, 60 pouces, 130 livres et 40 ans.
- Boutons de bascule du sexe utilisé par le calcul BMR et des unités U.S./métriques.
- Hauteur choisie dans une plage de 24 à 84 pouces ou de 60 à 215 centimètres.
- Poids limité à 20–400 livres ou 9–182 kilogrammes; âge limité à 13–120 ans.
- Données canoniques conservées en pouces et livres lorsque l’affichage passe en métrique.
- Résultats recalculés : BMR, BMI/IMC avec catégories, et fréquence cardiaque cible entre 50 % et 85 % de `220 - âge`.
- Facteurs et arrondis de calcul repris du code source, y compris le facteur livres/kilogrammes 2,205 et les formules BMR existantes.

Le rendu métrique de la taille arrondit au centimètre entier comme l’ancienne interface : son appel `Math.round(valeur, 1)` passait un argument de précision que JavaScript ignore. Je conserve donc le résultat visible, sans introduire une modification de calcul dans ce chantier.

## Ce qui a changé

| Avant | Après | Pourquoi |
|---|---|---|
| AngularJS 1.2.9 et scripts globaux chargés par `index.html` | Angular 22.3.0, TypeScript et composants autonomes | Remplacer le framework v1 par la cible demandée et bénéficier du compilateur Angular moderne. |
| Contrôleurs, services et filtres enregistrés dans `angular.module` | Un composant racine, un service d’état injecté et des fonctions de calcul TypeScript | Séparer l’interface, l’état et les calculs; les fonctions pures sont plus faciles à tester. |
| Liaison par directives `ng-*` | Signaux Angular et événements de formulaire typés | Recalculer les résultats lors d’un changement d’état sans `$scope` ni digest AngularJS. |
| Chargement de scripts HTML manuel | Angular CLI, `angular.json`, TypeScript et bundle optimisé | Fournir une commande de build reproductible. |
| Jasmine 2.0.2 et `test.html` manuel | Tests Angular CLI avec Vitest 5 | Exécuter le même projet de tests depuis une commande npm. |
| Ancien CSS flottant | Mise en page responsive en grille avec libellés et états d’erreur accessibles | Garder les contrôles et résultats lisibles sur petit écran. |

Les anciens répertoires `app/`, `lib/`, `spec/` et `content/`, ainsi que l’ancien lanceur `test.html`, ont été retirés après le portage. Ils ne sont plus nécessaires au build Angular.

## Organisation actuelle

- `src/app/domain/health-calculations.ts` contient les formules, conversions, catégories BMI et formatage de la taille.
- `src/app/services/health-state.service.ts` garde le profil et l’unité de mesure dans un service Angular fourni à la racine.
- `src/app/app.ts`, `app.html` et `app.css` présentent les champs et résultats.
- `src/app/**/*.spec.ts` contient les tests des calculs, de l’état et des interactions utilisateur.
- `angular.json`, `package.json` et `package-lock.json` définissent le build et les dépendances.
- `ReadMe.md` explique les prérequis et les commandes de démarrage.

## Vérifications réalisées

Environnement utilisé : Node.js 24.15.0 portable, npm 11.12.1, Angular CLI 22.3.0, Angular 22.3.0, TypeScript 6.0.3 et Vitest 5.1.1 sous Windows.

- `npm run build` : réussi; bundle de production généré dans `dist/angular-health-app`.
- `npm test -- --watch=false` : réussi; 3 fichiers de test, 24 tests passés.
- La première exécution des tests a trouvé une attente incorrecte dans le nouveau test du BMR initial. Le profil de départ donne bien 1 365 calories selon la formule d’origine; l’attente a été corrigée puis toute la suite a réussi.
- Le dépôt initial contenait 83 cas Jasmine répartis dans 20 fichiers. La suite remplacée contient 24 tests ciblés sur les résultats, conversions, limites, valeurs par défaut, états et interactions principales. Les tests de présence triviale des objets AngularJS n’ont pas été conservés comme cas distincts.
- L’archive officielle Node.js 24.15.0 utilisée pour les contrôles a été comparée au manifeste SHA-256 officiel. Elle est portable, stockée temporairement hors du dépôt et n’a pas remplacé le Node installé sur la machine.

## À vérifier avant diffusion

- Aucun déploiement sur un hébergement cible, pipeline CI, contrôle navigateur multi-version ou recette métier n’a été exécuté.
- Confirmer avec l’équipe si les limites d’âge, de taille et de poids ainsi que les formules de démonstration sont les règles métier à conserver.
- Le dépôt d’origine n’avait pas de gestionnaire de paquets ni de build automatisé; le nouveau workflow local est documenté, mais aucun workflow GitHub Actions n’a été ajouté.
- La branche de travail reste locale. Aucun push, pull request, fusion ou déploiement n’a été effectué.

## Sources de référence

- Compatibilité Angular 22 / Node.js / TypeScript / RxJS : https://angular.dev/reference/versions
- Cycle de versions et support Angular : https://angular.dev/reference/releases
- Mise à niveau AngularJS et approche hybride `ngUpgrade` : https://angular.dev/api/upgrade/static/UpgradeModule
- Guide d’installation Node.js 24.15.0 : https://nodejs.org/en/download/archive/v24.15.0
