export enum NewsCrawlerProvider {
    StrategyMap = 'StrategyMap',
}

export enum NewsCrawlerQueueType {
    RequestCrawlingNews = 'request-crawling-news',
}

export enum NewsStrategy {
    Naver = 'Naver',
    Google = 'Google',
}

export interface NewsStrategyPayloadMap {
    [NewsStrategy.Naver]: void;
    [NewsStrategy.Google]: void;
}

export type BaseStrategyPayload<T extends NewsStrategy> =
    T extends keyof NewsStrategyPayloadMap ? NewsStrategyPayloadMap[T] : void;

export interface RequestCrawlingNewsJobPayload<T extends NewsStrategy> {
    strategy: T;
    payload: BaseStrategyPayload<T>;
}
