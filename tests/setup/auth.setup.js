import { test as setup } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';

setup('authenticate', async ({ page }) => {
  console.log('🚀 Starting authentication setup using Page Object Model...');
  
  const baseUrl = process.env.BASE_URL || 'http://sign.test-zentixs.com/';
  const email = process.env.USER_EMAIL;
  const password = process.env.USER_PASSWORD;

  if (!email || !password) {
    throw new Error('❌ Missing USER_EMAIL or USER_PASSWORD in .env file');
  }

  const loginPage = new LoginPage(page);
  await loginPage.navigate(baseUrl);
  console.log(`✅ Navigated and reached login page`);

  await loginPage.login(email, password);
  console.log('⏳ Submitted login details. Handling potential session conflicts...');

  await loginPage.handleSessionConflict(email, password);
  console.log('✅ Login successful, saving storage state...');

  await page.context().storageState({ path: 'auth.json' });
  console.log('🏁 Auth state saved to auth.json');
});
