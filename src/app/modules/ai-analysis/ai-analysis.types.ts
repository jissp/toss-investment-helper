/**
 * BullMQ Flow/Queue 정의
 */
export enum AiAnalysisFlowType {
    RequestStockAnalysis = 'request-stock-analysis',
    RequestMarketAnalysis = 'request-market-analysis',
}

export enum AiAnalysisQueueType {
    PromptToGeminiCli = 'PromptToGeminiCli',
}

/**
 * Adapter 타입
 */
export enum AiAnalysisAdapterType {
    STOCK = 'STOCK',
    MARKET = 'MARKET',
}

/**
 * BaseAnalysisAdapter 인터페이스
 */
export interface IBaseAnalysisAdapter<T = any> {
    /**
     * Children Job을 생성하고 반환합니다.
     * @param params - 동적 파라미터
     * @returns BullMQ Children Job 배열
     */
    execute(params?: T): Promise<any[]>;

    /**
     * Children 구성에 필요한 데이터를 DB에서 조회합니다.
     */
    init(): Promise<void>;
}

/**
 * Service 메서드 파라미터
 */
export interface RequestStockAnalysisParams {
    stockSymbol: string;
    [key: string]: any;
}

export interface RequestMarketAnalysisParams {
    marketType: 'DOMESTIC' | 'OVERSEAS';
    [key: string]: any;
}
