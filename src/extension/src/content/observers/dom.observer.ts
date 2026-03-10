export class DomObserver {
    private static instance: DomObserver;
    private observer!: MutationObserver;
    private watchList = new Map<string, () => void>();

    static getInstance(): DomObserver {
        if (!this.instance) {
            this.instance = new DomObserver();
        }

        return this.instance;
    }

    initialize() {
        this.observer = new MutationObserver(() => {
            console.log('DOM mutation detected');

            this.watchList.forEach((reinstall, id) => {
                if (!document.getElementById(id)) {
                    reinstall();
                }
            });
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    /**
     * @param elementId
     */
    public isAddedWatchId(elementId: string) {
        return this.watchList.has(elementId);
    }

    /**
     * @param elementId
     * @param reinstall
     */
    public addWatchId(elementId: string, reinstall: () => void) {
        this.watchList.set(elementId, reinstall);
    }

    /**
     * @param elementId
     */
    public removeWatchId(elementId: string) {
        this.watchList.delete(elementId);
    }
}
