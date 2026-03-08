import { StockType } from '@app/modules/schemas/favorite-stock';

export interface FavoriteStockItem {
    code: string;
    symbol: string;
    itemType: StockType;
    name: string;
    logoImageUrl: string;
}
