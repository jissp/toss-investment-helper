import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { GeminiCliModel, GeminiCliService } from '@modules/gemini-cli';
import {
    AiAnalysisAdapterType,
    RequestAiAnalysisTypeParam,
} from '@app/modules/ai-analysis';
import { StockAnalyzerQueueType } from '../stock-analyzer.types';
import { StockAnalyzerTransformer } from '../transformers';
import { SlackService } from '@modules/slack';

@Processor(StockAnalyzerQueueType.RequestStockAnalysis)
export class RequestStockAnalysisProcessor extends WorkerHost {
    private readonly logger = new Logger(RequestStockAnalysisProcessor.name);

    constructor(
        private readonly geminiCliService: GeminiCliService,
        private readonly slackService: SlackService,
        private readonly stockAnalyzerTransformer: StockAnalyzerTransformer,
    ) {
        super();
    }

    async process(
        job: Job<RequestAiAnalysisTypeParam<AiAnalysisAdapterType.STOCK>>,
        token?: string,
    ): Promise<any> {
        const { stockName, tradingTrends } = job.data;

        const results = await this.getChildrenValues(job);

        const prompt = this.stockAnalyzerTransformer.transform({
            resultPrompts: results,
            tradingTrends: tradingTrends,
        });
        await this.slackService.send(prompt);

        const result = await this.geminiCliService.requestPrompt(prompt, {
            model: GeminiCliModel.Gemini3Pro,
        });

        await this.slackService.send(result);

        return result;
    }

    private async getChildrenValues(job: Job) {
        const childrenValues = await job.getChildrenValues<string>();

        return Object.values(childrenValues);
    }
}
