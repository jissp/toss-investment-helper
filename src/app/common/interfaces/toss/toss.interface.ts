import { WatchListType } from '@app/common/interfaces/toss/toss.types';
import { Nullable } from '@common/types';

export interface TossWtsResponse<T> {
    result: T;
}

export interface NewWatchResponse {
    maxWatchlistCount: number;
    watchlists: TossWatchList[];
}

export interface TossWatchListItemPrice {
    code: string;
    base: number;
    baseKrw: Nullable<number>;
    close: number;
    closeKrw: Nullable<number>;
    overtimeMarketBase?: number;
    overtimeMarketClose?: number;
    estimatedPrice?: number;
    estimatedVolume?: number;
    currency: string;
}

export interface TossWatchListItem {
    id: number;
    parentListId: number;
    code: string;
    itemType: string;
    ordering: number;
    name: string;
    symbol: string;
    hasMemo: boolean;
    prices?: TossWatchListItemPrice;
    logoImageUrl: string;
    productStatus: string;
    createdAt: string;
    updatedAt: string;
}

export interface TossWatchList {
    id: number;
    name: string;
    ordering: number;
    type: WatchListType;
    itemCount: number;
    createdAt: string;
    updatedAt: string;
    items: TossWatchListItem[];
}
