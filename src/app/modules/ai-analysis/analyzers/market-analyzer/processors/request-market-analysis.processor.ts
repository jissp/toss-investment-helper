import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { GeminiCliModel, GeminiCliService } from '@modules/gemini-cli';
import { SlackService } from '@modules/slack';
import {
    AiAnalysisAdapterType,
    replaceTemplate,
    RequestAiAnalysisTypeParam,
} from '@app/modules/ai-analysis';
import { MarketAnalyzerQueueType } from '../market-analyzer.types';
import { MARKET_ANALYZER_PROMPT_TEMPLATE } from '@app/modules/ai-analysis/analyzers/market-analyzer/prompts';

@Processor(MarketAnalyzerQueueType.RequestMarketAnalysis)
export class RequestMarketAnalysisProcessor extends WorkerHost {
    private readonly logger = new Logger(RequestMarketAnalysisProcessor.name);

    constructor(
        private readonly geminiCliService: GeminiCliService,
        private readonly slackService: SlackService,
    ) {
        super();
    }

    async process(
        job: Job<RequestAiAnalysisTypeParam<AiAnalysisAdapterType.MARKET>>,
    ): Promise<any> {
        const results = await this.getChildrenValues(job);

        const prompt = this.buildPrompt(results);

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

    /**
     * @param mergedResultPrompts
     */
    public buildPrompt(mergedResultPrompts: string[]) {
        const currentDate = new Date();

        return replaceTemplate(MARKET_ANALYZER_PROMPT_TEMPLATE, {
            currentDate: currentDate.toISOString(),
            mergedResultPrompts: mergedResultPrompts.join('\n\n'),
        });
    }
}
