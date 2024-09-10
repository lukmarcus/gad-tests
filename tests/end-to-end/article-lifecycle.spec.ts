import { prepareRandomArticle } from '../../src/factories/article.factory';
import { AddArticleModel } from '../../src/models/article.model';
import { ArticlePage } from '../../src/pages/article.page';
import { ArticlesPage } from '../../src/pages/articles.page';
import { AddArticleView } from '../../src/views/add-article.view';
import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete article', () => {
  let articlesPage: ArticlesPage;
  let articlePage: ArticlePage;
  let articleData: AddArticleModel;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    articlePage = new ArticlePage(page);

    await articlesPage.goto();
  });

  test(
    'create new article',
    { tag: ['@GAD-R04-01', '@logged'] },
    async ({ page }) => {
      // Arrange
      const addArticleView = new AddArticleView(page);
      articleData = prepareRandomArticle();

      // Act
      await articlesPage.addArticleButtonLogged.click();
      await expect.soft(addArticleView.addNewHeader).toBeVisible();
      await addArticleView.createArticle(articleData);

      // Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
    },
  );

  test(
    'user can access single article',
    { tag: ['@GAD-R04-03', '@logged'] },
    async () => {
      // Act
      await articlesPage.gotoArticle(articleData.title);

      // Assert
      await expect.soft(articlePage.articleTitle).toHaveText(articleData.title);
      await expect
        .soft(articlePage.articleBody)
        .toHaveText(articleData.body, { useInnerText: true });
    },
  );

  test(
    'user can delete his own article',
    { tag: ['@GAD-R04-04', '@logged'] },
    async () => {
      // Arrange
      const expectedArticlesTitle = 'Articles';
      const expectedNoResultText = 'No data';
      await articlesPage.gotoArticle(articleData.title);

      // Act
      await articlePage.deleteArticle();

      // Assert
      await articlesPage.waitForPageToLoadUrl();
      const title = await articlePage.getTitle();
      expect(title).toContain(expectedArticlesTitle);

      await articlesPage.searchArticle(articleData.title);
      await expect(articlesPage.noResultText).toHaveText(expectedNoResultText);
    },
  );
});
