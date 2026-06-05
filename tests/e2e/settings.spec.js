import { test } from '@playwright/test';
import { DashboardPage } from '../../pages/dashboardPage';
import { SettingsPage } from '../../pages/settingsPage';

test.describe('User Profile and Settings', { tag: ['@regression'] }, () => {
  test('Upload new signature image in settings', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const settingsPage = new SettingsPage(page);

    await dashboardPage.navigateToDashboard();
    await settingsPage.navigateToSettings();
    
    // We upload the document file (or image) as a mock signature file
    await settingsPage.uploadSignature('Dummy File.pdf');
  });
});
