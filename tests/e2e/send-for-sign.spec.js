import { test } from '@playwright/test';
import { DashboardPage } from '../../pages/dashboardPage';
import { SignPage } from '../../pages/signPage';
import { EditorPage } from '../../pages/editorPage';

test('Send for Signature flow with multi-recipient PDF and field placement', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
  const dashboardPage = new DashboardPage(page);
  const signPage = new SignPage(page);
  const editorPage = new EditorPage(page);

  // 1️⃣ Navigate to Dashboard
  await dashboardPage.navigateToDashboard();

  // 2️⃣ Go to "Sign" page
  await dashboardPage.navigateToSignPage();

  // 3️⃣ Click "Send for Signature"
  await signPage.clickSendForSignature();

  // 4️⃣ Upload PDF using relative path
  await signPage.uploadDocument('Dummy File.pdf');

  // 5️⃣ Fill document details, expiry days, and note
  await signPage.fillDocumentDetails('Test Document', 5, 'Please sign this document.');

  // 6️⃣ Add recipients dynamically
  const recipients = [
    { name: 'First', email: 'aarav.kulkarni990edit@yopmail.com' }
  ];
  await signPage.addRecipients(recipients);

  // 7️⃣ Continue to field placement
  await signPage.clickContinue();
  
  // 8️⃣ Wait for draggable fields and canvas
  await editorPage.waitForCanvas();

  // 9️⃣ Place fields for each recipient
  const fields = [
    '#signField',
    '#fullNameField',
    '#dateField',
    '#textField',
    '#checkboxField'
  ];
  await editorPage.placeFieldsForRecipients(recipients, fields);

  // 10️⃣ Click Send
  await editorPage.clickSend();

  // 11️⃣ Confirm modal and print summary
  await editorPage.printRecipientModalSummary();

  // 12️⃣ Click Save & Sign
  await editorPage.confirmSaveAndSign();

  // 13️⃣ Handle the Loader and Cancel Button
  await editorPage.handlePostExecutionFlow();

  // 14️⃣ Verify landing page
  await editorPage.verifyLandingPage(/.*\/inprogressdocuments/);
  console.log('✅ Multi-recipient PDF workflow finished');
});
