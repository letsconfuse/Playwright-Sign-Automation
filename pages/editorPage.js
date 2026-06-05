import { expect } from '@playwright/test';

export class EditorPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.signField = page.locator('#signField');
    this.canvas = page.locator('.upper-canvas.pdf-canvas');
    this.sendBtn = page.getByRole('button', { name: 'Send', exact: true });
    this.finishBtn = page.getByRole('button', { name: 'Finish', exact: true });
    
    // Modal & loader elements
    this.modalContent = page.locator('.modal-content');
    this.saveAndSignBtn = page.getByRole('button', { name: 'Save & sign' });
    this.mailLoader = page.locator('#mailLoader');
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
  }

  async waitForCanvas() {
    await expect(this.signField).toBeVisible();
    await expect(this.canvas).toBeVisible();
  }

  async dragFieldToCanvas(fieldSelector, offsetX, offsetY) {
    const field = this.page.locator(fieldSelector);
    const box = await field.boundingBox();
    const canvasBox = await this.canvas.boundingBox();

    if (box && canvasBox) {
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await this.page.mouse.down();
      await this.page.mouse.move(canvasBox.x + offsetX, canvasBox.y + offsetY, { steps: 10 });
      await this.page.mouse.up();
    }
  }

  async placeFieldsForRecipients(recipients, fields) {
    const baseX = 100;
    const baseY = 100;
    const xSpacing = 25;
    const ySpacing = 25;
    const maxFieldsPerColumn = 20;
    let placedCount = 0;

    for (let r = 0; r < recipients.length; r++) {
      for (const field of fields) {
        const column = Math.floor(placedCount / maxFieldsPerColumn);
        const row = placedCount % maxFieldsPerColumn;
        const offsetX = baseX + column * xSpacing;
        const offsetY = baseY + row * ySpacing;
        await this.dragFieldToCanvas(field, offsetX, offsetY);
        placedCount++;
        await this.page.waitForTimeout(150); // Small delay for UI stability
      }
    }
  }

  async clickSend() {
    await this.sendBtn.click();
  }

  async clickFinish() {
    await this.finishBtn.click();
  }

  async printRecipientModalSummary() {
    await expect(this.modalContent).toBeVisible();
    const rows = this.modalContent.locator('tbody tr');
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const recipient = await rows.nth(i).locator('td').nth(0).textContent();
      const fieldsCount = await rows.nth(i).locator('td').nth(1).textContent();
      const signCount = await rows.nth(i).locator('td').nth(2).textContent();
      console.log(`Recipient: ${recipient}, Fields: ${fieldsCount}, Signatures: ${signCount}`);
    }
  }

  async confirmSaveAndSign() {
    await this.saveAndSignBtn.click();
  }

  async handlePostExecutionFlow() {
    await expect(this.mailLoader).toBeHidden({ timeout: 30000 });

    if (await this.cancelBtn.isVisible()) {
      try {
        await this.cancelBtn.click({ timeout: 60000 });
      } catch (e) {
        await this.cancelBtn.click({ force: true });
      }
    }
  }

  async verifyLandingPage(urlRegex) {
    await expect(this.page).toHaveURL(urlRegex);
  }
}
