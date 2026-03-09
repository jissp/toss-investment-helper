import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';
import { GeminiCliModel } from '@modules/gemini-cli';
import {
    NaverApiClientFactory,
    NaverApiNewsItem,
} from '@modules/naver/naver-api';
import { FavoriteStock } from '@app/modules/schemas/favorite-stock';
import {
    AiAnalysisAdapterType,
    AiAnalysisQueueType,
    IBaseAnalysisAdapter,
    RequestAiAnalysisTypeParam,
} from '@app/modules/ai-analysis/common';
import { StockAnalyzerQueueType } from './stock-analyzer.types';
import {
    StockIssueTransformer,
    StockNewsAnalysisTransformer,
} from './transformers';

type InitResponse = {
    newsItems: NaverApiNewsItem[];
};

@Injectable()
export class StockAnalyzerAdapter implements IBaseAnalysisAdapter<
    RequestAiAnalysisTypeParam<AiAnalysisAdapterType.STOCK>
> {
    constructor(
        private readonly stockIssueTransformer: StockIssueTransformer,
        private readonly stockNewsAnalysisTransformer: StockNewsAnalysisTransformer,
        private readonly naverApiClientFactory: NaverApiClientFactory,
        @InjectModel(FavoriteStock.name)
        private readonly favoriteStockModel: Model<FavoriteStock>,
    ) {}

    async execute(
        params: RequestAiAnalysisTypeParam<AiAnalysisAdapterType.STOCK>,
    ): Promise<FlowChildJob> {
        // 1. 데이터 조회
        const { newsItems } = await this.init(params);

        // 3. Children Job 구성
        const childrenJobs = [
            {
                name: 'Gemini 이슈 동향 탐색',
                queueName: AiAnalysisQueueType.PromptToGeminiCli,
                data: {
                    prompt: this.stockIssueTransformer.transform({
                        stockName: params.stockName,
                    }),
                    model: GeminiCliModel.Gemini3Pro,
                },
            },
            {
                name: 'Naver 종목 뉴스 정리',
                queueName: AiAnalysisQueueType.PromptToGeminiCli,
                data: {
                    prompt: this.stockNewsAnalysisTransformer.transform({
                        stockName: params.stockName,
                        newsItems,
                    }),
                    model: GeminiCliModel.Gemini3Flash,
                },
            },
        ];

        return {
            name: '마켓 시장 분석',
            queueName: StockAnalyzerQueueType.RequestStockAnalysis,
            data: params,
            children: childrenJobs,
        };
    }

    private async init(
        params: RequestAiAnalysisTypeParam<AiAnalysisAdapterType.STOCK>,
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
