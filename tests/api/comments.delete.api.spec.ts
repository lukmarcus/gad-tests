import { expectGetResponseStatus } from '@_src/api/assertions/assertions.api';
import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthorizationHeaders as getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { createCommentWithApi } from '@_src/api/factories/comment-create.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe(
  'Verify comments DELETE operations',
  { tag: ['@crud', '@commeny', '@api'] },
  () => {
    let articleId: number;
    let headers: Headers;
    let responseComment: APIResponse;

    test.beforeAll('create an article', async ({ request }) => {
      headers = await getAuthorizationHeader(request);

      const responseArticle = await createArticleWithApi(request, headers);

      const responseArticleJson = await responseArticle.json();
      articleId = responseArticleJson.id;
    });

    test.beforeEach('create a comment', async ({ request }) => {
      responseComment = await createCommentWithApi(
        request,
        headers,
        undefined,
        articleId,
      );
    });

    test(
      'should delete a comment with logged-in user',
      { tag: '@GAD-R09-04' },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 200;
        const commentJson = await responseComment.json();
        const commentId = commentJson.id;

        // Act
        const responseCommentDelete = await request.delete(
          `${apiUrls.commentsUrl}/${commentId}`,
          {
            headers,
          },
        );

        // Assert
        const actualResponseStatus = responseCommentDelete.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode} and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Assert check deleted comment
        const expectedDeletedCommentStatusCode = 404;

        await expectGetResponseStatus(
          request,
          `${apiUrls.commentsUrl}/${commentId}`,
          expectedDeletedCommentStatusCode,
          headers,
        );
      },
    );

    test(
      'should not delete a comment with non logged-in user',
      { tag: '@GAD-R09-04' },
      async ({ request }) => {
        // Arrange
        const expectedStatusCode = 401;
        const commentJson = await responseComment.json();
        const commentId = commentJson.id;

        // Act
        const responseCommentDelete = await request.delete(
          `${apiUrls.commentsUrl}/${commentId}`,
        );

        // Assert
        const actualResponseStatus = responseCommentDelete.status();
        expect(
          actualResponseStatus,
          `expect status code ${expectedStatusCode} and received ${actualResponseStatus}`,
        ).toBe(expectedStatusCode);

        // Assert check not deleted comment
        const expectedNotDeletedCommentStatusCode = 200;

        await expectGetResponseStatus(
          request,
          `${apiUrls.commentsUrl}/${commentId}`,
          expectedNotDeletedCommentStatusCode,
          headers,
        );
      },
    );
  },
);
