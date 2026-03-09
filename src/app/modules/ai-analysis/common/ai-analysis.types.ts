import { GeminiCliModel } from '@modules/gemini-cli';
import { RequestMarketAnalysisParams } from '@app/modules/ai-analysis/analyzers/market-analyzer/market-analyzer.types';
import { RequestStockAnalysisRequestDto } from '@app/modules/domains/ai-analysis-domain/dto/requests/request-stock-analysis.request.dto';

export enum AiAnalysisQueueType {
    PromptToGeminiCli = 'prompt-to-gemini-cli',
}

/**
 * Adapter 타입
 */
export enum AiAnalysisAdapterType {
    STOCK = 'STOCK',
    MARKET = 'MARKET',
}

interface RequestAiAnalysisTypeParamMap {
    [AiAnalysisAdapterType.STOCK]: RequestStockAnalysisRequestDto;
    [AiAnalysisAdapterType.MARKET]: RequestMarketAnalysisParams;
}

export type RequestAiAnalysisTypeParam<T extends AiAnalysisAdapterType> =
    T extends keyof RequestAiAnalysisTypeParamMap
        ? RequestAiAnalysisTypeParamMap[T]
        : never;

export type PromptToGeminiCliParams = {
    prompt: string;
    model: GeminiCliModel;
};
