import { ApiClient } from '@extension/src/common/api';
import { BackgroundEvent, BackgroundEventType, } from '@extension/src/types/background-event.types';
import { PutFavoriteStocksRequestDto } from '@app/modules/domains/favorite-stock';
import MessageSender = chrome.runtime.MessageSender;

export class BackgroundEventListener {
    private readonly apiClient: ApiClient;

    constructor(handler: chrome.events.Event<any>) {
        this.apiClient = new ApiClient();

        handler.addListener(this.handleMessage.bind(this));
    }

    /**
     * @param message
     * @private
     */
    private isBackgroundEvent(message: any): message is BackgroundEvent {
        return 'type' in message;
    }

    /**
     * @param message
     */
    public async handleMessage(
        message: unknown,
        sender: MessageSender,
        // sendResponse: (response?: any) => void,
    ) {
        if (!this.isBackgroundEvent(message)) {
            return;
        }

        switch (message.type) {
            case BackgroundEventType.HealthCheckRequest:
                return this.handleHealthCheck(sender);
            case BackgroundEventType.UpdateFavoriteStock:
                return this.handleUpdateFavoriteStock(message);
        }
    }

    /**
     * @private
     */
    private async handleHealthCheck(sender: MessageSender) {
        try {
            await this.apiClient.healthCheck();

            if (sender.tab && sender.tab.id) {
                await chrome.tabs.sendMessage(sender.tab.id, {
                    type: BackgroundEventType.HealthCheckResponse,
                });
            }
        } catch (error) {
            console.warn(error);
        }
    }

    /**
     * @private
     */
    private async handleUpdateFavoriteStock(message: BackgroundEvent) {
        try {
            const { data } =
                message as BackgroundEvent<PutFavoriteStocksRequestDto>;
            if (!data) {
                return;
            }

            await this.apiClient.putFavoriteStocks({
                watchLists: data.watchLists,
            });

            // TODO NOTI 전송
        } catch (error) {
            console.warn(error);
        }
    }
}
