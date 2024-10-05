import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  ArticlePayload,
  Headers,
  apiLinks,
  getAuthorizationHeaders,
  prepareArticlePayload,
} from '@_src/utils/api.util';
import { APIResponse } from '@playwright/test';

test.describe('Verify articles CRUD operations', { tag: '@crud' }, () => {
  test(
    'should not create an article without a logged-in user',
    { tag: '@GAD-R09-01' },
    async ({ request }) => {
      // Arrange
      const expectedStatusCode = 401;

      const articleData = prepareArticlePayload();

      // Act
      const response = await request.post(apiLinks.articlesUrl, {
        data: articleData,
      });

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    },
  );

  test.describe('CRUD operations', () => {
    let responseArticle: APIResponse;
    let headers: Headers;
    let articleData: ArticlePayload;

    test.beforeAll('should login', async ({ request }) => {
      headers = await getAuthorizationHeaders(request);
    });

    test.beforeEach('create an article', async ({ request }) => {
      articleData = prepareArticlePayload();
      responseArticle = await request.post(apiLinks.articlesUrl, {
        headers,
        data: articleData,
      });
    });

    test(
      'should create an article with logged-in user',
      { tag: '@GAD-R09-01' },
      async () => {
        // Arrange
        const expectedStatusCode = 201;

        // Assert
        const actualResponseStatus = responseArticle.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode} and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        const articleJson = await responseArticle.json();
        expect.soft(articleJson.title).toEqual(articleData.title);
        expect.soft(articleJson.body).toEqual(articleData.body);
      },
    );

    test(
      'should delete an article with logged-in user',
      { tag: '@GAD-R09-03' },
      async ({ request }) => {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Arrange
        const expectedStatusCode = 200;
        const articleJson = await responseArticle.json();
        const articleId = articleJson.id;

        // Act
        const responseArticleDelete = await request.delete(
          `${apiLinks.articlesUrl}/${articleId}`,
          {
            headers,
          },
        );

        // Assert
        const actualResponseStatus = responseArticleDelete.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode} and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Assert check deleted article
        const expectedDeletedArticleStatusCode = 404;
        const responseArticleGet = await request.get(
          `${apiLinks.articlesUrl}/${articleId}`,
        );
        expect(
          responseArticleGet.status(),
          `expect status code ${expectedDeletedArticleStatusCode} and received ${responseArticleGet.status()}`,
        ).toBe(expectedDeletedArticleStatusCode);
      },
    );

    test(
      'should not delete an article with non logged-in user',
      { tag: '@GAD-R09-03' },
      async ({ request }) => {
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Arrange
        const expectedStatusCode = 401;
        const articleJson = await responseArticle.json();
        const articleId = articleJson.id;

        // Act
        const responseArticleDelete = await request.delete(
          `${apiLinks.articlesUrl}/${articleId}`,
        );

        // Assert
        const actualResponseStatus = responseArticleDelete.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode} and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Assert check not deleted article
        const expectedDeletedArticleStatusCode = 200;
        const responseArticleGet = await request.get(
          `${apiLinks.articlesUrl}/${articleId}`,
        );
        expect(
          responseArticleGet.status(),
          `expect status code ${expectedDeletedArticleStatusCode} and received ${responseArticleGet.status()}`,
        ).toBe(expectedDeletedArticleStatusCode);
      },
    );
  });
});
