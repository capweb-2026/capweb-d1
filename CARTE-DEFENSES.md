# Carte des défenses

Chaque ligne dit quelle connerie est arrêtée, par quoi, et **où est la preuve** : le lien d'un run rouge ou d'une PR bloquée. Une barrière sans preuve ne compte pas.

| Connerie | Barrière qui l'arrête | Preuve (lien) | Checkpoint |
|---|---|---|---|
| Régression | Tests de contrat et CI obligatoire sur `main` | | CP1 |
| Test affaibli ou supprimé | `check:tests` (TEST-CHANGE obligatoire) et relecture | [PR #5 refusée](https://github.com/capweb-2026/capweb-d1/pull/5) : test de `tests/contrat/` transformé en tautologie (compare une valeur à elle-même) | CP2 |
| Dépendance ajoutée | `check:deps` et `dependances-autorisees.json` | [PR #6 refusée](https://github.com/capweb-2026/capweb-d1/pull/6) : `dayjs` ajouté sans autorisation, `check:deps` rouge | CP2 |
| Secret exposé | | | CP3 |
| IA qui sort de son thème | | | CP3 |
| Faille (`innerHTML`, injection) | | | CP4 |
| Contrôle désactivé | | | CP4 |
| Action destructrice | | | CP4 |
