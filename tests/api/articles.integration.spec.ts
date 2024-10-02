import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe('Verify articles CRUD operations @api', () => {
  test('should not create an article without a logged-in user', async ({
    request,
  }) => {
    // Arrange
    const expectedStatusCode = 401;
    const articlesUrl = '/api/articles';

    const randomArticleData = prepareRandomArticle();
    const articleData = {
      title: randomArticleData.title,
      body: randomArticleData.body,
      date: '2024-10-02T11:11:11Z',
      image: '',
    };

    // Act
    const response = await request.post(articlesUrl, {
      data: articleData,
    });

    // Assert
    expect(response.status()).toBe(expectedStatusCode);
  });
});
