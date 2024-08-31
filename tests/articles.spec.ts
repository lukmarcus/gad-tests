import { LoginPage } from '../src/pages/login.page';
import { testUser1 } from '../src/test-data/user.data';
import { expect, test } from '@playwright/test';

test.describe('Verify articles', () => {
  test('create new article', { tag: '@GAD-R04-01' }, async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUser1);

    // Enter article page
    // Click add article button
    // Create article with correct data
    // Save article
    // Check result

    // Act

    // Assert
    const title = await loginPage.title();
    expect.soft(title).toContain('Login');
  });
});
