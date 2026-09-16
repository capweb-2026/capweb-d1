import { test, expect } from '@playwright/test';
/* global localStorage -- callbacks exécutés dans la page */

// Tests critères 1 à 5 (SPEC.md) : identité Cap’Num dans le navigateur.
// Rouges attendus avant implémentation : le h1 dit « Cap Web »,
// sans accueil #accueil ni suggestions #suggestions, sans Cap’Num ni 💻 en réponse.
// Les suggestions sont testées en structure seulement (3, non vides, distinctes) :
// les libellés viendront d’un accord humain ultérieur (pas de métier inventé).

const NOM = 'Cap’Num';
const EMOJI = '💻';

async function pageNeuve(page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function envoyer(page, texte) {
  await page.locator('#message').fill(texte);
  await page.getByRole('button', { name: /envoyer/i }).click();
}

test.describe('Critères 1-2 — identité affichée', () => {
  test('le nom Cap’Num est affiché, sans espaces au début ni à la fin', async ({ page }) => {
    await pageNeuve(page);
    const texte = (await page.locator('header h1').textContent()) ?? '';
    expect(texte).toContain(NOM);
    expect(NOM.trim()).toBe(NOM);
    expect(NOM.length).toBeGreaterThanOrEqual(2);
    expect(NOM.length).toBeLessThanOrEqual(20);
  });

  test('un seul emoji 💻 est affiché dans l’identité', async ({ page }) => {
    await pageNeuve(page);
    const texte = (await page.locator('header').textContent()) ?? '';
    expect(texte.split(EMOJI).length - 1).toBe(1);
  });
});

test.describe('Critères 3-4 — conversation vide', () => {
  test('un accueil avec Cap’Num et 💻 est visible', async ({ page }) => {
    await pageNeuve(page);
    await expect(page.locator('#messages li')).toHaveCount(0);
    await expect(page.locator('#accueil')).toContainText(NOM);
    await expect(page.locator('#accueil')).toContainText(EMOJI);
  });

  test('exactement trois suggestions non vides et distinctes', async ({ page }) => {
    await pageNeuve(page);
    const suggestions = page.locator('#suggestions li, #suggestions button');
    await expect(suggestions).toHaveCount(3);
    const textes = await suggestions.allTextContents();
    for (const ligne of textes) {
      expect(ligne.trim().length).toBeGreaterThan(0);
    }
    expect(new Set(textes.map((ligne) => ligne.trim())).size).toBe(3);
  });
});

test.describe('Critère 5 — réponse affichée', () => {
  test('la réponse contient Cap’Num et 💻, en texte seul', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    const lignes = page.locator('#messages li');
    await expect(lignes).toHaveCount(2);
    await expect(lignes.nth(1)).toContainText(NOM);
    await expect(lignes.nth(1)).toContainText(EMOJI);
    await expect(page.locator('#messages b')).toHaveCount(0);
  });
});
