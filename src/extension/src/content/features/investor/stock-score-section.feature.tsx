import React from 'react';
import { patterns } from '@extension/src/common/page-patterns';
import { ContentFeature } from '../../interfaces';
import { ShadowContainer } from '../../components/ShadowContainer';
import { StockScoreSection } from './components/StockScoreSection';

export class StockScoreSectionFeature extends ContentFeature {
    protected readonly elementId = 'investor-score-section-container';

    install() {
        const wrap = this.getInvestorSectionWrap();
        if (!wrap) {
            return;
        }

        const section = wrap.firstElementChild;
        const targetElement = section?.lastElementChild;
        if (!targetElement) {
            return;
        }

        let container = document.getElementById(this.elementId);
        if (!container) {
            container = document.createElement('div');
            container.id = this.elementId;
            targetElement.prepend(container);
        }

        const stockCode = this.locationService.extractStockCode();
        if (!stockCode) {
            return;
        }

        this.mountReact(
            container,
            <ShadowContainer>
                <StockScoreSection
                    stockCode={stockCode}
                    services={{
                        backend: this.backendApiService,
                        tossWts: this.tossWtsApiService,
                    }}
                />
            </ShadowContainer>,
        );
    }

    protected uninstall() {
        this.unmountReact();
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
    private getInvestorSectionWrap(): Element | null {
        const main = this.documentService.getMainElement();
        if (!main) {
            return null;
        }

        return main.querySelector('[data-section-name="종목상세__투자자동향"]');
    }
}
