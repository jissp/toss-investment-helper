import { Nullable } from '@common/types';
import { context } from '@extension/src/common/context';

export class RequestStockAiAnalysisUseCase {
    private buttonId: string = 'request-stock-ai-analysis';
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
        const element = context.templateService.getTemplate(
            'src/content/templates/request-stock-ai-analysis.button.html',
        );
        element.addEventListener('click', () => {
            const handle = async () => {
                const stockCode = context.locationService.extractStockCode();
                const stockResponse =
                    await context.tossWtsApiClient.getStockInfo(stockCode);
                const tradingTrendResponse =
                    await context.tossWtsApiClient.getTradingTrend(stockCode);

                const { symbol, name } = stockResponse.result;

                await context.backendApi.requestStockAiAnalysis({
                    stockSymbol: symbol,
                    stockName: name,
                    tradingTrends: tradingTrendResponse.result.body,
                });
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
    public installButton() {
        const group = this.getStockUtilWrap();
        if (!group) {
            return;
        }

        const requestStockAnalysisButton = this.createButtonElement();

        group.append(requestStockAnalysisButton);
    }
}
