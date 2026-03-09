export enum MarketAnalyzerQueueType {
    RequestMarketAnalysis = 'request-market-analysis',
}

export interface RequestMarketAnalysisParams {
    marketType: 'DOMESTIC' | 'OVERSEAS';
}
