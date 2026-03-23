import React from 'react';
import { patterns } from '@extension/src/common/page-patterns';
import { ServiceProvider } from '@extension/src/content/react/context';
import { ShadowContainer } from '@extension/src/content/react/components/ShadowContainer';
import { LatestNewsAiAnalysisButton } from '@extension/src/content/react/features/ai-analysis/components/LatestNewsAiAnalysisButton';
import { BaseUseCaseAbstract } from '@extension/src/content/use-cases/base-use-case.abstract';

export class RequestLatestNewsAiAnalysisUseCase extends BaseUseCaseAbstract {
    readonly containerElementId = 'request-latest-news-ai-analysis-container';

    isTargetPage(url: string): boolean {
        return patterns.page.mainPage.test(url);
    }

    install() {
        const wrap = document.querySelector('main');
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
                <ShadowContainer>
                    <LatestNewsAiAnalysisButton />
                </ShadowContainer>
            </ServiceProvider>,
        );
    }

    protected uninstall() {
        this.unmountReact();
        this.documentService.removeElement(this.containerElementId);
    }
}
