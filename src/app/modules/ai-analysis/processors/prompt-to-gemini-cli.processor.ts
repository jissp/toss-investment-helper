import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { GeminiCliService } from '@modules/gemini-cli';
import { SlackService } from '@modules/slack';
import {
    AiAnalysisQueueType,
    PromptToGeminiCliParams,
} from '../common/ai-analysis.types';

@Processor(AiAnalysisQueueType.PromptToGeminiCli, {
    concurrency: 2,
})
export class PromptToGeminiCliProcessor extends WorkerHost {
    private readonly logger = new Logger(PromptToGeminiCliProcessor.name);

    constructor(
        private readonly geminiCliService: GeminiCliService,
        private readonly slackService: SlackService,
    ) {
        super();
    }

    async process(job: Job<PromptToGeminiCliParams>): Promise<any> {
        try {
            const { prompt, model } = job.data;

            await this.slackService.send(prompt);

            const result = await this.geminiCliService.requestPrompt(prompt, {
                model,
            });

            await this.slackService.send(result);

            return result;
        } catch (error) {
            this.logger.error(error);
            throw error;
        } finally {
            this.logger.debug('processed');
        }
    }
}
