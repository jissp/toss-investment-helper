import { patterns } from '@extension/src/common/page-patterns';

export class LocationService {
    public isStockOrderPage(): boolean {
        return patterns.page.stockOrder.test(location.href);
    }

    public extractStockCode(): string {
        const match = location.href.match(patterns.page.stockOrder);
        if (!match || !match[1]) {
            throw new Error('Stock code not found in URL');
        }
        return match[1];
    }
}
