import { FlowProducer } from 'bullmq';
import { FlowJob } from 'bullmq/dist/esm/interfaces';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PreventConcurrentExecution } from '@common/decorators';
import { getDefaultJobOptions } from '@modules/queue';
import {
    NewsCrawlerQueueType,
    NewsStrategy,
    RequestCrawlingNewsJobPayload,
} from './news-crawler.types';

@Injectable()
export class NewsCrawlerSchedule implements OnModuleInit {
    private readonly logger = new Logger(NewsCrawlerSchedule.name);

    constructor(
        @Inject(NewsCrawlerQueueType.RequestCrawlingNews)
        private readonly requestCrawlingNews: FlowProducer,
    ) {}

    onModuleInit() {
        this.handleCrawlingNews();
    }

    @Cron('*/1 * * * *')
    @PreventConcurrentExecution()
    async handleCrawlingNews() {
        const queueName = NewsCrawlerQueueType.RequestCrawlingNews;
        const jobPayloads = Object.values(NewsStrategy).map((strategy) =>
            this.generateJobPayload(strategy),
        );

        const queuesOptions = {
            [queueName]: {
                defaultJobOptions: getDefaultJobOptions(),
            },
        };

        await Promise.allSettled(
            jobPayloads.map((jobPayload) =>
                this.requestCrawlingNews.add(jobPayload, {
                    queuesOptions,
                }),
            ),
        );
    }

    /**
     * @private
     * @param strategy
     */
    private generateJobPayload<T extends NewsStrategy>(strategy: T): FlowJob {
        const queueName = NewsCrawlerQueueType.RequestCrawlingNews;

        return {
            queueName,
            name: queueName,
            data: {
                strategy,
            } as RequestCrawlingNewsJobPayload<T>,
            opts: {
                jobId: strategy,
            },
        };
    }
}
