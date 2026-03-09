import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { GeminiCliModule } from '@modules/gemini-cli';
import { NaverApiModule } from '@modules/naver/naver-api';
import { BotName, SlackModule } from '@modules/slack';
import { FavoriteStockModule } from '@app/modules/schemas/favorite-stock';
import { RequestStockAnalysisProcessor } from './processors';
import {
    StockAnalyzerTransformer,
    StockIssueTransformer,
    StockNewsAnalysisTransformer,
} from './transformers';
import { StockAnalyzerQueueType } from './stock-analyzer.types';
import { StockAnalyzerAdapter } from './stock-analyzer.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

const queueTypes = [StockAnalyzerQueueType.RequestStockAnalysis];
const processors = [RequestStockAnalysisProcessor];
const transformers = [
    StockAnalyzerTransformer,
    StockIssueTransformer,
    StockNewsAnalysisTransformer,
];

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
        FavoriteStockModule,
        NaverApiModule,
    ],
    providers: [...processors, ...transformers, StockAnalyzerAdapter],
    exports: [StockAnalyzerAdapter],
})
export class StockAnalyzerModule {}
