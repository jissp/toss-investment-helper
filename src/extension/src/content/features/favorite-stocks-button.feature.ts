import { patterns } from '@extension/src/common/page-patterns';
import {
    BackendApiService,
    DocumentService,
    TemplateService,
    TossWtsApiService,
} from '../services';
import { ContentFeature } from '../interfaces';

export class FavoriteStocksButtonFeature extends ContentFeature {
    private readonly documentService: DocumentService =
        DocumentService.getInstance();
    private readonly templateService: TemplateService =
        TemplateService.getInstance();
    private readonly tossWtsApiService: TossWtsApiService =
        TossWtsApiService.getInstance();
    private readonly backendApiService: BackendApiService =
        BackendApiService.getInstance();

    protected readonly elementId = 'update-favorite-stock';

    install() {
        const main = this.documentService.getMainElement();
        if (!main) {
            return null;
        }

        const group = main.querySelector(
            '[data-contents-code="통화_변경"]',
        )?.parentElement;
        if (!group) {
            return null;
        }

        const button = this.createElement();
        group.prepend(button);
        return button;
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
     * @private
     */
    private createElement(): HTMLElement {
        const element = this.templateService.getTemplate(
            'src/content/templates/send-favorite-stocks.button.html',
        ) as HTMLElement;

        element.addEventListener('click', () => {
            const handle = async () => {
                const response = await this.tossWtsApiService.getWatchLists();
                await this.backendApiService.putFavoriteStock(
                    response.result.watchlists,
                );
            };

            handle();
        });

        return element;
    }
}
