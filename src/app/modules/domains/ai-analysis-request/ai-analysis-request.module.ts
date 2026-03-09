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
import { AiAnalysisRequestController } from './ai-analysis-request.controller';

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
    controllers: [AiAnalysisRequestController],
    providers: useCases,
    exports: useCases,
})
export class AiAnalysisRequestModule {}
