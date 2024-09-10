import { LoginPage } from '../../src/pages/login.page';
import { WelcomePage } from '../../src/pages/welcome.page';
import { testUser1 } from '../../src/test-data/user.data';
import { expect, test as setup } from '@playwright/test';

setup('login with correct credentials', async ({ page }) => {
  // Arrange
  const expectedLoginTitle = 'Welcome';
  const loginPage = new LoginPage(page);
  const welcomePage = new WelcomePage(page);

  // Act
  await loginPage.goto();
  await loginPage.login(testUser1);

  const title = await welcomePage.getTitle();

  // Assert
  // eslint-disable-next-line playwright/no-standalone-expect
  expect(title).toContain(expectedLoginTitle);
});
