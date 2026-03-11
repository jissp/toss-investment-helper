import { GeminiCliModel } from '@modules/gemini-cli';
import {
    RequestMarketAnalysisRequestDto,
    RequestStockAnalysisRequestDto,
} from '@app/modules/domains/ai-analysis-domain/dto/requests';

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
    [AiAnalysisAdapterType.MARKET]: RequestMarketAnalysisRequestDto;
}

export type RequestAiAnalysisTypeParam<T extends AiAnalysisAdapterType> =
    T extends keyof RequestAiAnalysisTypeParamMap
        ? RequestAiAnalysisTypeParamMap[T]
        : never;

export type PromptToGeminiCliParams = {
    prompt: string;
    model: GeminiCliModel;
};
