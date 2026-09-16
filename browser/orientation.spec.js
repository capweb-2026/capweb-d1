import { test, expect } from '@playwright/test';

/* global localStorage -- callbacks exécutés dans la page */

// Orientation Cap'Num (SPEC 3, 4, 5, 9, 12) — côté navigateur.
// Convention attendue : accueil visible à vide + conteneur #suggestions avec 3 boutons.

async function pageNeuve(page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function envoyer(page, texte) {
  await page.locator('#message').fill(texte);
  await page.getByRole('button', { name: /envoyer/i }).click();
}

const lignes = (page) => page.locator('#messages li');
const suggestions = (page) => page.locator('#suggestions button');

test.describe('Orientation — accueil et suggestions (SPEC 3, 4, 9)', () => {
  test('SPEC 3 : conversation vide → accueil avec Cap’Num et 💻', async ({ page }) => {
    await pageNeuve(page);
    await expect(lignes(page)).toHaveCount(0);
    await expect(page.locator('body')).toContainText('Cap’Num');
    await expect(page.locator('body')).toContainText('💻');
  });

  test('SPEC 4 : exactement trois questions suggérées sur les métiers du numérique', async ({ page }) => {
    await pageNeuve(page);
    await expect(suggestions(page)).toHaveCount(3);
    for (let i = 0; i < 3; i += 1) {
      const texte = (await suggestions(page).nth(i).textContent()) ?? '';
      expect(texte.trim().length).toBeGreaterThan(10);
      expect(texte).toMatch(/\?/);
      expect(texte).toMatch(/métier|numérique|orientation|parcours/i);
    }
  });

  test('SPEC 9 : cliquer une suggestion remplit le champ sans envoyer', async ({ page }) => {
    await pageNeuve(page);
    const question = ((await suggestions(page).first().textContent()) ?? '').trim();
    expect(question.length).toBeGreaterThan(0);
    await suggestions(page).first().click();
    await expect(page.locator('#message')).toHaveValue(question);
    await expect(lignes(page)).toHaveCount(0);
  });
});

test.describe('Orientation — réponse et vide (SPEC 5, 12)', () => {
  test('SPEC 5 : la réponse affichée inclut Cap’Num et 💻', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    await expect(lignes(page).nth(1)).toContainText('Cap’Num');
    await expect(lignes(page).nth(1)).toContainText('💻');
  });

  test('SPEC 12 : message vide → erreur visible, aucun message créé', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, '   ');
    await expect(page.locator('#status')).not.toHaveText(/^\s*$/);
    await expect(lignes(page)).toHaveCount(0);
  });
});
