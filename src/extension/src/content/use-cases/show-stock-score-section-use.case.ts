import { Nullable } from '@common/types/util.types';
import { StockScoreResponseDto } from '@app/modules/domains/analysis/dto/responses/stock-score.response.dto';
import { context } from '@extension/src/common/context';

export class ShowStockScoreSectionUseCase {
    private elementId: string = 'investor-score-section';
    private isChecking: boolean = false;
    private latestUpdateStockCode: Nullable<string> = null;

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

            const stockCode = context.locationService.extractStockCode();
            if (this.isLatestStockCode(stockCode)) {
                return;
            }

            const element = this.getElement();
            if (!element) {
                this.install();
            }

            await this.updateScoreSectionUI(stockCode);
        } finally {
            this.isChecking = false;
        }
    }

    /**
     *
     */
    public createElementTitle() {
        return context.templateService.getTemplate(
            'src/content/templates/investor-score-title.section.html',
        );
    }

    /**
     *
     */
    public createElementScore() {
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

        return main.querySelector(`#${this.elementId}`);
    }

    /**
     *
     */
    public getScoreElement(element: Element): Nullable<HTMLSpanElement> {
        return element.querySelector('span.score');
    }

    /**
     *
     */
    public getScorePercentElement(element: Element): Nullable<HTMLSpanElement> {
        return element.querySelector('.score_percent');
    }

    /**
     *
     */
    public getTooltipElement(element: Element): Nullable<HTMLSpanElement> {
        return element.querySelector('span.tooltip');
    }

    /**
     *
     */
    public install() {
        const wrap = this.getInvestorSectionWrap();
        if (!wrap) {
            return null;
        }

        const investorScoreTitleSection = this.createElementTitle();
        if (!investorScoreTitleSection) {
            return;
        }
        const investorScoreScoreSection = this.createElementScore();
        if (!investorScoreScoreSection) {
            return;
        }

        const section = wrap.firstElementChild;
        const firstElementChild = section?.firstElementChild;
        const lastElementChild = section?.lastElementChild;

        firstElementChild?.prepend(investorScoreTitleSection);
        lastElementChild?.prepend(investorScoreScoreSection);
    }

    private isLatestStockCode(stockCode: string) {
        return this.latestUpdateStockCode === stockCode;
    }

    private updateLatestStockCode(stockCode: string) {
        this.latestUpdateStockCode = stockCode;
    }

    private async fetchStockScoreData(
        stockCode: string,
    ): Promise<StockScoreResponseDto | null> {
        const [stockResponse, tradingTrendResponse] = await Promise.all([
            context.tossWtsApiClient.getStockInfo(stockCode),
            context.tossWtsApiClient.getTradingTrend(stockCode),
        ]);
        const { symbol, name } = stockResponse.result;

        const response = await context.backendApi.requestStockScoreAnalysis({
            stockSymbol: symbol,
            stockName: name,
            tradingTrends: tradingTrendResponse.result.body,
        });

        if (!response.data) {
            throw new Error('Failed to fetch stock score analysis');
        }

        return JSON.parse(response.data) as StockScoreResponseDto;
    }

    private formatSignalText({
        summary,
        signals,
    }: StockScoreResponseDto): string {
        const signalIconMap: Record<string, string> = {
            danger: '🔴',
            warning: '🟡',
            positive: '🟢',
        };

        const arrText = [summary];
        if (signals.length) {
            const signalLines = signals.map((s) => {
                const icon = signalIconMap[s.level] ?? 'ℹ️';

                return `${icon} ${s.message}`;
            });

            arrText.push(``, `[감지된 시그널]`, ...signalLines);
        }

        return arrText.join('\n');
    }

    private async updateScoreSectionUI(stockCode: string): Promise<void> {
        const stockData = await this.fetchStockScoreData(stockCode);
        if (!stockData) {
            return;
        }

        const element = this.getInvestorSectionWrap();
        if (!element) {
            return;
        }

        const scoreElement = this.getScoreElement(element);
        const scorePercentElement = this.getScorePercentElement(element);
        const tooltipElement = this.getTooltipElement(element);
        if (!scoreElement || !tooltipElement || !scorePercentElement) {
            return;
        }

        const scorePercent = (stockData.score / 10) * 100;
        scorePercentElement.style.width = `${scorePercent}%`;

        scoreElement.innerText = stockData.score.toString();
        tooltipElement.innerText = this.formatSignalText(stockData);

        this.updateLatestStockCode(stockCode);
    }

    private getInvestorSectionWrap() {
        const main = context.documentService.getMainElement();
        if (!main) {
            return null;
        }

        return main.querySelector('[data-section-name="종목상세__투자자동향"]');
    }
}
