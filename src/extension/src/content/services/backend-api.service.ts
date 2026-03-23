import {
    ExtensionMessage,
    ExtensionMessageType,
    SendServerMessageBody,
    SendServerMessageResponse,
} from '@extension/src/common/types';
import { TossWatchList } from '@app/common/interfaces/toss/toss.interface';
import { RequestStockAnalysisRequestDto } from '@app/modules/domains/ai-analysis-domain/dto/requests/request-stock-analysis.request.dto';
import { RequestMarketAnalysisRequestDto } from '@app/modules/domains/ai-analysis-domain/dto/requests/request-market-analysis.request.dto';
import { AiAnalysisType } from '@app/modules/ai-analysis';

export class BackendApiService {
    private static instance: BackendApiService;

    public static getInstance() {
        if (!this.instance) {
            this.instance = new BackendApiService();
        }

        return this.instance;
    }

    sendHealthCheck() {
        return this.send({
            method: 'GET',
            path: '/health-check',
        });
    }

    putFavoriteStock(watchLists: TossWatchList[]) {
        return this.send({
            method: 'PUT',
            path: '/v1/favorite-stocks',
            body: {
                watchLists,
            },
        });
    }

    getStockAiAnalysisReport(reportType: AiAnalysisType, reportTarget: string) {
        return this.send({
            method: 'GET',
            path: `/v1/ai-analysis/reports/${reportType}/${reportTarget}`,
        });
    }

    requestStockAiAnalysisReport(body: RequestStockAnalysisRequestDto) {
        return this.send({
            method: 'POST',
            path: '/v1/ai-analysis/stock',
            body,
        });
    }

    requestStockScoreAnalysis(body: RequestStockAnalysisRequestDto) {
        return this.send({
            method: 'POST',
            path: '/v1/analysis/stock-scores',
            body,
        });
    }

    requestMarketAiAnalysis(body: RequestMarketAnalysisRequestDto) {
        return this.send({
            method: 'POST',
            path: '/v1/ai-analysis/market',
            body,
        });
    }

    requestLatestNewsAiAnalysis() {
        return this.send({
            method: 'POST',
            path: '/v1/ai-analysis/latest-news',
        });
    }

    private async send(
        message: SendServerMessageBody,
    ): Promise<SendServerMessageResponse> {
        return chrome.runtime.sendMessage<
            ExtensionMessage<SendServerMessageBody>,
            SendServerMessageResponse
        >({
            type: ExtensionMessageType.SendServerMessage,
            data: message,
        });
    }
}
