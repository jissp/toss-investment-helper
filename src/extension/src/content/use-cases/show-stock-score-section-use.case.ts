import { StockScoreResponseDto } from '@app/modules/domains/analysis';
import { context } from '@extension/src/common/context';

export class ShowStockScoreSectionUseCase {
    private elementId: string = 'investor-score-section';
    private isChecking: boolean = false;

    constructor() {}

    public execute() {
        setInterval(() => {
            this.checkAndInstall();
        }, 1000);
    }

    private async checkAndInstall() {
        if (this.isChecking) {
            return;
        }

        try {
            this.isChecking = true;

            if (!context.locationService.isStockOrderPage()) {
                return;
            }

            const element = this.getElement();
            if (!element) {
                this.install();
                await this.installAfterHook();
            }
        } finally {
            this.isChecking = false;
        }
    }

    /**
     *
     */
    public createElement() {
        return context.templateService.getTemplate(
            'src/content/templates/investor-score.section.html',
        );
    }

    /**
     *
     */
    public getElement() {
        const main = context.documentService.getMainElement();
        if (!main) {
            return null;
        }

        return main.querySelector(`[id="${this.elementId}"]`);
    }

    /**
     *
     */
    public install() {
        const wrap = this.getInvestorSectionWrap();
        if (!wrap) {
            return null;
        }

        const investorInfoSection = this.createElement();
        if (!investorInfoSection) {
            return;
        }

        wrap.firstElementChild?.remove();
        wrap.prepend(investorInfoSection);
    }

    private async installAfterHook() {
        const stockCode = context.locationService.extractStockCode();
        const stockResponse =
            await context.tossWtsApiClient.getStockInfo(stockCode);
        const tradingTrendResponse =
            await context.tossWtsApiClient.getTradingTrend(stockCode);
        const { symbol, name } = stockResponse.result;
        const response = await context.backendApi.requestStockScoreAnalysis({
            stockSymbol: symbol,
            stockName: name,
            tradingTrends: tradingTrendResponse.result.body,
        });
        if (!response.data) {
            return;
        }
        try {
            const data = JSON.parse(response.data) as StockScoreResponseDto;

            const signalLines = data.signals
                .map((s) => {
                    const icon =
                        s.level === 'danger'
                            ? '🔴'
                            : s.level === 'warning'
                              ? '🟡'
                              : s.level === 'positive'
                                ? '🟢'
                                : 'ℹ️';
                    return `${icon} ${s.message}`;
                })
                .join('\n');

            const message = [
                `위험도: ${data.score}/10`,
                `${data.summary}`,
                ...(signalLines ? [``, `[감지된 시그널]`, signalLines] : []),
            ].join('\n');

            const element = this.getElement();
            if (!element) {
                return;
            }

            const elementSpan = element.querySelector('span');
            if (!elementSpan) {
                return;
            }

            elementSpan.innerText = message;
        } catch (error) {
            console.warn(error);
        }
    }

    private getInvestorSectionWrap() {
        const main = context.documentService.getMainElement();
        if (!main) {
            return null;
        }

        return main.querySelector('[data-section-name="종목상세__투자자동향"]');
    }
}
