import { Injectable } from '@nestjs/common';
import {
    AiAnalysisAdapterType,
    IBaseAnalysisAdapter,
} from './ai-analysis.types';
import { MarketAnalysisAdapter, StockAnalysisAdapter } from './adapters';

@Injectable()
export class AiAnalysisAdapterFactory {
    private readonly adapterMap: Record<
        AiAnalysisAdapterType,
        IBaseAnalysisAdapter
    >;

    constructor(
        stockAnalysisAdapter: StockAnalysisAdapter,
        marketAnalysisAdapter: MarketAnalysisAdapter,
    ) {
        this.adapterMap = {
            [AiAnalysisAdapterType.STOCK]: stockAnalysisAdapter,
            [AiAnalysisAdapterType.MARKET]: marketAnalysisAdapter,
        };
    }

    /**
     * 분석 타입에 맞는 Adapter를 반환합니다.
     * 이미 생성된 provider 인스턴스를 그대로 반환합니다.
     */
    getAdapter(type: AiAnalysisAdapterType): IBaseAnalysisAdapter {
        const adapter = this.adapterMap[type];
        if (!adapter) {
            throw new Error(`Unknown adapter type: ${type}`);
        }
        return adapter;
    }
}
