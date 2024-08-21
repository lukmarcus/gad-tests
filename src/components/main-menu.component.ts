import { Page } from '@playwright/test';

export class MainMenuComponent {
  homePage = this.page.getByRole('link', { name: '🦎 GAD' });
  commentsButton = this.page.getByTestId('open-comments');
  articlesButton = this.page.getByTestId('open-articles');

  constructor(private page: Page) {}
}
