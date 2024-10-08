import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthorizationHeaders as getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe(
  'Verify comments CREATE operations',
  { tag: ['@crud', '@comment', '@api'] },
  () => {
    let articleId: number;
    let headers: Headers;

    test.beforeAll('create an article', async ({ request }) => {
      headers = await getAuthorizationHeader(request);

      const responseArticle = await createArticleWithApi(request, headers);

      const responseArticleJson = await responseArticle.json();
      articleId = responseArticleJson.id;
    });

    test(
      'should not create a comment without a logged-in user',
      { tag: '@GAD-R09-02' },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 401;
        const commentData = prepareCommentPayload(articleId);

        // Act
        const response = await request.post(apiUrls.commentsUrl, {
          data: commentData,
        });

        // Assert
        expect(response.status()).toBe(expectedStatusCode);
      },
    );

    test(
      'should create a comment with logged-in user',
      { tag: '@GAD-R09-02' },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 201;
        const commentData = prepareCommentPayload(articleId);

        // Act
        const responseComment = await createCommentWithApi(
          request,
          headers,
          commentData,
        );

        // Assert
        const actualResponseStatus = responseComment.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode} and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        const comment = await responseComment.json();
        expect.soft(comment.body).toEqual(commentData.body);
      },
    );
  },
);
