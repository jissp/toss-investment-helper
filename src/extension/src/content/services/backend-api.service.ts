import {
    ExtensionMessage,
    ExtensionMessageType,
    SendServerMessageBody,
    SendServerMessageResponse,
} from '@extension/src/common/types';
import { TossWatchList } from '@app/common/interfaces/toss/toss.interface';
import { RequestStockAnalysisRequestDto } from '@app/modules/domains/ai-analysis-domain';

export class BackendApiService {
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

    requestStockAiAnalysis(body: RequestStockAnalysisRequestDto) {
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
