import { createArticleWithApi } from '@_src/api/factories/article-create.api.factory';
import { getAuthorizationHeaders as getAuthorizationHeader } from '@_src/api/factories/authorization-header.api.factory';
import { prepareCommentPayload } from '@_src/api/factories/comment-payload.api.factory';
import { CommentPayload } from '@_src/api/models/comment.api.model';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { APIResponse } from '@playwright/test';

test.describe('Verify comments CRUD operations', { tag: '@crud' }, () => {
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

  test.describe('CRUD operations', () => {
    let responseComment: APIResponse;
    let commentData: CommentPayload;

    test.beforeEach('create a comment', async ({ request }) => {
      commentData = prepareCommentPayload(articleId);
      responseComment = await request.post(apiUrls.commentsUrl, {
        headers,
        data: commentData,
      });

      // assert comment exists
      const commentJson = await responseComment.json();
      const expectedStatusCode = 200;

      await expect(async () => {
        const responseCommentCreated = await request.get(
          `${apiUrls.commentsUrl}/${commentJson.id}`,
          {},
        );
        expect(
          responseCommentCreated.status(),
          `Expected status: ${expectedStatusCode} and observed: ${responseCommentCreated.status()}`,
        ).toBe(200);
      }).toPass({
        timeout: 2_000,
      });
    });

    test(
      'should create a comment with logged-in user',
      { tag: '@GAD-R09-02' },
      async () => {
        // Arrange
        const expectedStatusCode = 201;

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
        const responseCommentGet = await request.get(
          `${apiUrls.commentsUrl}/${commentId}`,
        );
        expect(
          responseCommentGet.status(),
          `expect status code ${expectedDeletedCommentStatusCode} and received ${responseCommentGet.status()}`,
        ).toBe(expectedDeletedCommentStatusCode);
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
        const responseCommentGet = await request.get(
          `${apiUrls.commentsUrl}/${commentId}`,
        );
        expect(
          responseCommentGet.status(),
          `expect status code ${expectedNotDeletedCommentStatusCode} and received ${responseCommentGet.status()}`,
        ).toBe(expectedNotDeletedCommentStatusCode);
      },
    );
  });
});
