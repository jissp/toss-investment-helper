import { ReportType } from '@app/modules/schemas/ai-analysis-report';

/**
 * BullMQ Flow/Queue 정의
 */
export enum AiAnalysisFlowType {
    RequestAnalysis = 'request-analysis',
}

export interface RequestAnalysisFlowPayload {
    reportType: ReportType;
    reportTarget: string;
    title: string;
}
