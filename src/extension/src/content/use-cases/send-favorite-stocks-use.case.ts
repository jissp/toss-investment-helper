import { ComponentType } from '@extension/src/content';
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

            const requestStockAnalysisButton = this.getButtonElement();
            if (!requestStockAnalysisButton) {
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
        const button = context.componentFactory.create(ComponentType.Button);

        return button
            .buildId(this.buttonId)
            .buildClass(
                'tw4l-1wkoka52h tw4l-1wkoka59 tw4l-1wkoka5e tw4l-1wkoka517 tw4l-1wkoka5x tw4l-1wkoka5r tw4l-1wkoka5l tw4l-1wkoka528 tw4l-1wkoka537',
            )
            .buildText('관심 종목 전송')
            .buildOnClick(() => {
                const handle = async () => {
                    const response =
                        await context.tossWtsApiClient.getWatchLists();

                    await context.backendApi.putFavoriteStock(
                        response.result.watchlists,
                    );
                };

                handle();
            })
            .build();
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
