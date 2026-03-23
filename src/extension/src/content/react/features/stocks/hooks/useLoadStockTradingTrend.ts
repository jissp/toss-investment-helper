import { Nullable } from '@common/types';
import { TradingTrendResponse } from '@app/common/interfaces';
import { useEffect, useMemo, useState } from 'react';
import { useServices } from '@extension/src/content/react/context';

type Props = {
    stockCode: string;
};

export type UseLoadStockTradingTrendResult = {
    isLoading: boolean;
    tossTradingTrendData: Nullable<TradingTrendResponse>;
};

export const useLoadStockTradingTrend = ({
    stockCode,
}: Props): UseLoadStockTradingTrendResult => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tossTradingTrendData, setTossTradingTrendData] =
        useState<Nullable<TradingTrendResponse>>(null);

    const { tossWts } = useServices();

    const apiCall = useMemo(() => {
        return tossWts.getTradingTrend(stockCode);
    }, [stockCode, tossWts]);

    useEffect(() => {
        const fetchTradingTrend = async () => {
            try {
                setIsLoading(true);
                const tradingTrendResponse = await apiCall;
                setTossTradingTrendData(tradingTrendResponse.result);
            } catch (error) {
                console.error('Failed to load trading trend:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTradingTrend();
    }, [apiCall]);

    return {
        isLoading: isLoading,
        tossTradingTrendData,
    };
};
