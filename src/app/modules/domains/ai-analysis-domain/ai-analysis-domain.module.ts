import { Module } from '@nestjs/common';
import { AiAnalysisReportModule } from '@app/modules/schemas/ai-analysis-report';
import { FavoriteStockModule } from '@app/modules/schemas/favorite-stock';
import { AiAnalysisModule } from '@app/modules/ai-analysis';
import {
    GetAnalysisReportUseCase,
    ListAnalysisReportsUseCase,
    RequestMarketAnalysisUseCase,
    RequestStockAnalysisUseCase,
} from './use-cases';
import { AiAnalysisDomainController } from './ai-analysis-domain.controller';

const useCases = [
    RequestStockAnalysisUseCase,
    RequestMarketAnalysisUseCase,
    GetAnalysisReportUseCase,
    ListAnalysisReportsUseCase,
];

@Module({
    imports: [
        AiAnalysisModule.forFeature(),
        AiAnalysisReportModule,
        FavoriteStockModule,
    ],
    controllers: [AiAnalysisDomainController],
    providers: useCases,
    exports: useCases,
})
export class AiAnalysisDomainModule {}
