import { expect } from '@playwright/test';

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email *');
    this.passwordInput = page.getByLabel('Password *');
    this.loginButton = page.getByRole('button', { name: 'Sign in' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password' });
    this.sessionConflictModal = page.locator('ngb-modal-window');
    this.logoutOtherSessionBtn = this.sessionConflictModal.locator('a.btn.btn-danger:has-text("Log Out")');
  }

  async navigate(baseUrl) {
    const url = baseUrl || 'http://sign.test-zentixs.com/';
    await this.page.goto(url);
    
    // Click Sign in link on homepage to reach Login Page
    const signInLink = this.page.getByRole('link', { name: 'Sign in' });
    await expect(signInLink).toBeVisible();
    await signInLink.click();
    await this.page.waitForURL(/auth\/login/);
  }

  async login(email, password) {
    await this.emailInput.fill(email.toLowerCase());
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async handleSessionConflict(email, password) {
    const result = await Promise.race([
      this.page.waitForURL(/dashboard/, { timeout: 15000 }).then(() => 'dashboard'),
      this.sessionConflictModal.waitFor({ state: 'visible', timeout: 15000 }).then(() => 'modal'),
    ]).catch(e => {
      console.error('❌ Timeout waiting for dashboard or modal: ' + e.message);
      return 'timeout';
    });

    if (result === 'modal') {
      console.log('⚠️ Session conflict detected, logging out other session...');
      await this.logoutOtherSessionBtn.click({ force: true });
      await this.sessionConflictModal.waitFor({ state: 'hidden' });
      
      // Re-attempt login
      await this.login(email, password);
      await this.page.waitForURL(/dashboard/);
    } else if (result === 'timeout') {
      throw new Error('Failed to reach dashboard after login attempt.');
    }
  }
}
