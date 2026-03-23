import React from 'react';
import { ServiceProvider } from '@extension/src/content/react/context/ServiceProvider';
import { OverlayInvestorSection } from '@extension/src/content/react/features/stocks/overlay-investor-section/components/OverlayInvestorSection';
import { BaseUseCaseAbstract } from '@extension/src/content/use-cases/base-use-case.abstract';

export class OverlayInvestorSectionUseCase extends BaseUseCaseAbstract {
    protected readonly containerElementId = 'investor-score-section-container';

    install() {
        if (!this.domObserver.isAddedWatchId(this.containerElementId)) {
            this.domObserver.addWatchId(this.containerElementId, () =>
                this.install(),
            );
        }

        const wrap = this.getInvestorSectionWrap();
        if (!wrap) {
            return;
        }

        const existingContainer = document.getElementById(
            this.containerElementId,
        );
        if (existingContainer) {
            return;
        }

        this.mountReactOverlay(
            wrap,
            this.containerElementId,
            <ServiceProvider>
                <OverlayInvestorSection
                    stockCode={this.locationService.extractStockCode()}
                />
            </ServiceProvider>,
        );
    }

    /**
     * @param url
     */
    isTargetPage(url: string): boolean {
        return this.locationService.isStockOrderPage(url);
    }

    /**
     * @private
     */
    private getInvestorSectionWrap(): HTMLElement | null {
        const main = this.documentService.getMainElement();
        if (!main) {
            return null;
        }

        return main.querySelector('[data-section-name="종목상세__투자자동향"]');
    }
}
