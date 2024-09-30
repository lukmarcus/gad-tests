import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe(
  'Verify comments API endpoint',
  { tag: ['@GAD-R08-02', '@api'] },
  () => {
    test.describe('verify each condition in separate test', () => {
      test('GET comments returns status code 200', async ({ request }) => {
        // Arrange
        const expectedStatusCode = 200;
        const commentsUrl = '/api/comments';

        // Act
        const response = await request.get(commentsUrl);

        // Assert
        expect(response.status()).toBe(expectedStatusCode);
      });

      test(
        'GET comments should return at least one comment',
        { tag: ['@predefined_data', '@api'] },
        async ({ request }) => {
          // Arrange
          const expectedMinCommentCount = 1;
          const commentsUrl = '/api/comments';

          // Act
          const response = await request.get(commentsUrl);
          const responseJson = await response.json();

          // Assert
          expect(responseJson.length).toBeGreaterThanOrEqual(
            expectedMinCommentCount,
          );
        },
      );

      test(
        'GET comments return comment object',
        { tag: ['@predefined_data', '@api'] },
        async ({ request }) => {
          // Arrange
          const expectedRequiredFields = [
            'id',
            'article_id',
            'user_id',
            'body',
            'date',
          ];
          const commentsUrl = '/api/comments';

          // Act
          const response = await request.get(commentsUrl);
          const responseJson = await response.json();
          const comment = responseJson[0];

          // Assert
          expectedRequiredFields.forEach((field) => {
            expect
              .soft(comment, `Expected field ${field} should be in object`)
              .toHaveProperty(field);
          });
        },
      );
    });

    test(
      'GET comments should return an object with required fields',
      { tag: '@predefined_data' },
      async ({ request }) => {
        // Arrange
        const commentsUrl = '/api/comments';
        const response = await request.get(commentsUrl);

        await test.step('GET comments returns status code 200', async () => {
          const expectedStatusCode = 200;

          expect(response.status()).toBe(expectedStatusCode);
        });

        const responseJson = await response.json();
        await test.step('GET comments should return at least one comment', async () => {
          const expectedMinCommentCount = 1;

          expect(responseJson.length).toBeGreaterThanOrEqual(
            expectedMinCommentCount,
          );
        });

        const expectedRequiredFields = [
          'id',
          'article_id',
          'user_id',
          'body',
          'date',
        ];
        const comment = responseJson[0];

        expectedRequiredFields.forEach(async (field) => {
          await test.step(`response object contains required field: ${field}`, async () => {
            expect
              .soft(comment, `Expected field ${field} should be in object`)
              .toHaveProperty(field);
          });
        });
      },
    );
  },
);
