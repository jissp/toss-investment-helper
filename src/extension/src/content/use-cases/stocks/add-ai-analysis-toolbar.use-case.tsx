import React from 'react';
import { patterns } from '@extension/src/common/page-patterns';
import { RequestAiAnalysisByStockButtonGroup } from '@extension/src/content/react/features/stocks/ai-analysis-toolbar/components/AiAnalysisByStockToolbar';
import { ServiceProvider } from '../../react/context';
import { BaseUseCaseAbstract } from '@extension/src/content/use-cases/base-use-case.abstract';
import { Nullable } from '@common/types';

export class AddAiAnalysisToolbarUseCase extends BaseUseCaseAbstract {
    readonly containerElementId = 'request-stock-ai-analysis-container';

    install() {
        const main = this.documentService.getMainElement();
        if (!main) {
            return;
        }

        if (!this.domObserver.isAddedWatchId(this.containerElementId)) {
            this.domObserver.addWatchId(this.containerElementId, () =>
                this.install(),
            );
        }

        const existingContainer = document.getElementById(
            this.containerElementId,
        );
        if (existingContainer) {
            return;
        }

        const wrap = this.getWrap();
        if (!wrap) {
            return;
        }

        let container = document.getElementById(this.containerElementId);
        if (!container) {
            container = document.createElement('div');
            container.id = this.containerElementId;
            wrap.append(container);
        }

        this.mountReact(
            container,
            <ServiceProvider>
                <RequestAiAnalysisByStockButtonGroup />
            </ServiceProvider>,
        );
    }

    protected uninstall() {
        this.unmountReact();
        this.documentService.removeElement(this.containerElementId);
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
    private getWrap(): Nullable<HTMLElement> {
        const main = this.documentService.getMainElement();
        if (!main) {
            return null;
        }

        const watchActionGroupSelect = main.querySelector(
            '[data-parent-name="WatchActionGroupSelect"]',
        );
        if (!watchActionGroupSelect) {
            return null;
        }

        return watchActionGroupSelect.parentNode as HTMLElement;
    }
}
