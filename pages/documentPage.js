export class DocumentPage {
  constructor(page) {
    this.page = page;
    this.uploadBtn = page.locator('#uploadDocBtn');
    this.addSignerBtn = page.locator('#addSignerBtn');
    this.signerEmailInput = page.locator('#signerEmail');
    this.sendBtn = page.locator('#sendForSignatureBtn');
    this.successMessage = page.getByText('Document sent successfully');
  }

  async uploadDocument(filePath) {
    // Standard Playwright way to upload files
    await this.page.setInputFiles('ngx-dropzone input[type="file"]', filePath);
  }

  async addSigner(email) {
    await this.addSignerBtn.click();
    await this.signerEmailInput.fill(email);
    // Assuming there's a save button in the modal/form
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async sendForSignature() {
    await this.sendBtn.click();
    await expect(this.successMessage).toBeVisible();
  }
}
