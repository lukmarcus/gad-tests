import { LoginPage } from '../src/pages/login.page';
import { RegisterPage } from '../src/pages/register.page';
import { WelcomePage } from '../src/pages/welcome.page';
import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  test(
    'register with correct data and login',
    { tag: ['@GAD-R03-01', '@GAD-R03-02', '@GAD-R03-03'] },
    async ({ page }) => {
      // Arrange
      const userFirstName = faker.person.firstName();
      const userLastName = faker.person.lastName();
      const userEmail = faker.internet.email({
        firstName: userFirstName,
        lastName: userLastName,
      });
      const userPassword = faker.internet.password();

      const registerPage = new RegisterPage(page);

      // Act
      await registerPage.goto();
      await registerPage.register(
        userFirstName,
        userLastName,
        userEmail,
        userPassword,
      );

      const expectedAlertPopupText = 'User created';

      // Assert
      await expect(registerPage.alertPopup).toHaveText(expectedAlertPopupText);
      const loginPage = new LoginPage(page);
      await loginPage.waitForPageToLoadUrl();
      const titleLogin = await loginPage.title();
      expect.soft(titleLogin).toContain('Login');

      // Assert
      await loginPage.login(userEmail, userPassword);

      const welcomePage = new WelcomePage(page);
      const titleWelcome = await welcomePage.title();
      expect(titleWelcome).toContain('Welcome');
    },
  );
});
