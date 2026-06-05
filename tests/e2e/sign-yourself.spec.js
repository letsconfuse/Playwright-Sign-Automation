import { test, expect } from '@playwright/test';
import { DashboardPage } from '../../pages/dashboardPage';
import { SignPage } from '../../pages/signPage';
import { EditorPage } from '../../pages/editorPage';

test('Sign Yourself flow with PDF upload and multi-field placement', { tag: ['@regression'] }, async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  const signPage = new SignPage(page);
  const editorPage = new EditorPage(page);

  // 1️⃣ Navigate to Dashboard
  await dashboardPage.navigateToDashboard();

  // 2️⃣ Go to "Sign" page
  await dashboardPage.navigateToSignPage();

  // 3️⃣ Click "Sign Yourself"
  await signPage.clickSignYourself();

  // 4️⃣ Upload PDF using relative path
  await signPage.uploadDocument('Dummy File.pdf');

  // 5️⃣ Fill document name
  await signPage.fillDocumentDetails('Test Document');

  // 6️⃣ Click Continue
  await signPage.clickContinue();

  // 7️⃣ Wait for draggable fields and canvas
  await editorPage.waitForCanvas();

  // 8️⃣ Place fields (Sign Yourself is placing fields for yourself, equivalent to 1 recipient)
  const fields = [
    '#signField',
    '#fullNameField',
    '#dateField',
    '#textField',
    '#checkboxField'
  ];
  await editorPage.placeFieldsForRecipients([{ name: 'Self', email: '' }], fields);

  // 9️⃣ Finalize: click Finish
  await editorPage.clickFinish();

  // 🔟 Click Cancel to close modal or return
  await expect(editorPage.cancelBtn).toBeVisible();
  await editorPage.cancelBtn.click();

  // 11️⃣ Verify we are back on the Sign page
  await editorPage.verifyLandingPage(/.*\/sign/);
  console.log('✅ PDF workflow finished, Cancel clicked, back on Sign page');
});
