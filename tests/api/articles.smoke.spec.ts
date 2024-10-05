import { expect, test } from '@_src/fixtures/merge.fixture';
import { apiLinks } from '@_src/utils/api.util';

test.describe(
  'Verify articles API endpoint',
  { tag: ['@GAD-R08-01', '@smoke'] },
  () => {
    test.describe('verify each condition in separate test', () => {
      test('GET articles returns status code 200', async ({ request }) => {
        // Arrange
        const expectedStatusCode = 200;

        // Act
        const response = await request.get(apiLinks.articlesUrl);

        // Assert
        expect(response.status()).toBe(expectedStatusCode);
      });

      test(
        'GET articles should return at least one article',
        { tag: '@predefined_data' },
        async ({ request }) => {
          // Arrange
          const expectedMinArticlesCount = 1;

          // Act
          const response = await request.get(apiLinks.articlesUrl);
          const responseJson = await response.json();

          // Assert
          expect(responseJson.length).toBeGreaterThanOrEqual(
            expectedMinArticlesCount,
          );
        },
      );

      test(
        'GET articles return article object',
        { tag: '@predefined_data' },
        async ({ request }) => {
          // Arrange
          const expectedRequiredFields = [
            'id',
            'user_id',
            'title',
            'body',
            'date',
            'image',
          ];

          // Act
          const response = await request.get(apiLinks.articlesUrl);
          const responseJson = await response.json();
          const article = responseJson[0];

          // Assert
          expectedRequiredFields.forEach((field) => {
            expect
              .soft(article, `Expected field ${field} should be in object`)
              .toHaveProperty(field);
          });
        },
      );
    });

    test(
      'GET articles should return an object with required fields',
      { tag: '@predefined_data' },
      async ({ request }) => {
        // Arrange
        const response = await request.get(apiLinks.articlesUrl);

        await test.step('GET articles returns status code 200', async () => {
          const expectedStatusCode = 200;

          expect(response.status()).toBe(expectedStatusCode);
        });

        const responseJson = await response.json();
        await test.step('GET articles should return at least one article', async () => {
          const expectedMinArticlesCount = 1;

          expect(responseJson.length).toBeGreaterThanOrEqual(
            expectedMinArticlesCount,
          );
        });

        const expectedRequiredFields = [
          'id',
          'user_id',
          'title',
          'body',
          'date',
          'image',
        ];
        const article = responseJson[0];

        expectedRequiredFields.forEach(async (field) => {
          await test.step(`response object contains required field: ${field}`, async () => {
            expect
              .soft(article, `Expected field ${field} should be in object`)
              .toHaveProperty(field);
          });
        });
      },
    );
  },
);
