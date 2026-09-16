import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateMessage, replyTo } from '../public/js/brain.js';

// Critères SPEC 6, 12, 13 — contrat CP1, message vide, garde-fous.
// Ne touche à aucun test existant : on protège le contrat par des vérifications génériques.

describe('Garde-fous (SPEC 6, 12, 13)', () => {
  it('SPEC 12 : message vide ou espaces seuls → erreur, sans créer de message', () => {
    for (const entree of ['', ' ', '   \n\t ']) {
      const validation = validateMessage(entree);
      assert.equal(validation.ok, false);
      assert.equal(typeof validation.error, 'string');
      assert.ok(validation.error.trim().length > 0);
    }
    // replyTo reste une réponse d’aide non vide, sans créer un échange métier.
    for (const entree of ['', '   ']) {
      const reponse = replyTo(entree);
      assert.equal(typeof reponse, 'string');
      assert.ok(reponse.trim().length > 0);
    }
  });

  it('SPEC 6 : le contrat CP1 reste présent et protecteur', async () => {
    const contrat = await readFile(new URL('./contrat/brain.contrat.test.js', import.meta.url), 'utf8');
    for (const attendu of ['validateMessage', 'replyTo']) {
      assert.ok(contrat.includes(attendu), `le contrat CP1 doit couvrir ${attendu}`);
    }
  });

  it('SPEC 6 : brain.js ne touche pas à la page', async () => {
    const code = await readFile(new URL('../public/js/brain.js', import.meta.url), 'utf8');
    const sansCommentaires = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
    assert.doesNotMatch(sansCommentaires, /\bdocument\b|\bwindow\b|localStorage/);
  });

  it('SPEC 13 : aucune donnée personnelle collectée, aucune offre d’emploi', () => {
    const echantillons = [
      replyTo('salut'),
      replyTo('aide'),
      replyTo('Je suis en terminale, spécialités maths et NSI, quels métiers du numérique pour moi ?'),
    ];
    for (const reponse of echantillons) {
      assert.doesNotMatch(reponse, /offre d’emploi|recrute|postulez|envoyez votre CV/i, 'jamais d’offre d’emploi');
      assert.doesNotMatch(reponse, /adresse e-mail|numéro de téléphone|nom de famille|adresse postale/i, 'jamais de collecte personnelle');
    }
  });
});
