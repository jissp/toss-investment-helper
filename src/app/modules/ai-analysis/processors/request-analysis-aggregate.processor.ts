import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { GeminiCliModel, GeminiCliService } from '@modules/gemini-cli';
import { SlackService } from '@modules/slack';
import {
    AiAnalysisQueueType,
    RequestAiAnalysisAggregateJobData,
} from '../interfaces';
import { AggregateTransformerFactory } from '../aggregate-transformer.factory';

@Processor(AiAnalysisQueueType.RequestAnalysisAggregate)
export class RequestAnalysisAggregateProcessor extends WorkerHost {
    constructor(
        private readonly geminiCliService: GeminiCliService,
        private readonly aggregateTransformerFactory: AggregateTransformerFactory,
        private readonly slackService: SlackService,
    ) {
        super();
    }

    async process(
        job: Job<RequestAiAnalysisAggregateJobData>,
    ): Promise<string> {
        const { transformer: transformerName, ...transformFields } = job.data;

        const transformer =
            this.aggregateTransformerFactory.getTransformer(transformerName);

        const results = await this.getChildrenValues(job);

        const result = await this.geminiCliService.requestPrompt(
            transformer.transform({
                resultPrompts: results,
                ...transformFields,
            }),
            {
                model: GeminiCliModel.Gemini3Pro,
            },
        );

        await this.slackService.send(result);

        return result;
    }

    private async getChildrenValues(job: Job) {
        const childrenValues = await job.getChildrenValues<string>();

        return Object.values(childrenValues);
    }
}
