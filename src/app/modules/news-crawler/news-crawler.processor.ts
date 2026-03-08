import { Job } from 'bullmq';
import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OnQueueProcessor } from '@modules/queue';
import { News } from '@app/modules/schemas/news';
import {
    NewsCrawlerQueueType,
    NewsStrategy,
    RequestCrawlingNewsJobPayload,
} from './news-crawler.types';
import { NewsCrawlerFactory } from './news-crawler.factory';

@Injectable()
export class NewsCrawlerProcessor {
    private readonly logger = new Logger(NewsCrawlerProcessor.name);

    constructor(
        private readonly factory: NewsCrawlerFactory,
        @InjectModel(News.name)
        private readonly newsModel: Model<News>,
    ) {}

    @OnQueueProcessor(NewsCrawlerQueueType.RequestCrawlingNews)
    public async processNewsCrawling(
        job: Job<RequestCrawlingNewsJobPayload<NewsStrategy>>,
    ) {
        const newStrategy = this.factory.create(job);

        const dtoList = await newStrategy.run(job);
        if (!dtoList.length) {
            return;
        }

        // 배치 처리
        for (const dto of dtoList) {
            await this.newsModel.findOneAndUpdate(
                {
                    articleId: dto.articleId,
                },
                {
                    $set: dto,
                },
                {
                    upsert: true,
                },
            );
        }
        // for (const batch of chunk(dtoList, 50)) {
        //     try {
        //         await this.upsertBulkNews(batch);
        //     } catch (error) {
        //         this.logger.error(error);
        //     }
        // }
    }
}
