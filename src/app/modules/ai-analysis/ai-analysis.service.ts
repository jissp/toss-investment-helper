import { Inject, Injectable } from '@nestjs/common';
import { FlowProducer } from 'bullmq';
import { getFlowProducerToken } from '@nestjs/bullmq';
import {
    AiAnalysisAdapterType,
    AiAnalysisFlowType,
    AiAnalysisQueueType,
    RequestMarketAnalysisParams,
    RequestStockAnalysisParams,
} from './ai-analysis.types';
import { AiAnalysisAdapterFactory } from './ai-analysis-adapter.factory';

@Injectable()
export class AiAnalysisService {
    constructor(
        private readonly adapterFactory: AiAnalysisAdapterFactory,
        @Inject(getFlowProducerToken(AiAnalysisFlowType.RequestStockAnalysis))
        private readonly stockFlowProducer: FlowProducer,
        @Inject(getFlowProducerToken(AiAnalysisFlowType.RequestMarketAnalysis))
        private readonly marketFlowProducer: FlowProducer,
    ) {}

    /**
     * 특정 종목(stockSymbol)에 대해 AI 분석 요청을 수행합니다.
     *
     * 처리 흐름:
     * 1. AdapterFactory를 통해 STOCK Adapter 선택
     * 2. Adapter.execute()를 호출하여 BullMQ Children Job 생성
     * 3. Flow Job에 Children Job 등록
     */
    async requestStockAnalysis(
        params: RequestStockAnalysisParams,
    ): Promise<void> {
        const adapter = this.adapterFactory.getAdapter(
            AiAnalysisAdapterType.STOCK,
        );
        const childrenJobs = await adapter.execute(params);

        // Flow Job에 Children Job 등록
        await this.stockFlowProducer.add({
            name: 'RequestStockAnalysis',
            queueName: AiAnalysisQueueType.PromptToGeminiCli,
            data: { stockSymbol: params.stockSymbol },
            children: childrenJobs,
        });
    }

    /**
     * 국내/해외 시장에 대해 AI 분석 요청을 수행합니다.
     *
     * 처리 흐름:
     * 1. AdapterFactory를 통해 MARKET Adapter 선택
     * 2. Adapter.execute()를 호출하여 BullMQ Children Job 생성
     * 3. Flow Job에 Children Job 등록
     */
    async requestMarketAnalysis(
        params: RequestMarketAnalysisParams,
    ): Promise<void> {
        const adapter = this.adapterFactory.getAdapter(
            AiAnalysisAdapterType.MARKET,
        );
        const childrenJobs = await adapter.execute(params);

        // Flow Job에 Children Job 등록
        await this.marketFlowProducer.add({
            name: 'RequestMarketAnalysis',
            queueName: AiAnalysisQueueType.PromptToGeminiCli,
            data: { marketType: params.marketType },
            children: childrenJobs,
        });
    }
}
