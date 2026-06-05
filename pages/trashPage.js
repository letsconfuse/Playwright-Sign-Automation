import { expect } from '@playwright/test';

export class TrashPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.trashLink = page.getByRole('link', { name: 'Trash', exact: true });
    this.restoreBtn = page.getByRole('button', { name: 'Restore' }).first();
    this.deleteForeverBtn = page.getByRole('button', { name: 'Delete Forever' }).first();
    this.confirmModalBtn = page.getByRole('button', { name: 'Yes, Restore' });
  }

  async navigateToTrash() {
    await this.trashLink.click();
    await this.page.waitForURL(/.*\/trash/);
  }

  async restoreFirstDocument() {
    await expect(this.restoreBtn).toBeVisible();
    await this.restoreBtn.click();
    if (await this.confirmModalBtn.isVisible()) {
      await this.confirmModalBtn.click();
    }
  }
}
