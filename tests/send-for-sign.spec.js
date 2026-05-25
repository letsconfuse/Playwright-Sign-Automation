import { test, expect } from '@playwright/test';
import path from 'path';

test('Send for Signature flow with multi-recipient PDF and field placement', async ({ page }) => {
  // 1️⃣ Navigate to Dashboard
  await page.goto('/dashboard');

  // 2️⃣ Go to "Sign" page
  await page.getByRole('link', { name: 'Sign', exact: true }).click();
  await expect(page).toHaveURL(/.*\/sign/);

  // 3️⃣ Click "Send for Signature"
  await page.getByRole('button', { name: 'Send for Signature' }).click();

  // 4️⃣ Upload PDF using relative path
  const fileInput = page.locator('ngx-dropzone input[type="file"]');
  await expect(fileInput).toBeVisible();
  const pdfFile = path.resolve('Dummy File.pdf');
  await fileInput.setInputFiles(pdfFile);

  // 5️⃣ Fill document name
  await expect(page.locator('#txtDocumentName')).toBeVisible();
  await page.locator('#txtDocumentName').fill('Test Document');

  // 6️⃣ Add recipients dynamically
  const recipients = [
    { name: 'First', email: 'aarav.kulkarni990edit@yopmail.com' }
  ];

  for (let i = 0; i < recipients.length; i++) {
    if (i > 0) {
      // Click the "+" button of the previous row to add a new recipient
      await page.locator(`#btnAdd${i}`).click();
    }

    // Fill Email and Name
    await page.locator(`#txtEmail${i + 1}`).fill(recipients[i].email);
    await page.locator(`#txtName${i + 1}`).fill(recipients[i].name);
  }

  // 7️⃣ Set expiry days (optional)
  await page.locator('#txtExpiresIn').fill('5');

  // 8️⃣ Add note (optional)
  await page.locator('#txtNote').fill('Please sign this document.');

  // 9️⃣ Continue to field placement
  await page.locator('#btnContinue').click();
  
  // Wait for draggable fields and canvas
  await expect(page.locator('#signField')).toBeVisible();
  const canvas = page.locator('.upper-canvas.pdf-canvas');
  await expect(canvas).toBeVisible();

  // 🔹 Field placement
  const fields = [
    '#signField',
    '#fullNameField',
    '#dateField',
    '#textField',
    '#checkboxField'
  ];

  const baseX = 100;
  const baseY = 100;
  const xSpacing = 25;
  const ySpacing = 25;
  const maxFieldsPerColumn = 20;
  let placedCount = 0;

  async function dragFieldToCanvas(fieldSelector, targetCanvas, offsetX, offsetY) {
    const field = page.locator(fieldSelector);
    const box = await field.boundingBox();
    const canvasBox = await targetCanvas.boundingBox();

    if (box && canvasBox) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(canvasBox.x + offsetX, canvasBox.y + offsetY, { steps: 10 });
      await page.mouse.up();
    }
  }

  // Place fields for each recipient
  for (let r = 0; r < recipients.length; r++) {
    for (const field of fields) {
      const column = Math.floor(placedCount / maxFieldsPerColumn);
      const row = placedCount % maxFieldsPerColumn;
      const offsetX = baseX + column * xSpacing;
      const offsetY = baseY + row * ySpacing;
      await dragFieldToCanvas(field, canvas, offsetX, offsetY);
      placedCount++;
      await page.waitForTimeout(150); // Small delay for UI stability
    }
  }

  // 10️⃣ Click Send
  await page.getByRole('button', { name: 'Send', exact: true }).click();

  // 11️⃣ Confirm modal
  await expect(page.locator('.modal-content')).toBeVisible();
  const rows = page.locator('.modal-content tbody tr');
  const rowCount = await rows.count();
  for (let i = 0; i < rowCount; i++) {
    const recipient = await rows.nth(i).locator('td').nth(0).textContent();
    const fieldsCount = await rows.nth(i).locator('td').nth(1).textContent();
    const signCount = await rows.nth(i).locator('td').nth(2).textContent();
    console.log(`Recipient: ${recipient}, Fields: ${fieldsCount}, Signatures: ${signCount}`);
  }

  // 12️⃣ Click Save & Sign
  await page.getByRole('button', { name: 'Save & sign' }).click();

  // 13️⃣ Handle the Loader and Cancel Button
  const loader = page.locator('#mailLoader');
  await expect(loader).toBeHidden({ timeout: 30000 });

  const btnCancel = page.getByRole('button', { name: 'Cancel' });
  if (await btnCancel.isVisible()) {
    try {
        await btnCancel.click({ timeout: 60000 });
    } catch (e) {
        await btnCancel.click({ force: true });
    }
  }

  // 14️⃣ Verify landing page
  await expect(page).toHaveURL(/.*\/inprogressdocuments/);
  console.log('✅ Multi-recipient PDF workflow finished');
});
