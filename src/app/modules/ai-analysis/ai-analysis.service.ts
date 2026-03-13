import { Inject, Injectable } from '@nestjs/common';
import { FlowProducer } from 'bullmq';
import { getFlowProducerToken } from '@nestjs/bullmq';
import {
    AiAnalysisFlowType,
    AiAnalysisType,
    AiReportParams,
    AiReportPayload,
} from './interfaces';
import { AiAnalysisAdapterFactory } from './ai-analysis-adapter.factory';

@Injectable()
export class AiAnalysisService {
    constructor(
        private readonly adapterFactory: AiAnalysisAdapterFactory,
        @Inject(getFlowProducerToken(AiAnalysisFlowType.RequestAnalysis))
        private readonly requestAnalysisFlowProducer: FlowProducer,
    ) {}

    /**
     * AI 분석 리포트를 요청합니다.
     * @param params
     * @param reportPayload
     */
    async requestAiReport<T extends AiAnalysisType>({
        reportPayload,
        params,
    }: {
        reportPayload: AiReportPayload<T>;
        params: AiReportParams<T>;
    }): Promise<void> {
        const adapter = this.adapterFactory.getAdapter(
            reportPayload.reportType,
        );
        const childrenJobs = await adapter.execute(params);

        // Flow Job에 Children Job 등록
        await this.requestAnalysisFlowProducer.add({
            name: 'AI 분석 요청',
            queueName: AiAnalysisFlowType.RequestAnalysis,
            data: reportPayload,
            children: [childrenJobs],
        });
    }
}
