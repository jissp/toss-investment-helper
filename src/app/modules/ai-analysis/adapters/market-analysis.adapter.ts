import { Injectable } from '@nestjs/common';
import { BaseAnalysisAdapter } from './base-analysis.adapter';
import {
    AiAnalysisQueueType,
    RequestMarketAnalysisParams,
} from '../ai-analysis.types';

@Injectable()
export class MarketAnalysisAdapter extends BaseAnalysisAdapter<RequestMarketAnalysisParams> {
    constructor() {
        super();
    }

    async execute(params: RequestMarketAnalysisParams): Promise<any[]> {
        // 1. 데이터 조회 (필요 시)
        await this.init();

        // 2. 시장 분석 요청 (Gemini 프롬프트로만 처리)
        const childrenJobs = [
            {
                name: 'AnalyzeMarketTrend',
                queueName: AiAnalysisQueueType.PromptToGeminiCli,
                data: { ...params, marketType: params.marketType },
            },
            {
                name: 'GenerateMarketReport',
                queueName: AiAnalysisQueueType.PromptToGeminiCli,
                data: { marketType: params.marketType },
            },
        ];

        return childrenJobs;
    }

    async init(): Promise<void> {
        // Market 분석은 Gemini 프롬프트로만 처리
        // 사전 데이터 조회 불필요
    }
}
