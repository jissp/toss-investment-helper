import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { FavoriteStockModule } from '@app/modules/schemas/favorite-stock';
import { AiAnalysisService } from './ai-analysis.service';
import { AiAnalysisAdapterFactory } from './ai-analysis-adapter.factory';
import { MarketAnalysisAdapter, StockAnalysisAdapter } from './adapters';
import { AiAnalysisFlowType, AiAnalysisQueueType } from './ai-analysis.types';

const flowTypes = [
    AiAnalysisFlowType.RequestStockAnalysis,
    AiAnalysisFlowType.RequestMarketAnalysis,
];

const queueTypes = [AiAnalysisQueueType.PromptToGeminiCli];

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
            queueTypes,
        }),
        // Schema Modules
        FavoriteStockModule, // 종목 분석 데이터 조회
        // Market 분석은 Gemini 프롬프트로만 처리 (별도 Schema 불필요)
    ],
    providers: [
        AiAnalysisService,
        AiAnalysisAdapterFactory,
        // Individual Adapters
        StockAnalysisAdapter,
        MarketAnalysisAdapter,
    ],
    exports: [AiAnalysisService],
})
export class AiAnalysisModule {}
