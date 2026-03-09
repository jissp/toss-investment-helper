import { ExtensionMessage } from '@extension/src/common/types';

export class ContentEventListener {
    constructor(handler: chrome.events.Event<any>) {
        handler.addListener(this.handleMessage.bind(this));
    }

    /**
     * @param message
     * @private
     */
    private isExtensionMessage(message: any): message is ExtensionMessage {
        return 'type' in message;
    }

    /**
     * @param message
     */
    public handleMessage(message: unknown) {
        if (!this.isExtensionMessage(message)) {
            return;
        }

        // switch (message.type) {
        //     case ExtensionMessageType.InitiateUiInjection:
        // }
    }
}
