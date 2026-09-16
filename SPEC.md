# SPEC.md — Identité et orientation de Cap’Num

## Objectif

L’assistant propose des métiers du numérique en fonction du parcours scolaire de l’utilisateur.

## Critères d’acceptation

1. **Quand l’identité de l’assistant est affichée, le système utilise le nom `Cap’Num`**, sans espaces au début ni à la fin, avec une longueur comprise entre 2 et 20 caractères.

2. **Quand l’identité de l’assistant est affichée, le système utilise exactement un emoji `💻`**, qui compte comme un seul emoji même si JavaScript peut compter plusieurs unités de longueur.

3. **Quand la conversation est vide, le système affiche un message d’accueil** contenant `Cap’Num` et `💻`.

4. **Quand la conversation est vide, le système affiche exactement trois questions suggérées** sur les métiers du numérique.

5. **Quand l’assistant répond à une question, le système inclut `Cap’Num` et `💻` dans la réponse.**

6. **Quand les nouvelles fonctionnalités sont exécutées, le système conserve tous les tests du contrat CP1 au vert.**

7. **Quand l’utilisateur indique un parcours scolaire suffisamment détaillé, le système propose au moins trois métiers du numérique** en expliquant le lien avec ce parcours.

8. **Quand un métier est proposé, le système affiche son nom, une courte description et le lien avec le parcours scolaire** de l’utilisateur.

9. **Quand l’utilisateur clique sur une question suggérée, le système place cette question dans le champ de saisie** sans envoyer automatiquement le message.

10. **Quand l’utilisateur demande une orientation, le système rappelle que les propositions sont indicatives** et qu’elles ne remplacent pas l’avis d’un professionnel de l’orientation.

11. **Quand le parcours scolaire est insuffisant pour proposer une réponse personnalisée, le système demande une précision** au lieu d’inventer le parcours de l’utilisateur.

12. **Quand l’utilisateur envoie un message vide ou composé uniquement d’espaces, le système affiche une erreur** et ne crée aucun message dans la conversation.

13. **Quand le système est exécuté, le système ne collecte aucune donnée personnelle inutile** et ne propose aucune offre d’emploi.

## Hors périmètre

- Le système ne remplace pas un conseiller d’orientation.
- Le système ne garantit pas qu’un métier correspond parfaitement à l’utilisateur.
- Le système ne propose pas d’offres d’emploi.
- Le système ne collecte pas de données personnelles.
- Le système ne nécessite pas de connexion à une vraie IA.

## Données et fonctions attendues

### Identité

L’assistant s’appelle `Cap’Num` et utilise exactement l’emoji `💻`.

### Fonction `validateMessage`

- Fichier : `public/js/brain.js`
- Paramètre : un message utilisateur
- Retour : un objet indiquant si le message est valide et, s’il l’est, sa version nettoyée

### Fonction `replyTo`

- Fichier : `public/js/brain.js`
- Paramètre : le message de l’utilisateur
- Retour : une réponse textuelle non vide
- La réponse propose des métiers du numérique en fonction du parcours scolaire fourni.

### Données de l’assistant

- Nom : `Cap’Num`
- Emoji : `💻`
- Message d’accueil : contient le nom `Cap’Num`
- Questions suggérées : un tableau contenant exactement trois questions
- Chaque question suggérée concerne l’orientation vers un métier du numérique.
- Un parcours scolaire complet contient au minimum le niveau scolaire et les matières étudiées.

### Affichage

- Fichier : `public/js/view.js`
- Les messages sont affichés comme du texte.
- Les réponses de l’assistant ne doivent jamais être interprétées comme du HTML.

## Questions ouvertes

- Quelles matières scolaires doivent être prises en compte ?
- Faut-il proposer des formations avec chaque métier ?
- Combien de métiers faut-il afficher au maximum ?

## Règle d’orientation

Les propositions sont indicatives. Le message d’accueil ou les réponses doivent préciser
qu’elles ne remplacent pas l’avis d’un professionnel de l’orientation.
