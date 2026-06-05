import { test } from '@playwright/test';
import { DashboardPage } from '../../pages/dashboardPage';
import { HistoryPage } from '../../pages/historyPage';
import { TrashPage } from '../../pages/trashPage';

test.describe('Document Management Actions', { tag: ['@regression'] }, () => {
  test('View document history logs and download audit certificate', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const historyPage = new HistoryPage(page);

    await dashboardPage.navigateToDashboard();
    await historyPage.navigateToInProgress();
    await historyPage.viewFirstDocumentHistory();
    await historyPage.downloadAuditReport();
  });

  test('Navigate to trash and restore a deleted document', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const trashPage = new TrashPage(page);

    await dashboardPage.navigateToDashboard();
    await trashPage.navigateToTrash();
    await trashPage.restoreFirstDocument();
  });
});
