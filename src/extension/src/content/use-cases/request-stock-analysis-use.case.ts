import { ComponentType } from '@extension/src/content';
import { context } from '@extension/src/common/context';
import { Nullable } from '@common/types';

export class RequestStockAnalysisUseCase {
    private buttonId: string = 'request-stock-analysis';
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

    public getStockUtilWrap(): Nullable<HTMLElement> {
        const main = context.documentService.getMainElement();
        if (!main) {
            return null;
        }

        const element = main.querySelector(
            '[data-parent-name="WatchActionGroupSelect"]',
        );
        if (!element || !element.parentNode) {
            return null;
        }

        return element.parentNode as HTMLElement;
    }

    /**
     *
     */
    public createButtonElement() {
        const button = context.componentFactory.create(ComponentType.Button);

        return button
            .buildId(this.buttonId)
            .buildClass('tw4l-emtxt715 tw4l-emtxt7o tw4l-emtxt7y tw4l-emtxt712')
            .buildText('📊')
            .buildOnClick(() => {
                const handle = async () => {
                    const stockCode =
                        context.locationService.extractStockCode();
                    const stockResponse =
                        await context.tossWtsApiClient.getStockInfo(stockCode);
                    const tradingTrendResponse =
                        await context.tossWtsApiClient.getTradingTrend(
                            stockCode,
                        );

                    const { symbol, name } = stockResponse.result;

                    await context.backendApi.requestStockAnalysis({
                        stockSymbol: symbol,
                        stockName: name,
                        tradingTrends: tradingTrendResponse.result.body,
                    });
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
    public installButton() {
        const group = this.getStockUtilWrap();
        if (!group) {
            return;
        }

        const requestStockAnalysisButton = this.createButtonElement();

        group.append(requestStockAnalysisButton);
    }
}
