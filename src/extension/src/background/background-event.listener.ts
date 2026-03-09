import {
    ExtensionMessage,
    ExtensionMessageType,
    SendServerMessageBody,
} from '@extension/src/common/types';
import MessageSender = chrome.runtime.MessageSender;

export class BackgroundEventListener {
    constructor(handler: chrome.events.Event<any>) {
        handler.addListener(this.handleMessage.bind(this));
    }

    /**
     * @param message
     * @private
     */
    private isBackgroundEvent(message: any): message is ExtensionMessage {
        return 'type' in message;
    }

    /**
     * @param message
     * @param sender
     * @param sendResponse
     */
    public handleMessage(
        message: unknown,
        sender: MessageSender,
        sendResponse: (response?: any) => void,
    ) {
        if (!this.isBackgroundEvent(message)) {
            return true;
        }

        switch (message.type) {
            case ExtensionMessageType.SendServerMessage:
                this.handleSendServerMessage(message, sendResponse);
                break;
        }

        return true;
    }

    /**
     * Helper 서버로 Http 요청을 보냅니다.
     * @param message
     * @param sendResponse
     * @private
     */
    private async handleSendServerMessage(
        message: ExtensionMessage,
        sendResponse: (response?: any) => void,
    ) {
        const { data } = message as ExtensionMessage<SendServerMessageBody>;
        if (!data) {
            return;
        }

        const { method, path, body } = data;

        const response = await fetch(`http://localhost:3000${path}`, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        });

        if (response) {
            sendResponse({
                ok: response.ok,
                status: response.status,
                data: await response.text(),
            });
        }
    }
}
