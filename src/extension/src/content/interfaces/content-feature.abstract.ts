import { createRoot, type Root } from 'react-dom/client';
import type React from 'react';
import { DomObserver, RouterObserver } from '../observers';
import {
    BackendApiService,
    DocumentService,
    LocationService,
    TossWtsApiService,
} from '@extension/src/content';

export abstract class ContentFeature {
    protected readonly routerObserver = RouterObserver.getInstance();
    protected readonly domObserver = DomObserver.getInstance();

    private reactRoot: Root | null = null;

    protected abstract readonly elementId: string;

    protected readonly documentService: DocumentService =
        DocumentService.getInstance();
    protected readonly tossWtsApiService: TossWtsApiService =
        TossWtsApiService.getInstance();
    protected readonly locationService: LocationService =
        LocationService.getInstance();
    protected readonly backendApiService: BackendApiService =
        BackendApiService.getInstance();

    protected abstract isTargetPage(url: string): boolean;

    protected abstract install(): void;
    protected abstract uninstall(): void;
    private unsubscribeUrl?: () => void;

    protected mountReact(container: HTMLElement, component: React.ReactNode) {
        if (this.reactRoot) {
            this.reactRoot.unmount();
        }
        this.reactRoot = createRoot(container);
        this.reactRoot.render(component);
    }

    protected unmountReact() {
        this.reactRoot?.unmount();
        this.reactRoot = null;
    }

    public start() {
        this.unsubscribeUrl = this.routerObserver.onUrlChange((url) => {
            this.handleUrlChange(url);
        });

        this.handleUrlChange(location.href);
    }

    stop() {
        this.unsubscribeUrl?.();
    }

    private handleUrlChange(url: string) {
        if (!this.isTargetPage(url)) {
            this.domObserver.removeWatchId(this.elementId);
            this.uninstall();
            return;
        }

        if (!this.domObserver.isAddedWatchId(this.elementId)) {
            this.domObserver.addWatchId(this.elementId, () => {
                this.install();
            });
        }

        if (!document.getElementById(this.elementId)) {
            this.install();
        }
    }
}
