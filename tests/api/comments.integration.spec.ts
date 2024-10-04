import { prepareRandomComment } from '@_src/factories/comment.factory';
import { expect, test } from '@_src/fixtures/merge.fixture';
import {
  getAuthorizationHeaders as getAuthorizationHeader,
  prepareArticlePayload,
} from '@_src/utils/api.util';

test.describe(
  'Verify comments CRUD operations',
  { tag: ['@GAD-R09-02', '@crud'] },
  () => {
    let articleId: number;
    let headers: { [key: string]: string };

    test.beforeAll('create an article', async ({ request }) => {
      headers = await getAuthorizationHeader(request);

      const articlesUrl = '/api/articles';
      const articleData = prepareArticlePayload();

      const responseArticle = await request.post(articlesUrl, {
        headers,
        data: articleData,
      });

      const responseArticleJson = await responseArticle.json();
      articleId = responseArticleJson.id;

      await new Promise((resolve) => setTimeout(resolve, 5000));
    });

    test('should not create a comment without a logged-in user', async ({
      request,
    }) => {
      // Arrange
      const expectedStatusCode = 401;
      const commentsUrl = '/api/comments';

      const randomCommentData = prepareRandomComment();
      const commentData = {
        article_id: articleId,
        body: randomCommentData.body,
        date: '2024-10-02T11:11:11Z',
      };

      // Act
      const response = await request.post(commentsUrl, {
        data: commentData,
      });

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    });

    test('should create a comment with logged-in user', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 201;

      const commentsUrl = '/api/comments';

      const randomCommentData = prepareRandomComment();

      const commentData = {
        article_id: articleId,
        body: randomCommentData.body,
        date: '2024-10-02T11:11:11Z',
      };

      // Act
      const responseComment = await request.post(commentsUrl, {
        headers,
        data: commentData,
      });

      // Assert
      const actualResponseStatus = responseComment.status();
      expect(
        actualResponseStatus,
        `expect status code ${expectedStatusCode} and received ${actualResponseStatus}`,
      ).toBe(expectedStatusCode);

      const comment = await responseComment.json();
      expect.soft(comment.body).toEqual(commentData.body);
    });
  },
);
