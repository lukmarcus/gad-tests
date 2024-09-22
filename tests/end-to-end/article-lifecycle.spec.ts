import { expect, test } from '@_src/fixtures/merge.fixture';
import { AddArticleModel } from '@_src/models/article.model';

test.describe.configure({ mode: 'serial' });
test.describe('Create, verify and delete article', () => {
  let articleData: AddArticleModel;

  test(
    'create new article',
    { tag: ['@GAD-R04-01', '@logged'] },
    async ({ createRandomArticle }) => {
      // Arrange
      articleData = createRandomArticle.articleData;

      // Act
      const articlePage = createRandomArticle.articlePage;

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
    async ({ articlesPage }) => {
      // Act
      const articlePage = await articlesPage.gotoArticle(articleData.title);

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
    async ({ articlesPage }) => {
      // Arrange
      const expectedArticlesTitle = 'Articles';
      const expectedNoResultText = 'No data';
      const articlePage = await articlesPage.gotoArticle(articleData.title);

      // Act
      articlesPage = await articlePage.deleteArticle();

      // Assert
      await articlesPage.waitForPageToLoadUrl();
      const title = await articlePage.getTitle();
      expect(title).toContain(expectedArticlesTitle);

      articlesPage = await articlesPage.searchArticle(articleData.title);
      await expect(articlesPage.noResultText).toHaveText(expectedNoResultText);
    },
  );
});
