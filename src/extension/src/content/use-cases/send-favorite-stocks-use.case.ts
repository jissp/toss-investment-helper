import { context } from '@extension/src/common/context';

export class SendFavoriteStocksUseCase {
    private buttonId: string = 'update-favorite-stock';

    private isChecking: boolean = false;

    constructor() {}

    public execute() {
        setInterval(() => {
            this.checkAndInstall();
        }, 1000);
    }

    private checkAndInstall() {
        if (this.isChecking) {
            return;
        }

        try {
            this.isChecking = true;

            if (!context.locationService.isStockOrderPage()) {
                return;
            }

            const button = this.getButtonElement();
            if (!button) {
                this.installButton();
            }
        } finally {
            this.isChecking = false;
        }
    }

    /**
     *
     */
    public installButton() {
        const wrap = this.getFavoriteTabButtonGroup();
        if (!wrap) {
            return;
        }

        const button = this.createButtonElement();

        wrap.prepend(button);
    }

    /**
     *
     */
    public createButtonElement() {
        const element = context.templateService.getTemplate(
            'src/content/templates/send-favorite-stocks.button.html',
        );
        element.addEventListener('click', () => {
            const handle = async () => {
                const response = await context.tossWtsApiClient.getWatchLists();

                await context.backendApi.putFavoriteStock(
                    response.result.watchlists,
                );
            };

            handle();
        });

        return element;
    }

    /**
     *
     */
    public getButtonElement() {
        const main = context.documentService.getMainElement();
        if (!main) {
            return null;
        }

        return main.querySelector(`[id="${this.buttonId}"]`);
    }

    /**
     *
     */
    public getFavoriteTabButtonGroup(): HTMLElement | null {
        const main = context.documentService.getMainElement();
        if (!main) {
            return null;
        }

        return (
            main.querySelector('[data-contents-code="통화_변경"]')
                ?.parentElement || null
        );
    }
}
