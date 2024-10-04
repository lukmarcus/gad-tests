import { prepareRandomArticle } from '@_src/factories/article.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import { getAuthorizationHeaders } from '@_src/utils/api.util';

test.describe(
  'Verify articles CRUD operations',
  { tag: ['@GAD-R09-01', '@crud'] },
  () => {
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

    test('should create an article with logged-in user', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 201;
      const headers = await getAuthorizationHeaders(request);

      // Act

      const articlesUrl = '/api/articles';

      const randomArticleData = prepareRandomArticle();

      const articleData = {
        title: randomArticleData.title,
        body: randomArticleData.body,
        date: '2024-10-02T11:11:11Z',
        image:
          '.\\data\\images\\256\\tester-app_9f26eff6-2390-4460-8829-81a9cbe21751.jpg',
      };

      const responseArticle = await request.post(articlesUrl, {
        headers,
        data: articleData,
      });

      // Assert
      const actualResponseStatus = responseArticle.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode} and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const article = await responseArticle.json();
      expect.soft(article.title).toEqual(articleData.title);
      expect.soft(article.body).toEqual(articleData.body);
    });
  },
);
