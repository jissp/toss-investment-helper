import { Module } from '@nestjs/common';
import { AiAnalysisReportModule } from '@app/modules/schemas/ai-analysis-report';
import { AiAnalysisModule } from '@app/modules/ai-analysis';
import {
    AiAnalyzerFlowType,
    AiAnalyzerQueueType,
} from '@app/modules/back-ai-analyzer/ai-analyzer.types';
import { QueueModule } from '@modules/queue';
import { AiAnalyzerService } from './ai-analyzer.service';

const flowTypes = [AiAnalyzerFlowType.RequestAiAnalysis];
const queueTypes = [AiAnalyzerQueueType.RequestAiAnalysis];

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
            queueTypes,
        }),
        AiAnalysisReportModule,
        AiAnalysisModule,
    ],
    providers: [AiAnalyzerService],
    exports: [AiAnalyzerService],
})
export class AiAnalyzerModule {}
