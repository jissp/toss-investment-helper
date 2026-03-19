import React from 'react';
import { patterns } from '@extension/src/common/page-patterns';
import { ContentFeature } from '../../interfaces';
import { ShadowContainer } from '../../components/ShadowContainer';
import { LatestNewsAiAnalysisButton } from './components/LatestNewsAiAnalysisButton';

export class LatestNewsAiAnalysisButtonFeature extends ContentFeature {
    readonly elementId = 'request-latest-news-ai-analysis-container';

    isTargetPage(url: string): boolean {
        return patterns.page.mainPage.test(url);
    }

    install() {
        const anchor = document.querySelector('main');
        if (!anchor) {
            return;
        }

        let container = document.getElementById(this.elementId);
        if (!container) {
            container = document.createElement('div');
            container.id = this.elementId;
            anchor.before(container);
        }

        this.mountReact(
            container,
            <ShadowContainer>
                <LatestNewsAiAnalysisButton
                    services={{
                        backend: this.backendApiService,
                    }}
                />
            </ShadowContainer>,
        );
    }

    protected uninstall() {
        this.unmountReact();
        this.documentService.removeElement(this.elementId);
    }
}
