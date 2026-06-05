export class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.signLink = page.getByRole('link', { name: 'Sign', exact: true });
  }

  async navigateToDashboard() {
    await this.page.goto('/dashboard');
  }

  async navigateToSignPage() {
    await this.signLink.click();
    await this.page.waitForURL(/.*\/sign/);
  }
}
