import {
    IndexCode,
    WatchListType,
} from '@app/common/interfaces/toss/toss.types';
import { Nullable } from '@common/types';

export interface TossWtsResponse<T> {
    result: T;
}

export interface NewWatchResponse {
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

export interface IndexCandle {
    dt: string;
    base: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    amount: number;
}

export interface IndicesData {
    code: string;
    nextDateTime: string;
    exchangeRate: number;
    candles: IndexCandle[];
}

export interface IndicesPrice {
    code: string;
    name: string;
    displayName: string;
    changeType: string;
    latestPrice: number;
    basePrice: number;
    baseDate?: string;
    foreignerAmount?: number;
    institutionAmount?: number;
    individualAmount?: number;
    tradingTrend?: string;
}

export interface MiniChartCandle {
    startDate: string;
    endDate: string;
    price: number;
}

export interface MiniChart {
    code: string;
    timezone: string;
    tradingStart: string;
    tradingEnd: string;
    candles: MiniChartCandle[];
}

export interface IndicesItem {
    code: IndexCode;
    name: string;
    displayName: string;
    logoImageUrl: string;
    nation: string;
    price: IndicesPrice;
    miniChart: MiniChart;
}

export interface GetIndicesResponse {
    indexMap: {
        [key: string]: IndicesItem[];
    };
}

export interface MarketInfo {
    code: string;
    displayName: string;
}

export interface GroupInfo {
    code: string;
    displayName: string;
}

export interface StockInfo {
    code: string;
    guid: string;
    symbol: string;
    isinCode: string;
    status: string;
    name: string;
    englishName: string;
    detailName: string;
    market: MarketInfo;
    group: GroupInfo;
    companyCode: string;
    companyName: string;
    logoImageUrl: string;
    currency: string;
    tradingSuspended: boolean;
    krxTradingSuspended: boolean;
    nxtTradingSuspended: boolean;
    commonShare: boolean;
    spac: boolean;
    spacMergerDate: Nullable<string>;
    leverageFactor: number;
    clearance: boolean;
    riskLevel: string;
    purchasePrerequisite: string;
    sharesOutstanding: number;
    prevListDate: Nullable<string>;
    listDate: string;
    delistDate: Nullable<string>;
    offeringPrice: Nullable<number>;
    warrantsCode: Nullable<string>;
    warrantsGroupCode: Nullable<string>;
    etfTaxCode: Nullable<string>;
    daytimePriceSupported: boolean;
    optionSupported: boolean;
    optionPennyPilotPriceSupported: boolean;
    optionOvertimeSupported: boolean;
    optionInstrument: Nullable<string>;
    derivativeEtp: boolean;
    poolingStock: boolean;
    nxtSupported: boolean;
    userTradingSuspended: boolean;
    limitOnCompetitiveTradingVolume: boolean;
    nxtOpenDate: string;
    nxtOpenDateRecent: string;
    derivativeEtf: boolean;
}

export interface PagingParam {
    number: number;
    size: number;
    key: string;
}

export interface TradingTrendData {
    baseDate: string;
    individualsBuyVolume: number;
    individualsSellVolume: number;
    netIndividualsBuyVolume: number;
    foreignerBuyVolume: number;
    foreignerSellVolume: number;
    netForeignerBuyVolume: number;
    institutionBuyVolume: number;
    institutionSellVolume: number;
    netInstitutionBuyVolume: number;
    insuranceOtherBuyVolume: number;
    netInsuranceOtherBuyVolume: number;
    insuranceBuyVolume: number;
    netInsuranceBuyVolume: number;
    otherFinancialInstitutionsBuyVolume: number;
    netOtherFinancialInstitutionsBuyVolume: number;
    financialInvestmentBuyVolume: number;
    netFinancialInvestmentBuyVolume: number;
    bankBuyVolume: number;
    netBankBuyVolume: number;
    trustAndPrivateEquityFundBuyVolume: number;
    netTrustAndPrivateEquityFundBuyVolume: number;
    trustBuyVolume: number;
    netTrustBuyVolume: number;
    privateEquityFundBuyVolume: number;
    netPrivateEquityFundBuyVolume: number;
    pensionFundBuyVolume: number;
    netPensionFundBuyVolume: number;
    otherCorporationBuyVolume: number;
    netOtherCorporationBuyVolume: number;
    foreignerHoldingVolume: number;
    foreignerLimitVolume: number;
    foreignerRatio: number;
    base: number;
    close: number;
    inMarketTime: boolean;
    hasIndividual: boolean;
    hasInstitution: boolean;
    hasForeigner: boolean;
    buyBalanceQuantity: Nullable<number>;
    buyBalanceRate: Nullable<number>;
    sellBalanceQuantity: Nullable<number>;
    sellBalanceRate: Nullable<number>;
    updatedAt: string;
}

export interface TradingTrendResponse {
    pagingParam: PagingParam;
    body: TradingTrendData[];
}
