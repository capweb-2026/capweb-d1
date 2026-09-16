import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { replyTo } from '../public/js/brain.js';

// Critères SPEC 7, 8, 10, 11 — orientation.
// Tests structurels génériques : aucun métier, description ou lien en dur.
// Parcours complet validé = niveau + matières ; insuffisant = niveau seul / demande vague.

const PARCOURS_COMPLET = 'Je suis en terminale, spécialités maths et NSI, quels métiers du numérique pour moi ?';
const PARCOURS_INSUFFISANT_NIVEAU_SEUL = 'Je suis en terminale';
const PARCOURS_INSUFFISANT_VAGUE = 'Je veux travailler dans le numérique';

// Structure minimale attendue pour chaque proposition : nom, description, lien parcours.
const estPropositionComplete = (bloc) =>
  /nom|métier/i.test(bloc) && /description/i.test(bloc) && /lien|parcours/i.test(bloc);

// Le rappel « propositions indicatives, avis d’un professionnel » ne doit jamais disparaître.
const RAPPEL_INDICATIF = /indicatif|professionnel de l’orientation/i;

describe('Orientation (SPEC 7, 8, 10, 11)', () => {
  it('SPEC 7 : parcours détaillé → au moins trois métiers expliqués', () => {
    const reponse = replyTo(PARCOURS_COMPLET);
    const puces = reponse.split('\n').filter((ligne) => /^\s*[-*•\d]/.test(ligne) || /métier/i.test(ligne));
    assert.ok(puces.length >= 3, `au moins trois métiers attendus, reçu : ${reponse}`);
  });

  it('SPEC 8 : chaque métier proposé a nom, description et lien avec le parcours', () => {
    const reponse = replyTo(PARCOURS_COMPLET);
    assert.ok(estPropositionComplete(reponse), `chaque proposition doit montrer nom, description et lien parcours : ${reponse}`);
  });

  it('SPEC 10 : toute orientation rappelle le caractère indicatif', () => {
    for (const entree of [PARCOURS_COMPLET, 'Quels métiers après un bac STI2D avec SIN ?', 'Je suis en BTS SIO, matières réseau et dev']) {
      const reponse = replyTo(entree);
      assert.ok(RAPPEL_INDICATIF.test(reponse), `réponse à « ${entree} » doit rappeler le caractère indicatif`);
    }
  });

  it('SPEC 11 : parcours insuffisant → demande de précision, pas d’invention', () => {
    for (const entree of [PARCOURS_INSUFFISANT_NIVEAU_SEUL, PARCOURS_INSUFFISANT_VAGUE]) {
      const reponse = replyTo(entree);
      assert.ok(
        /précis|quel.*niveau|quelle.*matière|spécialité/i.test(reponse),
        `face à « ${entree} », demander une précision au lieu d’inventer : ${reponse}`,
      );
    }
  });
});
