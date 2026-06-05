import { expect } from '@playwright/test';

export class HistoryPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.inProgressLink = page.getByRole('link', { name: 'In Progress', exact: true });
    this.firstDocRow = page.locator('tbody tr').first();
    this.historyBtn = page.getByRole('button', { name: 'History' });
    this.auditReportBtn = page.getByRole('button', { name: 'Audit Report' });
    this.historyModal = page.locator('.modal-content');
    this.closeModalBtn = page.getByRole('button', { name: 'Close' });
  }

  async navigateToInProgress() {
    await this.inProgressLink.click();
    await this.page.waitForURL(/.*\/inprogressdocuments/);
  }

  async viewFirstDocumentHistory() {
    await this.firstDocRow.click();
    await this.historyBtn.click();
    await expect(this.historyModal).toBeVisible();
    await this.closeModalBtn.click();
  }

  async downloadAuditReport() {
    await this.firstDocRow.click();
    const downloadPromise = this.page.waitForEvent('download');
    await this.auditReportBtn.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  }
}
