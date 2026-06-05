import { expect } from '@playwright/test';
import path from 'path';

export class SettingsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.settingsLink = page.getByRole('link', { name: 'Settings', exact: true });
    this.profileTab = page.getByRole('tab', { name: 'Profile' });
    this.signatureTab = page.getByRole('tab', { name: 'Signature' });
    this.uploadSignatureInput = page.locator('input[type="file"]');
    this.saveBtn = page.getByRole('button', { name: 'Save Changes' });
    this.successToast = page.getByText('Signature updated successfully');
  }

  async navigateToSettings() {
    await this.settingsLink.click();
    await this.page.waitForURL(/.*\/settings/);
  }

  async uploadSignature(fileName) {
    await this.signatureTab.click();
    const signatureFile = path.resolve(fileName);
    await this.uploadSignatureInput.setInputFiles(signatureFile);
    await this.saveBtn.click();
    await expect(this.successToast).toBeVisible();
  }
}
