import { AiAnalysisReport } from './schemas/ai-analysis-report.schema';

export type AiAnalysisReportDto = Omit<AiAnalysisReport, '_id' | 'createdAt'>;
