import { expect, test } from '@_src/fixtures/merge.fixture';
import { apiLinks } from '@_src/utils/api.util';

test.describe(
  'Verify comments API endpoint',
  { tag: ['@GAD-R08-02', '@smoke'] },
  () => {
    test.describe('verify each condition in separate test', () => {
      test('GET comments returns status code 200', async ({ request }) => {
        // Arrange
        const expectedStatusCode = 200;

        // Act
        const response = await request.get(apiLinks.commentsUrl);

        // Assert
        expect(response.status()).toBe(expectedStatusCode);
      });

      test(
        'GET comments should return at least one comment',
        { tag: '@predefined_data' },
        async ({ request }) => {
          // Arrange
          const expectedMinCommentCount = 1;

          // Act
          const response = await request.get(apiLinks.commentsUrl);
          const responseJson = await response.json();

          // Assert
          expect(responseJson.length).toBeGreaterThanOrEqual(
            expectedMinCommentCount,
          );
        },
      );

      test(
        'GET comments return comment object',
        { tag: '@predefined_data' },
        async ({ request }) => {
          // Arrange
          const expectedRequiredFields = [
            'id',
            'article_id',
            'user_id',
            'body',
            'date',
          ];

          // Act
          const response = await request.get(apiLinks.commentsUrl);
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
        const response = await request.get(apiLinks.commentsUrl);

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
