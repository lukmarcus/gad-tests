import { prepareArticlePayload } from '@_src/api/factories/article-payload.api.factory';
import { Headers } from '@_src/api/models/headers.api.model';
import { apiUrls } from '@_src/api/utils/api.util';
import { expect } from '@_src/ui/fixtures/merge.fixture';
import { AddArticleModel } from '@_src/ui/models/article.model';
import { APIRequestContext, APIResponse } from '@playwright/test';

export async function createArticleWithApi(
  request: APIRequestContext,
  headers: Headers,
  articleData?: AddArticleModel,
): Promise<APIResponse> {
  const articleDataFinal = articleData || prepareArticlePayload();
  const responseArticle = await request.post(apiUrls.articlesUrl, {
    headers,
    data: articleDataFinal,
  });

  // assert article exists
  const articleJson = await responseArticle.json();
  const expectedStatusCode = 200;

  await expect(async () => {
    const responseArticleCreated = await request.get(
      `${apiUrls.articlesUrl}/${articleJson.id}`,
      {},
    );
    expect(
      responseArticleCreated.status(),
      `Expected status: ${expectedStatusCode} and observed: ${responseArticleCreated.status()}`,
    ).toBe(200);
  }).toPass({
    timeout: 2_000,
  });

  return responseArticle;
}
