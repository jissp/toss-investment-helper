import { chunk } from 'lodash';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { sleep, uniqueValues } from '@common/utils';
import {
    NaverApiClientFactory,
    NaverApiNewsItem,
} from '@modules/naver/naver-api';
import { NewsCategory, NewsDto } from '@app/modules/schemas/news';
import {
    NewsStrategy,
    RequestCrawlingNewsJobPayload,
} from '../news-crawler.types';
import { BaseStrategy } from './base-strategy';
import { InjectModel } from '@nestjs/mongoose';
import { FavoriteStock } from '@app/modules/schemas/favorite-stock';
import { Model } from 'mongoose';

@Injectable()
export class NaverStrategy extends BaseStrategy<
    NewsStrategy.Naver,
    NaverApiNewsItem
> {
    private readonly logger = new Logger(NaverStrategy.name);

    constructor(
        private readonly naverApiClientFactory: NaverApiClientFactory,
        @InjectModel(FavoriteStock.name)
        private readonly favoriteStockModel: Model<FavoriteStock>,
    ) {
        super();
    }

    protected async fetch(
        job: Job<RequestCrawlingNewsJobPayload<NewsStrategy.Naver>>,
    ): Promise<NaverApiNewsItem[]> {
        try {
            const favoriteStocks = await this.favoriteStockModel.find().lean();
            if (!favoriteStocks.length) {
                return [];
            }

            const keywordNames = favoriteStocks.map(
                (favoriteStock) => favoriteStock.name,
            );
            const uniqKeywordNames = uniqueValues(keywordNames);

            const newsItems: NaverApiNewsItem[] = [];
            const client = this.naverApiClientFactory.create();
            for (const keywordNameChunk of chunk(uniqKeywordNames, 6)) {
                try {
                    const response = await client.getNews({
                        query: keywordNameChunk.join(' | '),
                        start: 1,
                        display: 80,
                        sort: 'date',
                    });

                    newsItems.push(...response.items);
                } catch (error) {
                    this.logger.error(keywordNameChunk, error);
                } finally {
                    await sleep(250);
                }
            }

            return newsItems;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    public transform(value: NaverApiNewsItem): NewsDto {
        return {
            articleId: value.link,
            category: NewsCategory.Naver,
            title: value.title,
            description: value.description,
            link: value.link,
            publishedAt: new Date(value.pubDate),
        };
    }
}
