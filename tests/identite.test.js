import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ASSISTANT_NAME, ASSISTANT_EMOJI, replyTo } from '../public/js/brain.js';

// Critères SPEC 1, 2, 5 — identité Cap'Num, sans figer de métier.
// Structurel : on vérifie le nom, l'emoji et leur présence dans les réponses.

describe('Identité Cap’Num (SPEC 1, 2, 5)', () => {
  it('SPEC 1 : le nom est Cap’Num, sans espaces, entre 2 et 20 caractères', () => {
    assert.equal(typeof ASSISTANT_NAME, 'string');
    assert.equal(ASSISTANT_NAME, 'Cap’Num');
    assert.equal(ASSISTANT_NAME.trim(), ASSISTANT_NAME);
    assert.ok(ASSISTANT_NAME.length >= 2 && ASSISTANT_NAME.length <= 20);
  });

  it('SPEC 2 : exactement un emoji 💻, compté en graphème', () => {
    assert.equal(typeof ASSISTANT_EMOJI, 'string');
    assert.equal(ASSISTANT_EMOJI, '💻');
    // 💻 compte comme un seul emoji même si length JS vaut 2 (surrogate pair).
    assert.equal([...ASSISTANT_EMOJI].length, 1);
    assert.equal(Array.from(ASSISTANT_EMOJI).length, 1);
  });

  it('SPEC 5 : chaque réponse inclut Cap’Num et 💻', () => {
    for (const entree of ['salut', 'aide', 'test', 'Je suis en terminale, spécialités maths et NSI']) {
      const reponse = replyTo(entree);
      assert.equal(typeof reponse, 'string');
      assert.ok(reponse.includes('Cap’Num'), `réponse à ${entree} doit contenir Cap’Num`);
      assert.ok(reponse.includes('💻'), `réponse à ${entree} doit contenir 💻`);
    }
  });
}); 
