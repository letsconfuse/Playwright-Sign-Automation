import { expect } from '@playwright/test';
import path from 'path';

export class SignPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.sendForSignatureBtn = page.getByRole('button', { name: 'Send for Signature' });
    this.signYourselfBtn = page.getByRole('button', { name: 'Sign Yourself' });
    this.fileInput = page.locator('ngx-dropzone input[type="file"]');
    this.documentNameInput = page.locator('#txtDocumentName');
    this.continueBtn = page.locator('#btnContinue');
    this.expiresInInput = page.locator('#txtExpiresIn');
    this.noteInput = page.locator('#txtNote');
  }

  async clickSendForSignature() {
    await this.sendForSignatureBtn.click();
  }

  async clickSignYourself() {
    await this.signYourselfBtn.click();
  }

  async uploadDocument(fileName) {
    await expect(this.fileInput).toBeVisible();
    const pdfFile = path.resolve(fileName);
    await this.fileInput.setInputFiles(pdfFile);
    await expect(this.documentNameInput).toBeVisible();
  }

  async fillDocumentDetails(name, expiresIn = null, note = null) {
    await this.documentNameInput.fill(name);
    if (expiresIn) {
      await this.expiresInInput.fill(expiresIn.toString());
    }
    if (note) {
      await this.noteInput.fill(note);
    }
  }

  async addRecipients(recipients) {
    for (let i = 0; i < recipients.length; i++) {
      if (i > 0) {
        // Click the "+" button of the previous row to add a new recipient
        await this.page.locator(`#btnAdd${i}`).click();
      }
      // Fill Email and Name
      await this.page.locator(`#txtEmail${i + 1}`).fill(recipients[i].email);
      await this.page.locator(`#txtName${i + 1}`).fill(recipients[i].name);
    }
  }

  async clickContinue() {
    await this.continueBtn.click();
  }
}
