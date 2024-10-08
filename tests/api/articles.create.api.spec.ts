import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { getAuthorizationHeaders } from '@_src/api/factories/authorization-header.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe(
  'Verify articles CREATE operations',
  { tag: ['@crud', '@article', '@api'] },
  () => {
    test(
      'should not create an article without a logged-in user',
      { tag: '@GAD-R09-01' },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 401;

        const articleData = prepareArticlePayload();

        // Act
        const response = await request.post(apiUrls.articlesUrl, {
          data: articleData,
        });

        // Assert
        expect(response.status()).toBe(expectedStatusCode);
      },
    );

    test.describe('create operations', () => {
      let headers: Headers;

      test.beforeAll('should login', async ({ request }) => {
        headers = await getAuthorizationHeaders(request);
      });

      test(
        'should create an article with logged-in user',
        { tag: '@GAD-R09-01' },
        async ({ request }) => {
          // Arrange
          const expectedStatusCode = 201;

          // Act
          const articleData = prepareArticlePayload();
          const responseArticle = await createArticleWithApi(
            request,
            headers,
            articleData,
          );

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
    });
  },
);
