export class RouterObserver {
    private static instance: RouterObserver;
    private listeners = new Set<(url: string) => void>();

    static getInstance(): RouterObserver {
        if (!this.instance) {
            this.instance = new RouterObserver();
        }

        return this.instance;
    }

    initialize() {
        if (!window.navigation) {
            return;
        }

        window.navigation.addEventListener('navigate', (event) => {
            this.emit(event.destination.url);
        });
    }

    /**
     * @param url
     * @private
     */
    private emit(url: string) {
        this.listeners.forEach((cb) => cb(url));
    }

    /**
     * @param callback
     */
    onUrlChange(callback: (url: string) => void): () => void {
        this.listeners.add(callback);

        return () => this.listeners.delete(callback);
    }
}
