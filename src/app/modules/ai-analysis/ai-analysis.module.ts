import { DynamicModule, Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { GeminiCliModule } from '@modules/gemini-cli';
import { BotName, SlackModule } from '@modules/slack';
import { NaverApiModule } from '@modules/naver/naver-api';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AiAnalysisReportModule } from '@app/modules/schemas/ai-analysis-report';
import { NewsModule } from '@app/modules/schemas/news';
import { AiAnalysisFlowType, AiAnalysisQueueType } from './interfaces';
import {
    PromptToGeminiCliProcessor,
    RequestAnalysisAggregateProcessor,
    RequestAnalysisFlowProcessor,
} from './processors';
import { LatestNewsAnalyzerAdapter, StockAnalyzerAdapter } from './analyzer';
import { AiAnalysisJobFactory } from './ai-analysis-job.factory';
import { AiAnalysisAdapterFactory } from './ai-analysis-adapter.factory';
import { AiAnalysisService } from './ai-analysis.service';

const flowTypes = [AiAnalysisFlowType.RequestAnalysis];
const queueTypes = [
    AiAnalysisQueueType.RequestAnalysisAggregate,
    AiAnalysisQueueType.PromptToGeminiCli,
];
const processors = [
    RequestAnalysisFlowProcessor,
    RequestAnalysisAggregateProcessor,
    PromptToGeminiCliProcessor,
];
const adapters = [LatestNewsAnalyzerAdapter, StockAnalyzerAdapter];

@Module({})
export class AiAnalysisModule {
    public static forRoot(): DynamicModule {
        return {
            global: true,
            module: AiAnalysisModule,
            imports: [
                QueueModule.forFeature({
                    flowTypes,
                    queueTypes,
                }),
                GeminiCliModule,
                SlackModule.forFeature(BotName.StockBot, {
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) =>
                        configService.get<string>('slack.channel.geminiLog'),
                }),
                NaverApiModule,
                AiAnalysisReportModule,
                NewsModule,
            ],
            providers: [
                ...processors,
                ...adapters,
                AiAnalysisAdapterFactory,
                AiAnalysisJobFactory,
            ],
            exports: [AiAnalysisAdapterFactory],
        };
    }

    public static forFeature(): DynamicModule {
        return {
            module: AiAnalysisModule,
            imports: [
                QueueModule.forFeature({
                    flowTypes,
                    queueTypes,
                }),
            ],
            providers: [AiAnalysisService],
            exports: [AiAnalysisService],
        };
    }
}
