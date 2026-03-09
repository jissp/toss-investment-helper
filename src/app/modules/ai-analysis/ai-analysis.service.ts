import { Inject, Injectable } from '@nestjs/common';
import { FlowProducer } from 'bullmq';
import { getFlowProducerToken } from '@nestjs/bullmq';
import { RequestMarketAnalysisParams } from '@app/modules/ai-analysis/analyzers/market-analyzer/market-analyzer.types';
import { RequestStockAnalysisRequestDto } from '@app/modules/domains/ai-analysis-request';
import { AiAnalysisAdapterType } from './common';
import { AiAnalysisFlowType } from './ai-analysis.types';
import { AiAnalysisAdapterFactory } from './ai-analysis-adapter.factory';

@Injectable()
export class AiAnalysisService {
    constructor(
        private readonly adapterFactory: AiAnalysisAdapterFactory,
        @Inject(getFlowProducerToken(AiAnalysisFlowType.RequestAnalysis))
        private readonly requestAnalysisFlowProducer: FlowProducer,
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
        params: RequestStockAnalysisRequestDto,
    ): Promise<void> {
        const adapter = this.adapterFactory.getAdapter(
            AiAnalysisAdapterType.STOCK,
        );
        const childrenJobs = await adapter.execute(params);

        // Flow Job에 Children Job 등록
        await this.requestAnalysisFlowProducer.add({
            name: 'AI 분석 요청',
            queueName: AiAnalysisFlowType.RequestAnalysis,
            data: params,
            children: [childrenJobs],
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
        await this.requestAnalysisFlowProducer.add({
            name: 'AI 분석 요청',
            queueName: AiAnalysisFlowType.RequestAnalysis,
            children: [childrenJobs],
        });
    }
}
