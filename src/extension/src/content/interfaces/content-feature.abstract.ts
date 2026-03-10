import { DomObserver, RouterObserver } from '../observers';

export abstract class ContentFeature {
    protected readonly routerObserver = RouterObserver.getInstance();
    protected readonly domObserver = DomObserver.getInstance();

    private unsubscribeUrl?: () => void;

    protected abstract readonly elementId: string;

    protected abstract isTargetPage(url: string): boolean;

    protected abstract install(): void;

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
