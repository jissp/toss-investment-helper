import { MarketType } from '@app/modules/domains/ai-analysis-domain/ai-analysis-domain.types';
import { patterns } from '@extension/src/common/page-patterns';
import {
    BackendApiService,
    DocumentService,
    TemplateService,
    TossWtsApiService,
} from '../services';
import { ContentFeature } from '../interfaces';

export class MarketAiAnalysisButtonFeature extends ContentFeature {
    readonly elementId = 'request-market-ai-analysis';

    private readonly documentService = DocumentService.getInstance();
    private readonly templateService = TemplateService.getInstance();
    private readonly tossWtsApiService = TossWtsApiService.getInstance();
    private readonly backendApiService = BackendApiService.getInstance();

    isTargetPage(url: string): boolean {
        return patterns.page.mainPage.test(url);
    }

    install() {
        const anchor = document.querySelector('main');
        if (!anchor) {
            return null;
        }

        const button = this.createElement();
        anchor.before(button);
    }

    protected uninstall() {
        this.documentService.removeElement(this.elementId);
    }

    private createElement(): HTMLElement {
        const element = this.templateService.getTemplate(
            'src/content/templates/request-market-ai-analysis.button.html',
        ) as HTMLElement;

        element.addEventListener('click', () => {
            const handle = async () => {
                const response = await this.tossWtsApiService.getIndices();
                const indexMap = response.result.indexMap;

                const indices = Object.values(indexMap)
                    .flat()
                    .map((item) => ({
                        code: item.code,
                        displayName: item.displayName,
                        latestPrice: item.price.latestPrice,
                        basePrice: item.price.basePrice,
                        changeType: item.price.changeType,
                    }));

                await this.backendApiService.requestMarketAiAnalysis({
                    marketType: MarketType.DOMESTIC,
                    indices,
                });
            };

            handle();
        });

        return element;
    }
}
