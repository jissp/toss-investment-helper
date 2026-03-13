import { Injectable } from '@nestjs/common';
import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';
import { GeminiCliModel } from '@modules/gemini-cli';
import {
    NaverApiClientFactory,
    NaverApiNewsItem,
} from '@modules/naver/naver-api';
import {
    StockAnalyzerTransformer,
    StockIssueTransformer,
    StockNewsAnalysisTransformer,
} from './transformers';
import {
    AiAnalysisType,
    AiReportParams,
    IBaseAnalysisAdapter,
} from '../../interfaces';
import { AiAnalysisJobFactory } from '../../ai-analysis-job.factory';

type InitResponse = {
    newsItems: NaverApiNewsItem[];
};

@Injectable()
export class StockAnalyzerAdapter implements IBaseAnalysisAdapter<AiAnalysisType.Stock> {
    constructor(
        private readonly naverApiClientFactory: NaverApiClientFactory,
        private readonly aiAnalysisJobFactory: AiAnalysisJobFactory,
    ) {}

    async execute(
        params: AiReportParams<AiAnalysisType.Stock>,
    ): Promise<FlowChildJob> {
        // 1. 데이터 조회
        const { newsItems } = await this.init(params);

        // 2. Children Job 구성
        const childrenJobs = [
            this.aiAnalysisJobFactory.createPromptJob(
                'Gemini 이슈 동향 탐색',
                new StockIssueTransformer().transform({
                    stockName: params.stockName,
                }),
            ),
            this.aiAnalysisJobFactory.createPromptJob(
                'Naver 종목 뉴스 정리',
                new StockNewsAnalysisTransformer().transform({
                    stockName: params.stockName,
                    newsItems,
                }),
                GeminiCliModel.Gemini3Flash,
            ),
        ];

        return this.aiAnalysisJobFactory.createAggregateJob(
            StockAnalyzerTransformer,
            childrenJobs,
        );
    }

    private async init(
        params: AiReportParams<AiAnalysisType.Stock>,
    ): Promise<InitResponse> {
        const newsItems = await this.getNaverNewsItems(params.stockName);

        return {
            newsItems,
        };
    }

    /**
     * @param stockName
     * @private
     */
    private async getNaverNewsItems(
        stockName: string,
    ): Promise<NaverApiNewsItem[]> {
        const naverApiClient = this.naverApiClientFactory.create();
        const { items: newsItems } = await naverApiClient.getNews({
            query: stockName,
            start: 1,
            display: 80,
            sort: 'date',
        });

        return newsItems;
    }
}
