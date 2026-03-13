import { Pipe } from '@common/types';
import { NaverApiNewsItem } from '@modules/naver/naver-api';
import { formatNewsItems, replaceTemplate } from '../../../common';
import { STOCK_NEWS_ANALYSIS_PROMPT_TEMPLATE } from '../prompts';

type Args = {
    stockName: string;
    newsItems: NaverApiNewsItem[];
};

export class StockNewsAnalysisTransformer implements Pipe<Args, string> {
    transform({ stockName, newsItems }: Args): string {
        const currentDate = new Date();

        return replaceTemplate(STOCK_NEWS_ANALYSIS_PROMPT_TEMPLATE, {
            currentDate: currentDate.toISOString(),
            stockName,
            naverNewsInfo: formatNewsItems(newsItems),
        });
    }
}
