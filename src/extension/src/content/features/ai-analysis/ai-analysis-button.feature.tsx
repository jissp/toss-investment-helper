import React from 'react';
import { patterns } from '@extension/src/common/page-patterns';
import { ContentFeature } from '../../interfaces';
import { AiAnalysisButton } from './components/AiAnalysisButton';

export class AiAnalysisButtonFeature extends ContentFeature {
    readonly elementId = 'request-stock-ai-analysis-container';

    install() {
        const main = this.documentService.getMainElement();
        if (!main) {
            return;
        }

        const anchor = main.querySelector(
            '[data-parent-name="WatchActionGroupSelect"]',
        );
        if (!anchor?.parentNode) {
            return;
        }

        const group = anchor.parentNode as HTMLElement;

        let container = document.getElementById(this.elementId);
        if (!container) {
            container = document.createElement('div');
            container.id = this.elementId;
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            group.append(container);
        }

        this.mountReact(
            container,
            <AiAnalysisButton
                services={{
                    backend: this.backendApiService,
                    location: this.locationService,
                    tossWts: this.tossWtsApiService,
                }}
            />,
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
}
