import { ConstructorType, Pipe } from '@common/types';
import { RequestStockAnalysisRequestDto } from '@app/modules/domains/ai-analysis-domain';
import { AiAnalysisType } from './ai-analysis.enum';
import { IBaseAnalysisAdapter } from './base-analysis-adapter.interface';

export type AiAnalysisAdapterMap = Record<
    AiAnalysisType,
    IBaseAnalysisAdapter<AiAnalysisType>
>;

interface BaseRequestAiReportPayload {
    reportType: AiAnalysisType;
    title: string;
}

export interface RequestAiReportPayload extends BaseRequestAiReportPayload {
    reportTarget: string;
}

export interface AiReportPayloadMap {
    [AiAnalysisType.LatestNews]: BaseRequestAiReportPayload;
}

export type AiReportPayload<T extends AiAnalysisType> =
    T extends keyof AiReportPayloadMap
        ? AiReportPayloadMap[T]
        : RequestAiReportPayload;

export interface AiReportParamsMap {
    [AiAnalysisType.Stock]: RequestStockAnalysisRequestDto;
}

export type AiReportParams<T extends AiAnalysisType> =
    T extends keyof AiReportParamsMap ? AiReportParamsMap[T] : undefined;

export interface RequestAiAnalysisAggregateJobData {
    [key: string]: unknown;
    transformer: string;
}
