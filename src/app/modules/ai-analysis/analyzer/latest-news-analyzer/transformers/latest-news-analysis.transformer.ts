import { Pipe } from '@common/types';
import { News } from '@app/modules/schemas/news';
import { formatNewsItems, replaceTemplate } from '../../../common';
import { LATEST_NEWS_ANALYZER_PROMPT_TEMPLATE } from '../prompts';

type TransformerArgs = {
    newsItems: News[];
};

export class LatestNewsAnalysisTransformer implements Pipe<
    TransformerArgs,
    string
> {
    /**
     * @param newsItems
     */
    transform({ newsItems }: TransformerArgs): string {
        return replaceTemplate(LATEST_NEWS_ANALYZER_PROMPT_TEMPLATE, {
            currentDate: new Date().toISOString(),
            newsItemsPrompt: formatNewsItems(newsItems),
        });
    }

    private transformForNewsItems(newsItems: News[]): string {
        const indexPrompts = newsItems.map(
            ({ title, description }) => `- ${title}\n${description}`,
        );

        return indexPrompts.join('\n');
    }
}
