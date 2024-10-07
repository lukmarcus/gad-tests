import { ArticlePayload } from '@_src/api/utils/api.util';
import { prepareRandomArticle } from '@_src/ui/factories/article.factory';

export function prepareArticlePayload(): ArticlePayload {
  const randomArticleData = prepareRandomArticle();

  const articleData = {
    title: randomArticleData.title,
    body: randomArticleData.body,
    date: '2024-10-02T11:11:11Z',
    image:
      '.\\data\\images\\256\\tester-app_9f26eff6-2390-4460-8829-81a9cbe21751.jpg',
  };

  return articleData;
}
