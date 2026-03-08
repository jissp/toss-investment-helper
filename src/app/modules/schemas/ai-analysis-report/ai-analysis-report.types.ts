import { AiAnalysisReport } from './schemas/ai-analysis-report.schema';

export enum ReportType {
    Stock = 'stock',
    Market = 'market',
    ExhaustionTrace = 'exhaustionTrace',
}

export type AiAnalysisReportDto = Omit<AiAnalysisReport, '_id' | 'createdAt'>;
