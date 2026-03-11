import { Inject, Injectable } from '@nestjs/common';
import { FlowProducer } from 'bullmq';
import { getFlowProducerToken } from '@nestjs/bullmq';
import { ReportType } from '@app/modules/schemas/ai-analysis-report';
import {
    RequestMarketAnalysisRequestDto,
    RequestStockAnalysisRequestDto,
} from '@app/modules/domains/ai-analysis-domain';
import { AiAnalysisAdapterType } from './common';
import {
    AiAnalysisFlowType,
    RequestAnalysisFlowPayload,
} from './ai-analysis.types';
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
            data: {
                reportType: ReportType.Stock,
                reportTarget: params.stockSymbol,
                title: `${params.stockName} 종목 분석`,
            } as RequestAnalysisFlowPayload,
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
        params: RequestMarketAnalysisRequestDto,
    ): Promise<void> {
        const adapter = this.adapterFactory.getAdapter(
            AiAnalysisAdapterType.MARKET,
        );
        const childrenJobs = await adapter.execute(params);

        // Flow Job에 Children Job 등록
        await this.requestAnalysisFlowProducer.add({
            name: 'AI 분석 요청',
            queueName: AiAnalysisFlowType.RequestAnalysis,
            data: {
                reportType: ReportType.Market,
                reportTarget: params.marketType,
                title: `${params.marketType} 시장 분석`,
            } as RequestAnalysisFlowPayload,
            children: [childrenJobs],
        });
    }
}
