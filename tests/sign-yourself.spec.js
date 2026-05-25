import { test, expect } from '@playwright/test';
import path from 'path';

test('Sign Yourself flow with PDF upload and multi-field placement', async ({ page }) => {
  // Use baseURL from config
  await page.goto('/dashboard');

  // Navigate to "Sign" page using a more resilient locator
  await page.getByRole('link', { name: 'Sign', exact: true }).click();
  await expect(page).toHaveURL(/.*\/sign/);

  // Click "Sign Yourself"
  await page.getByRole('button', { name: 'Sign Yourself' }).click();

  // Upload PDF using relative path
  const fileInput = page.locator('ngx-dropzone input[type="file"]');
  await expect(fileInput).toBeVisible();
  
  // path.resolve() will use the current project root, making it cross-platform
  const pdfFile = path.resolve('Dummy File.pdf');
  await fileInput.setInputFiles(pdfFile);

  // Wait for the upload processing instead of hard timeout
  await expect(page.locator('#txtDocumentName')).toBeVisible();
  await page.locator('#txtDocumentName').fill('Test Document');

  // Click Continue
  await page.locator('#btnContinue').click();

  // Wait for draggable fields and canvas
  await expect(page.locator('#signField')).toBeVisible();
  const canvas = page.locator('.upper-canvas.pdf-canvas');
  await expect(canvas).toBeVisible();

  // Define fields (using resilient locators where possible, but keeping IDs if they are stable)
  const fields = [
    '#signField',
    '#fullNameField',
    '#dateField',
    '#textField',
    '#checkboxField'
  ];

  // Placement settings
  const baseX = 100;
  const baseY = 100;
  const xSpacing = 25;
  const ySpacing = 25;
  const maxFieldsPerColumn = 20;
  let placedCount = 0;

  /**
   * Function to drag a field to the canvas
   */
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

  // Loop to place fields column-wise vertically first
  for (const fieldSelector of fields) {
    const column = Math.floor(placedCount / maxFieldsPerColumn);
    const row = placedCount % maxFieldsPerColumn;
    const offsetX = baseX + column * xSpacing;
    const offsetY = baseY + row * ySpacing;

    await dragFieldToCanvas(fieldSelector, canvas, offsetX, offsetY);
    placedCount++;
    await page.waitForTimeout(150); // Small delay for UI stability during drag-and-drop
  }

    // Finalize: click Finish
    await page.getByRole('button', { name: 'Finish' }).click();

    // Click Cancel to close modal or return
    const btnCancel = page.getByRole('button', { name: 'Cancel' });
    await expect(btnCancel).toBeVisible();
    await btnCancel.click();

    // Verify we are back on the Sign page
    await expect(page).toHaveURL(/.*\/sign/);
    console.log('✅ PDF workflow finished, Cancel clicked, back on Sign page');
});
