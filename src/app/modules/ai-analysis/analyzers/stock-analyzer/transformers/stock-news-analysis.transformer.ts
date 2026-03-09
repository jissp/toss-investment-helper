import { Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import { replaceTemplate } from '@app/modules/ai-analysis';
import { STOCK_NEWS_ANALYSIS_PROMPT_TEMPLATE } from '../prompts';
import { NaverApiNewsItem } from '@modules/naver/naver-api';

type Args = {
    stockName: string;
    newsItems: NaverApiNewsItem[];
};

@Injectable()
export class StockNewsAnalysisTransformer implements Pipe<Args, string> {
    transform({ stockName, newsItems }: Args): string {
        const currentDate = new Date();

        return replaceTemplate(STOCK_NEWS_ANALYSIS_PROMPT_TEMPLATE, {
            currentDate: currentDate.toISOString(),
            stockName,
            naverNewsInfo: this.transformByNewsItems(newsItems),
        });
    }

    /**
     * 네이버 뉴스 정보를 제공 데이터로 가공합니다.
     * @param newsItems
     * @private
     */
    private transformByNewsItems(newsItems: NaverApiNewsItem[]) {
        const transformedNewsItems = newsItems.map(
            ({ title, description }) =>
                `- **제목**: ${title} \n**내용**: ${description}`,
        );

        return transformedNewsItems.join('\n');
    }
}
