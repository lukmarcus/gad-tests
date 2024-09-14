import { Page } from '@playwright/test';

export class BasePage {
  url = '';
  constructor(protected page: Page) {}

  async goto(parameters?: string): Promise<void> {
    await this.page.goto(`${this.url}${parameters ? parameters : ''}`);
    await this.page.waitForLoadState();
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForPageToLoadUrl(): Promise<void> {
    await this.page.waitForURL(this.url);
  }
}
