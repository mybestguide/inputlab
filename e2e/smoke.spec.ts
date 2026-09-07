import { test, expect } from '@playwright/test';

test.describe('InputLab Foundation Smoke Tests', () => {
  test('loads home page and displays diagnostic navigation and header', async ({ page }) => {
    await page.goto('/');
    
    // Check that header branding is visible
    await expect(page.locator('text=InputLab')).toBeVisible();
    
    // Check navigation pills
    await expect(page.getByRole('link', { name: /mouse/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /keyboard/i })).toBeVisible();
  });
});
