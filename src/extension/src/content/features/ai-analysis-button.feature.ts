import { patterns } from '@extension/src/common/page-patterns';
import {
    BackendApiService,
    DocumentService,
    LocationService,
    TemplateService,
    TossWtsApiService,
} from '../services';
import { ContentFeature } from '../interfaces';

export class AiAnalysisButtonFeature extends ContentFeature {
    readonly elementId = 'request-stock-ai-analysis';

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

    constructor() {
        super();
    }

    install() {
        const main = this.documentService.getMainElement();
        if (!main) {
            return null;
        }

        const anchor = main.querySelector(
            '[data-parent-name="WatchActionGroupSelect"]',
        );
        if (!anchor?.parentNode) {
            return null;
        }

        const group = anchor.parentNode as HTMLElement;
        const button = this.createElement();
        group.append(button);
    }

    /**
     * @param url
     */
    isTargetPage(url: string): boolean {
        return patterns.page.stockOrder.test(url);
    }

    private createElement(): HTMLElement {
        const element = this.templateService.getTemplate(
            'src/content/templates/request-stock-ai-analysis.button.html',
        ) as HTMLElement;

        element.addEventListener('click', () => {
            const handle = async () => {
                const stockCode = this.locationService.extractStockCode();

                const [stockResponse, tradingTrendResponse] = await Promise.all(
                    [
                        this.tossWtsApiService.getStockInfo(stockCode),
                        this.tossWtsApiService.getTradingTrend(stockCode),
                    ],
                );

                const { symbol, name } = stockResponse.result;

                await this.backendApiService.requestStockAiAnalysis({
                    stockSymbol: symbol,
                    stockName: name,
                    tradingTrends: tradingTrendResponse.result.body,
                });
            };

            handle();
        });

        return element;
    }
}
