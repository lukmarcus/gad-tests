import { Page } from '@playwright/test';

export class CommentsPage {
  url = '/comments.html';
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState();
  }

  async title(): Promise<string> {
    return await this.page.title();
  }
}
