export enum NewsCrawlerProvider {
    StrategyMap = 'StrategyMap',
}

export enum NewsCrawlerQueueType {
    RequestCrawlingNews = 'RequestCrawlingNews',
}

export enum NewsStrategy {
    Naver = 'Naver',
    StockPlus = 'StockPlus',
    GoogleBusiness = 'GoogleBusiness',
}

export interface NewsStrategyPayloadMap {
    [NewsStrategy.Naver]: void;
    [NewsStrategy.StockPlus]: void;
    [NewsStrategy.GoogleBusiness]: void;
}

export type BaseStrategyPayload<T extends NewsStrategy> =
    T extends keyof NewsStrategyPayloadMap ? NewsStrategyPayloadMap[T] : void;

export interface RequestCrawlingNewsJobPayload<T extends NewsStrategy> {
    strategy: T;
    payload: BaseStrategyPayload<T>;
}
