import { test as setup, expect } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  console.log('🚀 Starting authentication setup...');
  
  // Use baseURL from config, fallback to hardcoded if env fails
  const url = process.env.BASE_URL || 'http://sign.test-zentixs.com/';
  await page.goto(url);
  console.log(`✅ Navigated to ${url}`);

  // Click Sign in - using a more robust role-based locator
  const signInLink = page.getByRole('link', { name: 'Sign in' });
  await expect(signInLink).toBeVisible();
  await signInLink.click();
  
  await page.waitForURL(/auth\/login/);
  console.log('✅ Reached Login page');

  // Perform login
  const email = process.env.USER_EMAIL;
  const password = process.env.USER_PASSWORD;

  if (!email || !password) {
    throw new Error('❌ Missing USER_EMAIL or USER_PASSWORD in .env file');
  }

  await page.getByLabel('Email *').fill(email);
  await page.getByLabel('Password *').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Handle potential "Already logged in" modal or Dashboard redirect
  console.log('⏳ Waiting for dashboard...');
  
  const modal = page.locator('ngb-modal-window');
  const result = await Promise.race([
    page.waitForURL(/dashboard/, { timeout: 15000 }).then(() => 'dashboard'),
    modal.waitFor({ state: 'visible', timeout: 15000 }).then(() => 'modal'),
  ]).catch(e => {
    console.error('❌ Timeout waiting for dashboard or modal: ' + e.message);
    return 'timeout';
  });

  if (result === 'modal') {
    console.log('⚠️ Session conflict detected, logging out other session...');
    await modal.locator('a.btn.btn-danger:has-text("Log Out")').click({ force: true });
    await modal.waitFor({ state: 'hidden' });
    
    // Re-attempt login
    await page.getByLabel('Email *').fill(email);
    await page.getByLabel('Password *').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL(/dashboard/);
  } else if (result === 'timeout') {
    throw new Error('Failed to reach dashboard after login attempt.');
  }

  console.log('✅ Login successful, saving storage state...');
  await page.context().storageState({ path: 'auth.json' });
  console.log('🏁 Auth state saved to auth.json');
});
