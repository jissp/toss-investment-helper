import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueModule } from '@modules/queue';
import { GeminiCliModule } from '@modules/gemini-cli';
import { BotName, SlackModule } from '@modules/slack';
import { MarketAnalyzerQueueType } from './market-analyzer.types';
import { RequestMarketAnalysisProcessor } from './processors';
import {
    GlobalCommodityTransformer,
    GlobalIndexTransformer,
} from './transformers';
import { MarketAnalyzerAdapter } from './market-analyzer.adapter';

const queueTypes = [MarketAnalyzerQueueType.RequestMarketAnalysis];
const processors = [RequestMarketAnalysisProcessor];
const transformers = [GlobalIndexTransformer, GlobalCommodityTransformer];

@Module({
    imports: [
        QueueModule.forFeature({
            queueTypes,
        }),
        GeminiCliModule,
        SlackModule.forFeature(BotName.StockBot, {
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                configService.get<string>('slack.channel.geminiLog'),
        }),
    ],
    providers: [...processors, ...transformers, MarketAnalyzerAdapter],
    exports: [MarketAnalyzerAdapter],
})
export class MarketAnalyzerModule {}
