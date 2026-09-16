# SPEC.md — *nom de la fonctionnalité*

> Modèle à copier à la racine de votre dépôt. Une spec dit **ce que** le système doit faire, pas comment. Chaque critère doit pouvoir être vérifié par un test automatique ou par une démo de 30 secondes. Un exemple complet se trouve en fin de fichier.

## Objectif

l'assistant propose des solutions de metiers du numerique par rapport au parcours scolaires 
## Critères d'acceptation

Rédigez chaque critère sous la forme « Quand …, le système … ». Numérotez-les : les tests et les PR y feront référence.


1. **Quand l’identité de l’assistant est affichée, le système utilise le nom « Cap’Num »**, sans espaces au début ni à la fin, avec une longueur comprise entre 2 et 20 caractères.

2. **Quand l’identité de l’assistant est affichée, le système utilise exactement un emoji**, par exemple `💻`.

3. **Quand la conversation est vide, le système affiche un message d’accueil** contenant le nom `Cap’Num` et l’emoji `💻`.

4. **Quand la conversation est vide, le système affiche exactement trois questions suggérées** sur les métiers du numérique.

5. **Quand l’utilisateur indique son parcours scolaire, le système propose au moins trois métiers du numérique** adaptés à ce parcours.

6. **Quand un métier est proposé, le système affiche son nom, une courte description et le lien avec le parcours scolaire** de l’utilisateur.

7. **Quand l’utilisateur clique sur une question suggérée, le système place cette question dans le champ de saisie** sans envoyer automatiquement le message.

8. **Quand l’utilisateur demande une orientation, la réponse rappelle que les propositions sont indicatives** et qu’elles ne remplacent pas l’avis d’un professionnel de l’orientation.

9. **Quand le parcours scolaire est insuffisant pour proposer une réponse personnalisée, le système demande une précision** au lieu d’inventer le parcours de l’utilisateur.

10. **Quand l’assistant répond à une question, sa réponse contient son nom et son emoji**, par exemple `Cap’Num 💻`.

11. **Quand l’utilisateur envoie un message vide ou composé uniquement d’espaces, le système affiche une erreur** et ne crée aucun message dans la conversation.

12. **Quand le système est exécuté, tous les tests du contrat CP1 restent verts.**


## Hors périmètre

*Ce que cette fonctionnalité ne fait pas, pour que l'agent n'en fasse pas plus.*

1. 

## Données et fonctions attendues

*Noms de fichiers, de fonctions exportées, de paramètres et de valeurs de retour. C'est ce qui permet d'écrire les tests avant le code.*

## Questions ouvertes

*Ce que vous n'avez pas encore décidé. L'agent doit poser la question plutôt que choisir à votre place.*

---

## Exemple complet : l'identité de Boussole

### Objectif

L'assistant a une identité reconnaissable dès l'ouverture de la page : un nom, un emoji, un message d'accueil et trois questions pour démarrer.

### Critères d'acceptation

1. **Nom** — Quand la page s'ouvre, le système affiche le nom de l'assistant dans le titre principal. Le nom fait de 2 à 20 caractères.
2. **Emoji** — Quand la page s'ouvre, le système affiche un seul emoji à côté du nom.
3. **Accueil** — Quand la conversation est vide, le système affiche un message d'accueil qui contient le nom. Ce message n'est pas une ligne de `#messages`, disparaît dès le premier message envoyé et revient quand la conversation est effacée.
4. **Suggestions** — Quand la page s'ouvre, le système propose exactement trois questions suggérées. Quand l'utilisateur clique sur l'une d'elles, le système la place dans le champ de saisie sans l'envoyer.
5. **Réponses signées** — Quand l'assistant répond, sa ligne commence par son nom au lieu de « Cap Web ».
6. **Contrat** — Les tests de contrat CP1 restent verts.

### Hors périmètre

Pas de choix de l'identité par l'utilisateur, pas d'image d'avatar, pas d'appel à une IA.

### Données et fonctions attendues

- `public/js/persona.js` exporte `persona = { nom, emoji, accueil, suggestions }` et `validatePersona(persona)`, qui renvoie `{ ok: true }` ou `{ ok: false, erreurs: [texte, …] }`.
- `validatePersona` refuse : un nom de moins de 2 ou de plus de 20 caractères ; un emoji qui n'est pas exactement un emoji ; un accueil qui ne contient pas le nom ; un nombre de suggestions différent de trois ou une suggestion vide.
- La page contient `#accueil` et `#suggestions`, en dehors de `#messages`.
- `persona.js` est ajouté à la liste blanche du serveur local.

### Questions ouvertes

Aucune.
