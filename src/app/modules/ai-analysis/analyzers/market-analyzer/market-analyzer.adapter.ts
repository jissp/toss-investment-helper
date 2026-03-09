import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';
import { GeminiCliModel } from '@modules/gemini-cli';
import { News } from '@app/modules/schemas/news';
import {
    AiAnalysisAdapterType,
    AiAnalysisQueueType,
    IBaseAnalysisAdapter,
    PromptToGeminiCliParams,
    RequestAiAnalysisTypeParam,
} from '@app/modules/ai-analysis/common';
import { MarketAnalyzerQueueType } from './market-analyzer.types';

@Injectable()
export class MarketAnalyzerAdapter implements IBaseAnalysisAdapter<
    RequestAiAnalysisTypeParam<AiAnalysisAdapterType.MARKET>
> {
    constructor(
        @InjectModel(News.name) private readonly newsModel: Model<News>,
    ) {}

    async execute(
        params: RequestAiAnalysisTypeParam<AiAnalysisAdapterType.MARKET>,
    ): Promise<FlowChildJob> {
        // 1. 데이터 조회 (필요 시)
        await this.init(params);

        // 2. 시장 분석 요청 (Gemini 프롬프트로만 처리)
        const childrenJobs = [
            {
                name: 'AnalyzeMarketTrend',
                queueName: AiAnalysisQueueType.PromptToGeminiCli,
                data: {
                    prompt: '',
                    model: GeminiCliModel.Gemini3Flash,
                } as PromptToGeminiCliParams,
            },
            {
                name: 'GenerateMarketReport',
                queueName: AiAnalysisQueueType.PromptToGeminiCli,
                data: {
                    prompt: '',
                    model: GeminiCliModel.Gemini3Flash,
                },
            },
        ];

        return {
            name: '마켓 시장 분석',
            queueName: MarketAnalyzerQueueType.RequestMarketAnalysis,
            data: {},
            children: childrenJobs,
        };
    }

    private async init(
        params?: RequestAiAnalysisTypeParam<AiAnalysisAdapterType.MARKET>,
    ): Promise<void> {
        // Market 분석은 Gemini 프롬프트로만 처리
        // 사전 데이터 조회 불필요
    }
}
