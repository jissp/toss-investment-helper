import { Injectable } from '@nestjs/common';
import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';
import { GeminiCliModel } from '@modules/gemini-cli';
import {
    AiAnalysisAdapterType,
    AiAnalysisQueueType,
    IBaseAnalysisAdapter,
    PromptToGeminiCliParams,
    RequestAiAnalysisTypeParam,
} from '@app/modules/ai-analysis/common';
import { MarketAnalyzerQueueType } from './market-analyzer.types';
import {
    GlobalCommodityTransformer,
    GlobalIndexTransformer,
} from './transformers';

@Injectable()
export class MarketAnalyzerAdapter implements IBaseAnalysisAdapter<
    RequestAiAnalysisTypeParam<AiAnalysisAdapterType.MARKET>
> {
    constructor(
        private readonly globalIndexTransformer: GlobalIndexTransformer,
        private readonly globalCommodityTransformer: GlobalCommodityTransformer,
    ) {}

    async execute(
        params: RequestAiAnalysisTypeParam<AiAnalysisAdapterType.MARKET>,
    ): Promise<FlowChildJob> {
        // 1. 데이터 조회 (필요 시)
        await this.init(params);

        // 2. 시장 분석 요청 (Gemini 프롬프트로만 처리)
        const childrenJobs = [
            {
                name: '시장 추세 분석',
                queueName: AiAnalysisQueueType.PromptToGeminiCli,
                data: {
                    prompt: this.globalIndexTransformer.transform({
                        indices: params.indices,
                    }),
                    model: GeminiCliModel.Gemini3Pro,
                } as PromptToGeminiCliParams,
            },
            {
                name: '원자재 추세 분석',
                queueName: AiAnalysisQueueType.PromptToGeminiCli,
                data: {
                    prompt: this.globalCommodityTransformer.transform({
                        indices: params.indices,
                    }),
                    model: GeminiCliModel.Gemini3Pro,
                } as PromptToGeminiCliParams,
            },
        ];

        return {
            name: '마켓 시장 분석',
            queueName: MarketAnalyzerQueueType.RequestMarketAnalysis,
            data: params,
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
