import { Nullable } from '@common/types';
import {
    ComponentFactory,
    ComponentType,
} from '@extension/src/content/components';
import { ElementId, LocationService } from '@extension/src/content';
import {
    BackgroundEvent,
    BackgroundEventType,
} from '@extension/src/types/background-event.types';
import { TossWtsApiClient } from '@extension/src/common/api';

export class DocumentService {
    private readonly tossWtsApiClient: TossWtsApiClient;
    private readonly locationService: LocationService;
    private readonly componentFactory: ComponentFactory;

    constructor() {
        this.tossWtsApiClient = new TossWtsApiClient();
        this.componentFactory = new ComponentFactory();
        this.locationService = new LocationService();
    }

    public getMainElement(): Nullable<HTMLElement> {
        return document.querySelector('div[id="main-content"]')!;
    }

    public getStockUtilWrap(): Nullable<HTMLElement> {
        const main = this.getMainElement();
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
    public createRequestStockAnalysisButton() {
        const button = this.componentFactory.create(ComponentType.Button);

        return button
            .buildId(ElementId.RequestStockAnalysis)
            .buildClass('tw4l-emtxt715 tw4l-emtxt7o tw4l-emtxt7y tw4l-emtxt712')
            .buildText('📊')
            .buildOnClick(() => {
                const stockCode = this.locationService.extractStockCode();
                chrome.runtime.sendMessage({
                    action: 'sendToServer',
                    data: { stockCode },
                });
            })
            .build();
    }

    /**
     *
     */
    public getRequestStockAnalysisButton() {
        const main = this.getMainElement();
        if (!main) {
            return null;
        }

        return main.querySelector(`[id="${ElementId.RequestStockAnalysis}"]`);
    }

    /**
     *
     */
    public installRequestStockAnalysisButton() {
        const group = this.getStockUtilWrap();
        if (!group) {
            return;
        }

        const requestStockAnalysisButton =
            this.createRequestStockAnalysisButton();

        group.append(requestStockAnalysisButton);
    }

    /**
     *
     */
    public getTsLnb(): HTMLElement | null {
        const main = this.getMainElement();
        if (!main) {
            return null;
        }

        return main.querySelector('[id="ts-lnb"]')?.parentElement || null;
    }

    /**
     *
     */
    public getFavoriteTabButtonGroup(): HTMLElement | null {
        const main = this.getMainElement();
        if (!main) {
            return null;
        }

        return (
            main.querySelector('[data-contents-code="통화_변경"]')
                ?.parentElement || null
        );
    }

    /**
     *
     */
    public createUpdateFavoriteButton() {
        const button = this.componentFactory.create(ComponentType.Button);

        return button
            .buildId(ElementId.UpdateFavoriteStock)
            .buildClass(
                'tw4l-1wkoka52h tw4l-1wkoka59 tw4l-1wkoka5e tw4l-1wkoka517 tw4l-1wkoka5x tw4l-1wkoka5r tw4l-1wkoka5l tw4l-1wkoka528 tw4l-1wkoka537',
            )
            .buildText('관심 종목 전송')
            .buildOnClick(() => {
                const handle = async () => {
                    const response =
                        await this.tossWtsApiClient.getWatchLists();

                    return chrome.runtime.sendMessage<BackgroundEvent, void>({
                        type: BackgroundEventType.UpdateFavoriteStock,
                        data: { watchLists: response.result.watchlists },
                    });
                };

                handle();
            })
            .build();
    }

    /**
     *
     */
    public getUpdateFavoriteButton() {
        const main = this.getMainElement();
        if (!main) {
            return null;
        }

        return main.querySelector(`[id="${ElementId.UpdateFavoriteStock}"]`);
    }

    /**
     *
     */
    public installUpdateFavoriteButton() {
        const wrap = this.getFavoriteTabButtonGroup();
        if (!wrap) {
            return;
        }

        const button = this.createUpdateFavoriteButton();

        wrap.prepend(button);
    }
}
