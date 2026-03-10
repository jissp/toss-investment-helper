import {
    GetIndicesResponse,
    IndexCode,
    IndicesData,
    NewWatchResponse,
    StockInfo,
    TossWtsResponse,
    TradingTrendResponse,
} from '@app/common/interfaces/toss';
import { Config } from '@extension/src/common/config';

export class TossWtsApiService {
    private readonly certHost: string;
    private readonly infoHost: string;

    constructor() {
        const { certHost, infoHost } = Config.toss.wts;

        this.certHost = certHost;
        this.infoHost = infoHost;
    }

    private async fetch<R = unknown, Body = void>(
        method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
        url: string,
        body?: Body,
    ): Promise<TossWtsResponse<R>> {
        const response = await fetch(url, {
            method,
            credentials: 'include',
            body: body ? JSON.stringify(body) : undefined,
        });

        const json = await response.json();

        return json as TossWtsResponse<R>;
    }

    /**
     * 관심 종목과 최근 조회 종목 리스트를 조회
     */
    public async getWatchLists<R = NewWatchResponse>(): Promise<
        TossWtsResponse<R>
    > {
        return this.fetch<R>(
            'GET',
            `${this.certHost}/api/v1/new-watchlists?includePrice=true&lazyLoad=false`,
        );
    }

    /**
     * 종목 정보 조회
     * @param stockCode
     */
    public async getStockInfo<R = StockInfo>(
        stockCode: string,
    ): Promise<TossWtsResponse<R>> {
        return this.fetch<R>(
            'GET',
            `${this.infoHost}/api/v2/stock-infos/${stockCode}`,
        );
    }

    /**
     * 투자자 동향 조회
     * @param stockCode
     */
    public async getTradingTrend<R = TradingTrendResponse>(
        stockCode: string,
    ): Promise<TossWtsResponse<R>> {
        return this.fetch<R>(
            'GET',
            `${this.infoHost}/api/v1/stock-infos/trade/trend/trading-trend?productCode=${stockCode}&size=60`,
        );
    }

    /**
     * 뉴스 조회
     * @param stockSymbol
     */
    public async getStockNews<R = TradingTrendResponse>(
        stockSymbol: string,
    ): Promise<TossWtsResponse<R>> {
        return this.fetch<R>(
            'GET',
            `${this.infoHost}/api/v2/news/companies/${stockSymbol}?size=20&orderBy=latest`,
        );
    }

    /**
     * 시장 동향 조회
     */
    public async getIndices<R = GetIndicesResponse>(): Promise<
        TossWtsResponse<R>
    > {
        return this.fetch<R>(
            'GET',
            `${this.certHost}/api/v3/dashboard/wts/overview/indicator/mini-chart`,
        );
    }

    /**
     * 지수 정보 조회
     * @param indexCode
     */
    public async getIndex<R = IndicesData>(
        indexCode: IndexCode,
    ): Promise<TossWtsResponse<R>> {
        const countryMap: Record<IndexCode, 'kr-s' | 'us-s' | undefined> = {
            [IndexCode['코스피']]: 'kr-s',
            [IndexCode['코스닥']]: 'kr-s',
            [IndexCode['나스닥']]: 'us-s',
            [IndexCode['나스닥100 선물']]: 'us-s',
            [IndexCode['S&P500']]: 'us-s',
            [IndexCode['다우존스']]: 'us-s',
            [IndexCode['필라델피아 반도체']]: 'us-s',
            [IndexCode['VIX']]: 'us-s',
            [IndexCode['금']]: 'us-s',
            [IndexCode['은']]: 'us-s',
            [IndexCode['원유']]: 'us-s',
            [IndexCode['천연가스']]: 'us-s',
            [IndexCode['구리']]: 'us-s',
            [IndexCode['밀']]: 'us-s',
            [IndexCode['한국국채']]: undefined,
            [IndexCode['미국국채']]: undefined,
        };

        const country = countryMap[indexCode];

        return this.fetch<R>(
            'GET',
            `${this.infoHost}/api/v1/c-chart/${country}/${indexCode}/day:1?count=35&useAdjustedRate=true`,
        );
    }
}
