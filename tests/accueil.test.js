import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { WELCOME_MESSAGE, SUGGESTED_QUESTIONS } from '../public/js/brain.js';

// Critères SPEC 3, 4 — accueil et questions suggérées.
// Structurel générique : aucun nom de métier en dur.

const MOTIF_ORIENTATION = /métier|numérique|orientation|parcours/i;

describe('Accueil et suggestions (SPEC 3, 4)', () => {
  it('SPEC 3 : conversation vide → accueil contenant Cap’Num et 💻', () => {
    assert.equal(typeof WELCOME_MESSAGE, 'string');
    assert.ok(WELCOME_MESSAGE.trim().length > 0);
    assert.ok(WELCOME_MESSAGE.includes('Cap’Num'), 'l’accueil doit contenir Cap’Num');
    assert.ok(WELCOME_MESSAGE.includes('💻'), 'l’accueil doit contenir 💻');
  });

  it('SPEC 4 : exactement trois questions suggérées', () => {
    assert.ok(Array.isArray(SUGGESTED_QUESTIONS));
    assert.equal(SUGGESTED_QUESTIONS.length, 3);
  });

  it('SPEC 4 : chaque suggestion est une question sur les métiers du numérique', () => {
    for (const question of SUGGESTED_QUESTIONS) {
      assert.equal(typeof question, 'string');
      assert.ok(question.trim().length > 10, `suggestion trop courte : ${question}`);
      assert.ok(question.includes('?'), `chaque suggestion est une question : ${question}`);
      assert.ok(
        MOTIF_ORIENTATION.test(question),
        `chaque suggestion concerne l’orientation numérique : ${question}`,
      );
    }
    assert.equal(new Set(SUGGESTED_QUESTIONS.map((q) => q.trim())).size, 3, 'les trois suggestions sont distinctes');
  });
});
