import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { NewsModule } from '@app/modules/schemas/news';
import { RequestMarketAnalysisProcessor } from './processors';
import { MarketAnalyzerQueueType } from './market-analyzer.types';
import { MarketAnalyzerAdapter } from './market-analyzer.adapter';

const queueTypes = [MarketAnalyzerQueueType.RequestMarketAnalysis];
const processors = [RequestMarketAnalysisProcessor];

@Module({
    imports: [
        QueueModule.forFeature({
            queueTypes,
        }),
        NewsModule,
    ],
    providers: [...processors, MarketAnalyzerAdapter],
    exports: [MarketAnalyzerAdapter],
})
export class MarketAnalyzerModule {}
