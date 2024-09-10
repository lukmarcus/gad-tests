import { prepareRandomUser } from '../../src/factories/user.factory';
import { RegisterUserModel } from '../../src/models/user.model';
import { LoginPage } from '../../src/pages/login.page';
import { RegisterPage } from '../../src/pages/register.page';
import { WelcomePage } from '../../src/pages/welcome.page';
import { expect, test } from '@playwright/test';

test.describe('Verify register', () => {
  let registerPage: RegisterPage;
  let registerUserData: RegisterUserModel;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    registerUserData = prepareRandomUser();
    await registerPage.goto();
  });

  test(
    'register with correct data and login',
    { tag: ['@GAD-R03-01', '@GAD-R03-02', '@GAD-R03-03'] },
    async ({ page }) => {
      // Arrange
      const loginPage = new LoginPage(page);
      const welcomePage = new WelcomePage(page);

      const expectedLoginTitle = 'Login';
      const expectedWelcomeTitle = 'Welcome';
      const expectedAlertPopupText = 'User created';

      // Act
      await registerPage.register(registerUserData);

      // Assert
      await expect(registerPage.alertPopup).toHaveText(expectedAlertPopupText);
      await loginPage.waitForPageToLoadUrl();
      const titleLogin = await loginPage.getTitle();
      expect.soft(titleLogin).toContain(expectedLoginTitle);

      // Assert test login
      await loginPage.login({
        userEmail: registerUserData.userEmail,
        userPassword: registerUserData.userPassword,
      });

      const titleWelcome = await welcomePage.getTitle();
      expect(titleWelcome).toContain(expectedWelcomeTitle);
    },
  );

  test(
    'not register with incorrect data - non valid e-mail',
    { tag: '@GAD-R03-04' },
    async () => {
      // Arrange
      const expectedErrorText = 'Please provide a valid email address';
      registerUserData.userEmail = '@#$';

      // Act
      await registerPage.register(registerUserData);

      // Assert
      await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
    },
  );

  test(
    'not register with incorrect data - e-mail not provided',
    { tag: '@GAD-R03-04' },
    async () => {
      // Arrange
      const expectedErrorText = 'This field is required';

      // Act
      await registerPage.userFirstNameInput.fill(
        registerUserData.userFirstName,
      );
      await registerPage.userLastNameInput.fill(registerUserData.userLastName);
      await registerPage.userPasswordInput.fill(registerUserData.userPassword);
      await registerPage.registerButton.click();

      // Assert
      await expect(registerPage.emailErrorText).toHaveText(expectedErrorText);
    },
  );
});
