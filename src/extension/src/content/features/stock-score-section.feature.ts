import type { StockScoreResponseDto } from '@app/modules/domains/analysis/dto/responses/stock-score.response.dto';
import { Nullable } from '@common/types/util.types';
import { patterns } from '@extension/src/common/page-patterns';
import {
    BackendApiService,
    DocumentService,
    LocationService,
    TemplateService,
    TossWtsApiService,
} from '../services';
import { ContentFeature } from '../interfaces';

export class StockScoreSectionFeature extends ContentFeature {
    protected readonly elementId = 'investor-score-section';
    private latestUpdateStockCode: Nullable<string> = null;

    private readonly documentService: DocumentService =
        DocumentService.getInstance();
    private readonly templateService: TemplateService =
        TemplateService.getInstance();
    private readonly tossWtsApiService: TossWtsApiService =
        TossWtsApiService.getInstance();
    private readonly locationService: LocationService =
        LocationService.getInstance();
    private readonly backendApiService: BackendApiService =
        BackendApiService.getInstance();

    install() {
        const wrap = this.getInvestorSectionWrap();
        if (!wrap) {
            return null;
        }

        const titleSection = this.templateService.getTemplate(
            'src/content/templates/investor-score-title.section.html',
        );
        const scoreSection = this.templateService.getTemplate(
            'src/content/templates/investor-score.section.html',
        ) as HTMLElement;

        const section = wrap.firstElementChild;
        section?.firstElementChild?.prepend(titleSection);
        section?.lastElementChild?.prepend(scoreSection);

        const stockCode = this.locationService.extractStockCode();
        if (this.latestUpdateStockCode === stockCode) {
            return;
        }

        this.updateScoreSectionUI(stockCode);
    }

    protected uninstall() {
        this.documentService.removeElement(this.elementId);
    }

    /**
     * @param url
     */
    isTargetPage(url: string): boolean {
        return patterns.page.stockOrder.test(url);
    }

    /**
     * @param stockCode
     * @private
     */
    private async updateScoreSectionUI(stockCode: string): Promise<void> {
        const wrap = this.getInvestorSectionWrap();
        if (!wrap) {
            return;
        }

        const stockData = await this.fetchStockScoreData(stockCode);
        if (!stockData) {
            return;
        }

        const scoreElement = wrap.querySelector<HTMLSpanElement>('span.score');
        const scorePercentElement =
            wrap.querySelector<HTMLElement>('.score_percent');
        const tooltipElement =
            wrap.querySelector<HTMLSpanElement>('span.tooltip');
        if (!scoreElement || !scorePercentElement || !tooltipElement) {
            return;
        }

        scorePercentElement.style.width = `${(stockData.score / 10) * 100}%`;
        scoreElement.innerText = stockData.score.toString();
        tooltipElement.innerText = this.formatSignalText(stockData);

        this.latestUpdateStockCode = stockCode;
    }

    /**
     * @param stockCode
     * @private
     */
    private async fetchStockScoreData(
        stockCode: string,
    ): Promise<StockScoreResponseDto | null> {
        const [stockResponse, tradingTrendResponse] = await Promise.all([
            this.tossWtsApiService.getStockInfo(stockCode),
            this.tossWtsApiService.getTradingTrend(stockCode),
        ]);
        const { symbol, name } = stockResponse.result;

        const response = await this.backendApiService.requestStockScoreAnalysis(
            {
                stockSymbol: symbol,
                stockName: name,
                tradingTrends: tradingTrendResponse.result.body,
            },
        );

        if (!response.data) {
            throw new Error('Failed to fetch stock score analysis');
        }

        return JSON.parse(response.data) as StockScoreResponseDto;
    }

    /**
     * @param summary
     * @param signals
     * @private
     */
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
            arrText.push('', '[감지된 시그널]', ...signalLines);
        }

        return arrText.join('\n');
    }

    /**
     * @private
     */
    private getInvestorSectionWrap(): Element | null {
        const main = this.documentService.getMainElement();
        if (!main) {
            return null;
        }

        return main.querySelector('[data-section-name="종목상세__투자자동향"]');
    }
}
