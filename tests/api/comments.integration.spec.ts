import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  CommentPayload,
  Headers,
  apiLinks,
  getAuthorizationHeaders as getAuthorizationHeader,
  prepareArticlePayload,
  prepareCommentPayload,
} from '@_src/utils/api.util';
import { APIResponse } from '@playwright/test';

test.describe('Verify comments CRUD operations', { tag: '@crud' }, () => {
  let articleId: number;
  let headers: Headers;

  test.beforeAll('create an article', async ({ request }) => {
    headers = await getAuthorizationHeader(request);

    const articleData = prepareArticlePayload();

    const responseArticle = await request.post(apiLinks.articlesUrl, {
      headers,
      data: articleData,
    });

    const responseArticleJson = await responseArticle.json();
    articleId = responseArticleJson.id;

    // assert article exists
    const expectedStatusCode = 200;

    await expect(async () => {
      const responseArticleCreated = await request.get(
        `${apiLinks.articlesUrl}/${articleId}`,
        {},
      );
      expect(
        responseArticleCreated.status(),
        `Expected status: ${expectedStatusCode} and observed: ${responseArticleCreated.status()}`,
      ).toBe(200);
    }).toPass({
      timeout: 2_000,
    });
  });

  test(
    'should not create a comment without a logged-in user',
    { tag: '@GAD-R09-02' },
    async ({ request }) => {
      // Arrange
      const expectedStatusCode = 401;
      const commentData = prepareCommentPayload(articleId);

      // Act
      const response = await request.post(apiLinks.commentsUrl, {
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
      responseComment = await request.post(apiLinks.commentsUrl, {
        headers,
        data: commentData,
      });

      // assert comment exists
      const commentJson = await responseComment.json();
      const expectedStatusCode = 200;

      await expect(async () => {
        const responseCommentCreated = await request.get(
          `${apiLinks.commentsUrl}/${commentJson.id}`,
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
          `${apiLinks.commentsUrl}/${commentId}`,
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
          `${apiLinks.commentsUrl}/${commentId}`,
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
          `${apiLinks.commentsUrl}/${commentId}`,
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
          `${apiLinks.commentsUrl}/${commentId}`,
        );
        expect(
          responseCommentGet.status(),
          `expect status code ${expectedNotDeletedCommentStatusCode} and received ${responseCommentGet.status()}`,
        ).toBe(expectedNotDeletedCommentStatusCode);
      },
    );
  });
});
