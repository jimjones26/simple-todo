import { expect, test } from '@playwright/test';

test('Login page has email input and submit button', async ({ page }) => {
  await page.goto('/login');

  // Check for email input field
  const emailInput = await page.locator('input[type="email"]');
  await expect(emailInput).toBeVisible();

  // Check for submit button
  const submitButton = await page.locator('button[type="submit"]');
  await expect(submitButton).toBeVisible();

  // Basic check for shadcn styling (can be improved with more specific class checks)
  await expect(submitButton).toHaveClass(/bg-primary/);
});

