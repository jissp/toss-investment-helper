import { Config } from '@extension/src/common/config';
import {
    GetIndicesResponse,
    IndicesData,
    NewWatchResponse,
    StockInfo,
    TossWtsResponse,
    TradingTrendResponse,
} from '@app/common/interfaces/toss/toss.interface';
import { IndexCode } from '@app/common/interfaces/toss/toss.types';

export class TossWtsApiService {
    private readonly certHost: string;
    private readonly infoHost: string;

    constructor() {
        const { certHost, infoHost } = Config.toss.wts;

        this.certHost = certHost;
        this.infoHost = infoHost;
    }

    public async getWatchLists<
        R = TossWtsResponse<NewWatchResponse>,
    >(): Promise<R> {
        const response = await fetch(
            `${this.certHost}/api/v1/new-watchlists?includePrice=true&lazyLoad=false`,
            {
                method: 'GET',
                credentials: 'include',
            },
        );

        const json = await response.json();

        return json as R;
    }

    /**
     * 종목 정보 조회
     * @param stockCode
     */
    public async getStockInfo<R = TossWtsResponse<StockInfo>>(
        stockCode: string,
    ): Promise<R> {
        const response = await fetch(
            `${this.infoHost}/api/v2/stock-infos/${stockCode}`,
            {
                method: 'GET',
                credentials: 'include',
            },
        );

        const json = await response.json();

        return json as R;
    }

    /**
     * 투자자 동향 조회
     * @param stockCode
     */
    public async getTradingTrend<R = TossWtsResponse<TradingTrendResponse>>(
        stockCode: string,
    ): Promise<R> {
        const response = await fetch(
            `${this.infoHost}/api/v1/stock-infos/trade/trend/trading-trend?productCode=${stockCode}&size=60`,
            {
                method: 'GET',
                credentials: 'include',
            },
        );

        const json = await response.json();

        return json as R;
    }

    public async getIndices<
        R = TossWtsResponse<GetIndicesResponse>,
    >(): Promise<R> {
        const response = await fetch(
            `${this.certHost}/api/v3/dashboard/wts/overview/indicator/mini-chart`,
            {
                method: 'GET',
                credentials: 'include',
            },
        );

        const json = await response.json();

        return json as R;
    }

    /**
     * 지수 정보를 조회한다.
     * @param indexCode
     */
    public async getIndex<R = TossWtsResponse<IndicesData>>(
        indexCode: IndexCode,
    ): Promise<R> {
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

        const response = await fetch(
            `${this.infoHost}/api/v1/c-chart/${country}/${indexCode}/day:1?count=35&useAdjustedRate=true`,
            {
                method: 'GET',
                credentials: 'include',
            },
        );

        const json = await response.json();

        return json as R;
    }
}
