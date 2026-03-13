import { Module } from '@nestjs/common';
import { QueueModule } from '@modules/queue';
import { NaverApiModule } from '@modules/naver/naver-api';
import { GoogleRssModule } from '@modules/google-rss';
import { NewsModule } from '@app/modules/schemas/news';
import { FavoriteStockModule } from '@app/modules/schemas/favorite-stock';
import {
    NewsCrawlerProvider,
    NewsCrawlerQueueType,
    NewsStrategy,
} from './news-crawler.types';
import {
    BaseStrategy,
    GoogleBusinessStrategy,
    NaverStrategy,
} from './strategies';
import { NewsCrawlerFactory } from './news-crawler.factory';
import { NewsCrawlerProcessor } from './news-crawler.processor';
import { NewsCrawlerSchedule } from './news-crawler.schedule';

const flowTypes = [NewsCrawlerQueueType.RequestCrawlingNews];
const flowProviders = QueueModule.getFlowProviders(flowTypes);
const strategies = [NaverStrategy, GoogleBusinessStrategy];

@Module({
    imports: [
        QueueModule.forFeature({
            flowTypes,
            jobOptions: {
                removeOnComplete: true,
                removeOnFail: true,
            },
        }),
        NaverApiModule,
        GoogleRssModule,
        FavoriteStockModule,
        NewsModule,
    ],
    providers: [
        ...flowProviders,
        ...strategies,
        {
            provide: NewsCrawlerProvider.StrategyMap,
            inject: [NaverStrategy, GoogleBusinessStrategy],
            useFactory: (
                naverStrategy: NaverStrategy,
                googleBusinessStrategy: GoogleBusinessStrategy,
            ) => {
                const map = new Map<
                    NewsStrategy,
                    BaseStrategy<NewsStrategy, unknown>
                >();

                map.set(NewsStrategy.Naver, naverStrategy);
                map.set(NewsStrategy.Google, googleBusinessStrategy);

                return map;
            },
        },
        NewsCrawlerFactory,
        NewsCrawlerProcessor,
        NewsCrawlerSchedule,
    ],
})
export class NewsCrawlerModule {}
