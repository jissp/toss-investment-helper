import { Injectable } from '@nestjs/common';
import { StockAnalyzerAdapter } from '@app/modules/ai-analysis/analyzers/stock-analyzer';
import { MarketAnalyzerAdapter } from '@app/modules/ai-analysis/analyzers/market-analyzer';
import { IBaseAnalysisAdapter } from './common';
import {
    AiAnalysisAdapterType,
    RequestAiAnalysisTypeParam,
} from './common/ai-analysis.types';

@Injectable()
export class AiAnalysisAdapterFactory {
    private readonly adapterMap: Record<
        AiAnalysisAdapterType,
        IBaseAnalysisAdapter
    >;

    constructor(
        stockAnalysisAdapter: StockAnalyzerAdapter,
        marketAnalysisAdapter: MarketAnalyzerAdapter,
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
    getAdapter<T extends AiAnalysisAdapterType>(
        type: T,
    ): IBaseAnalysisAdapter<RequestAiAnalysisTypeParam<T>> {
        const adapter = this.adapterMap[type];
        if (!adapter) {
            throw new Error(`Unknown adapter type: ${type}`);
        }
        return adapter as IBaseAnalysisAdapter<RequestAiAnalysisTypeParam<T>>;
    }
}
