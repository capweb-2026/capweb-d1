import { test, expect } from '@playwright/test';

/* global localStorage -- callbacks exécutés dans la page */

// Identité Cap'Num (SPEC 1, 2, 5) — côté navigateur.
// SPEC 1 : nom Cap’Num, sans espaces, 2 à 20 caractères.
// SPEC 2 : exactement un emoji 💻 dans l’identité.
// SPEC 5 : chaque réponse de l’assistant inclut Cap’Num et 💻.

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

test.describe('Identité — nom et emoji (SPEC 1, 2)', () => {
  test('SPEC 1 : l’identité affichée utilise le nom Cap’Num', async ({ page }) => {
    await pageNeuve(page);
    await expect(page.locator('header h1')).toBeVisible();
    const brut = (await page.locator('header h1').textContent()) ?? '';
    const nom = brut.trim();
    expect(nom).toBe('Cap’Num');
    expect(nom.length).toBeGreaterThanOrEqual(2);
    expect(nom.length).toBeLessThanOrEqual(20);
  });

  test('SPEC 2 : l’identité affichée utilise exactement un emoji 💻', async ({ page }) => {
    await pageNeuve(page);
    const identite = (await page.locator('header').textContent()) ?? '';
    expect(identite).toContain('💻');
    // Exactement une occurrence dans l’identité.
    expect(identite.split('💻').length - 1).toBe(1);
    // 💻 compte comme un seul emoji même si sa length JS vaut 2.
    expect([...'💻'].length).toBe(1);
    expect([...identite].filter((c) => c === '💻')).toHaveLength(1);
  });
});

test.describe('Identité — réponse (SPEC 5)', () => {
  test('SPEC 5 : la réponse affichée inclut Cap’Num et 💻', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    await expect(lignes(page).nth(1)).toContainText('Cap’Num');
    await expect(lignes(page).nth(1)).toContainText('💻');
  });
});
