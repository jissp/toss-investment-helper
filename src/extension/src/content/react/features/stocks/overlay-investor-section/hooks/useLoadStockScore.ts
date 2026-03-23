import { useEffect, useState } from 'react';
import { Nullable } from '@common/types';
import { StockInfo, TradingTrendResponse } from '@app/common/interfaces';
import type { StockScoreResponseDto } from '@app/modules/domains/analysis';
import { useServices } from '@extension/src/content/react/context';

type Props = {
    stockCode: string;
    stockInfo: Nullable<StockInfo>;
    tossTradingTrendData: Nullable<TradingTrendResponse>;
};

export type UseLoadStockScoreResponse = {
    isLoading: boolean;
    isMounted: boolean;
    stockInfo: Nullable<StockInfo>;
    tossTradingTrendData: Nullable<TradingTrendResponse>;
    stockScore: Nullable<StockScoreResponseDto>;
};

export const useLoadStockScore = ({
    stockCode,
    stockInfo,
    tossTradingTrendData,
}: Props): UseLoadStockScoreResponse => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [stockScore, setStockScoreData] =
        useState<Nullable<StockScoreResponseDto>>(null);
    const { backend } = useServices();

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                if (!stockInfo || !tossTradingTrendData) {
                    return;
                }

                const stockScoreResponse =
                    await backend.requestStockScoreAnalysis({
                        stockSymbol: stockInfo.symbol,
                        stockName: stockInfo.name,
                        tradingTrends: tossTradingTrendData.body,
                    });

                if (!stockScoreResponse.data) {
                    return;
                }

                const stockScoreData = JSON.parse(
                    stockScoreResponse.data,
                ) as StockScoreResponseDto;

                setStockScoreData(stockScoreData);
                setIsMounted(true);
            } catch (error) {
                console.error('Failed to load stock score:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [stockCode, stockInfo, tossTradingTrendData]);

    return {
        isLoading,
        isMounted,
        stockInfo,
        tossTradingTrendData,
        stockScore,
    };
};
