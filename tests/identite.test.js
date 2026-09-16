import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as brain from '../public/js/brain.js';

// Tests critères 1 à 5 (SPEC.md) : identité et accueil de Cap’Num.
// Rouge attendu avant implémentation : brain.js ne connaît ni Cap’Num ni 💻.
// Style suivi : node:test + assert strict, comme tests/contrat/brain.contrat.test.js.

const NOM_ATTENDU = 'Cap’Num';
const EMOJI_ATTENDU = '💻';

const compteEmoji = (texte) => texte.split(EMOJI_ATTENDU).length - 1;

const compteGraphemes = (texte) =>
  [...new Intl.Segmenter('fr', { granularity: 'grapheme' }).segment(texte)].length;

describe('Critère 1 — nom Cap’Num', () => {
  it('expose exactement Cap’Num avec l’apostrophe typographique U+2019', () => {
    assert.equal(brain.ASSISTANT_NOM, NOM_ATTENDU);
  });

  it('n’a ni espace au début ni espace à la fin', () => {
    assert.equal(typeof brain.ASSISTANT_NOM, 'string');
    assert.equal(brain.ASSISTANT_NOM.trim(), brain.ASSISTANT_NOM);
  });

  it('a une longueur comprise entre 2 et 20 caractères', () => {
    assert.ok(brain.ASSISTANT_NOM.length >= 2, 'au moins 2 caractères');
    assert.ok(brain.ASSISTANT_NOM.length <= 20, 'au plus 20 caractères');
  });
});

describe('Critère 2 — emoji 💻 unique', () => {
  it('expose exactement 💻 (U+1F4BB)', () => {
    assert.equal(brain.ASSISTANT_EMOJI, EMOJI_ATTENDU);
  });

  it('compte comme un seul grapheme avec Intl.Segmenter', () => {
    assert.equal(compteGraphemes(brain.ASSISTANT_EMOJI), 1);
  });

  it('documente le piège UTF-16 : 💻.length vaut 2 en unités de code', () => {
    assert.equal(EMOJI_ATTENDU.length, 2);
    assert.equal(compteGraphemes(EMOJI_ATTENDU), 1);
  });
});

describe('Critère 3 — accueil quand la conversation est vide', () => {
  it('contient Cap’Num', () => {
    assert.equal(typeof brain.MESSAGE_ACCUEIL, 'string');
    assert.ok(brain.MESSAGE_ACCUEIL.includes(NOM_ATTENDU), 'accueil sans Cap’Num');
  });

  it('contient 💻', () => {
    assert.ok(brain.MESSAGE_ACCUEIL.includes(EMOJI_ATTENDU), 'accueil sans 💻');
  });

  it('ne contient qu’une seule occurrence de 💻', () => {
    assert.equal(compteEmoji(brain.MESSAGE_ACCUEIL), 1);
  });
});

describe('Critère 4 — exactement trois questions suggérées', () => {
  it('est un tableau d’exactement trois questions', () => {
    assert.ok(Array.isArray(brain.QUESTIONS_SUGGEREES), 'pas un tableau');
    assert.equal(brain.QUESTIONS_SUGGEREES.length, 3);
  });

  it('ne contient que des chaînes non vides', () => {
    for (const question of brain.QUESTIONS_SUGGEREES) {
      assert.equal(typeof question, 'string');
      assert.ok(question.trim().length > 0, 'question vide');
    }
  });

  it('contient trois questions distinctes', () => {
    assert.equal(new Set(brain.QUESTIONS_SUGGEREES).size, 3);
  });
});

describe('Critère 5 — chaque réponse inclut Cap’Num et 💻', () => {
  it('inclut Cap’Num et 💻 pour salut', () => {
    const reponse = brain.replyTo('salut');
    assert.ok(reponse.includes(NOM_ATTENDU), 'réponse sans Cap’Num');
    assert.ok(reponse.includes(EMOJI_ATTENDU), 'réponse sans 💻');
  });

  it('inclut Cap’Num et 💻 pour aide, test, phrase inconnue et vide', () => {
    for (const message of ['aide', 'test', 'parle-moi de la météo', '']) {
      const reponse = brain.replyTo(message);
      assert.ok(reponse.includes(NOM_ATTENDU), `sans Cap’Num pour ${JSON.stringify(message)}`);
      assert.ok(reponse.includes(EMOJI_ATTENDU), `sans 💻 pour ${JSON.stringify(message)}`);
    }
  });

  it('garde l’insensibilité à la casse et aux espaces avec l’identité', () => {
    const reponse = brain.replyTo('  SALUT ');
    assert.ok(reponse.includes(NOM_ATTENDU), 'sans Cap’Num pour SALUT espacé');
    assert.ok(reponse.includes(EMOJI_ATTENDU), 'sans 💻 pour SALUT espacé');
  });
});
