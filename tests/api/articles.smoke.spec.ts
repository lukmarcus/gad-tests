import { expect, test } from '@_src/fixtures/merge.fixture';

test.describe(
  'Verify articles API endpoint',
  { tag: ['@GAD-R08-01', '@api'] },
  () => {
    test('GET articles returns status code 200', async ({ request }) => {
      // Arrange
      const expectedStatusCode = 200;
      const articlesUrl = '/api/articles';

      // Act
      const response = await request.get(articlesUrl);

      // Assert
      expect(response.status()).toBe(expectedStatusCode);
    });

    test(
      'GET articles should return at least one article',
      { tag: ['@predefined_data', '@api'] },
      async ({ request }) => {
        // Arrange
        const expectedMinArticleCount = 1;
        const articlesUrl = '/api/articles';

        // Act
        const response = await request.get(articlesUrl);
        const responceJson = await response.json();

        // Assert
        expect(responceJson.length).toBeGreaterThanOrEqual(
          expectedMinArticleCount,
        );
      },
    );
  },
);
