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
        const patch = (method: 'pushState' | 'replaceState') => {
            const original = history[method].bind(history);
            history[method] = (
                ...args: Parameters<typeof history.pushState>
            ) => {
                original(...args);
                this.emit(location.href);
            };
        };

        // history의 일부 메소드에 대해서 이벤트를 발행하는 기능을 Wrap한다.
        patch('pushState');
        patch('replaceState');
        window.addEventListener('popstate', () => this.emit(location.href));
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
