import { Module } from '@nestjs/common';
import { AiAnalyzerModule } from '@app/modules/back-ai-analyzer';
import { AiAnalysisReportModule } from '@app/modules/schemas/ai-analysis-report';
import {
    GetAnalysisReportUseCase,
    ListAnalysisReportsUseCase,
    RequestMarketAnalysisUseCase,
    RequestStockAnalysisUseCase,
} from './use-cases';
import { AiAnalysisRequestController } from './ai-analysis-request.controller';

const useCases = [
    RequestStockAnalysisUseCase,
    RequestMarketAnalysisUseCase,
    GetAnalysisReportUseCase,
    ListAnalysisReportsUseCase,
];

@Module({
    imports: [AiAnalyzerModule, AiAnalysisReportModule],
    controllers: [AiAnalysisRequestController],
    providers: useCases,
    exports: useCases,
})
export class AiAnalysisRequestModule {}
