import { ArticlePage } from '@_src/pages/article.page';
import { CommentsPage } from '@_src/pages/comments.page';
import { HomePage } from '@_src/pages/home.page';
import { Page } from '@playwright/test';

export class MainMenuComponent {
  homePageLink = this.page.getByRole('link', { name: '🦎 GAD' });
  commentsButton = this.page.getByTestId('open-comments');
  articlesButton = this.page.getByTestId('open-articles');

  constructor(private page: Page) {}

  async clickCommentsButton(): Promise<CommentsPage> {
    await this.commentsButton.click();
    return new CommentsPage(this.page);
  }

  async clickArticlesButton(): Promise<ArticlePage> {
    await this.articlesButton.click();
    return new ArticlePage(this.page);
  }

  async clickHomePageLink(): Promise<HomePage> {
    await this.homePageLink.click();
    return new HomePage(this.page);
  }
}
