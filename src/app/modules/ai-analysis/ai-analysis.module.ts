import { DynamicModule, Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { GeminiCliModule } from '@modules/gemini-cli';
import { BotName, SlackModule } from '@modules/slack';
import { MarketAnalyzerModule } from '@app/modules/ai-analysis/analyzers/market-analyzer';
import { StockAnalyzerModule } from '@app/modules/ai-analysis/analyzers/stock-analyzer';
import { AiAnalysisQueueType } from './common';
import { AiAnalysisFlowType } from './ai-analysis.types';
import {
    PromptToGeminiCliProcessor,
    RequestAnalysisFlowProcessor,
} from './processors';
import { AiAnalysisAdapterFactory } from './ai-analysis-adapter.factory';
import { AiAnalysisService } from './ai-analysis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AiAnalysisReportModule } from '@app/modules/schemas/ai-analysis-report';

const flowTypes = [AiAnalysisFlowType.RequestAnalysis];
const queueTypes = [AiAnalysisQueueType.PromptToGeminiCli];
const processors = [RequestAnalysisFlowProcessor, PromptToGeminiCliProcessor];

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
                AiAnalysisReportModule,
                MarketAnalyzerModule,
                StockAnalyzerModule,
            ],
            providers: [...processors, AiAnalysisAdapterFactory],
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
