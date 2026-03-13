import { BadRequestException, Injectable } from '@nestjs/common';
import type { AiAnalysisAdapterMap } from './interfaces';
import { AiAnalysisType, IBaseAnalysisAdapter } from './interfaces';
import { LatestNewsAnalyzerAdapter, StockAnalyzerAdapter } from './analyzer';

@Injectable()
export class AiAnalysisAdapterFactory {
    private readonly adapterMap: AiAnalysisAdapterMap;

    constructor(
        private readonly stockAnalyzerAdapter: StockAnalyzerAdapter,
        private readonly latestNewsAnalyzer: LatestNewsAnalyzerAdapter,
    ) {
        this.adapterMap = {
            [AiAnalysisType.Stock]: this.stockAnalyzerAdapter,
            [AiAnalysisType.LatestNews]: this.latestNewsAnalyzer,
        };
    }

    /**
     * 분석 타입에 맞는 Adapter를 반환합니다.
     * 이미 생성된 provider 인스턴스를 그대로 반환합니다.
     */
    getAdapter<T extends AiAnalysisType>(type: T): IBaseAnalysisAdapter<T> {
        const adapter = this.adapterMap[type];
        if (!adapter) {
            throw new BadRequestException(`Unknown adapter type: ${type}`);
        }

        return adapter;
    }
}
