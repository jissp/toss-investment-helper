import {
    BackgroundEvent,
    BackgroundEventType,
} from '@extension/src/types/background-event.types';
import {
    DocumentService,
    LocationService,
} from '@extension/src/content/services';

export class ContentEventListener {
    private readonly documentService: DocumentService;
    private readonly locationService: LocationService;

    private isProcessingForCheckAndInstallComponentsPeriodically: boolean = false;

    constructor(handler: chrome.events.Event<any>) {
        this.documentService = new DocumentService();
        this.locationService = new LocationService();

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
    public handleMessage(message: unknown) {
        if (!this.isBackgroundEvent(message)) {
            return;
        }

        switch (message.type) {
            case BackgroundEventType.HealthCheckResponse:
                return this.install();
        }
    }

    /**
     * @private
     */
    private install() {
        try {
            setInterval(() => {
                this.checkAndInstallComponentsPeriodically();
            }, 1000);
        } catch (error) {
            console.warn(error);
        }
    }

    private checkAndInstallComponentsPeriodically() {
        if (this.isProcessingForCheckAndInstallComponentsPeriodically) {
            return;
        }

        try {
            this.isProcessingForCheckAndInstallComponentsPeriodically = true;

            if (this.locationService.isStockOrderPage()) {
                const requestStockAnalysisButton =
                    this.documentService.getRequestStockAnalysisButton();
                if (!requestStockAnalysisButton) {
                    this.documentService.installRequestStockAnalysisButton();
                }

                const updateFavoriteStockButton =
                    this.documentService.getUpdateFavoriteButton();
                if (!updateFavoriteStockButton) {
                    this.documentService.installUpdateFavoriteButton();
                }
            }
        } finally {
            this.isProcessingForCheckAndInstallComponentsPeriodically = false;
        }
    }
}
