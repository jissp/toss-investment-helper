import {
    ExtensionMessage,
    ExtensionMessageType,
    SendServerMessageBody,
    SendServerMessageResponse,
} from '@extension/src/common/types';
import { TossWatchList } from '@app/common/interfaces/toss/toss.interface';
import { RequestStockAnalysisRequestDto } from '@app/modules/domains/ai-analysis-request';

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

    requestStockAnalysis(body: RequestStockAnalysisRequestDto) {
        return this.send({
            method: 'POST',
            path: '/v1/ai-analysis-request/stock',
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
