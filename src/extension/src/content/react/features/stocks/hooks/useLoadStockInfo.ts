import { Nullable } from '@common/types';
import { StockInfo } from '@app/common/interfaces';
import { useEffect, useMemo, useState } from 'react';
import { useServices } from '@extension/src/content/react/context';

type Props = {
    stockCode: string;
};

export type UseLoadStockInfoResult = {
    isLoading: boolean;
    stockInfo: Nullable<StockInfo>;
};

export const useLoadStockInfo = ({
    stockCode,
}: Props): UseLoadStockInfoResult => {
    const [isLoading, setIsLoading] = useState(false);
    const [stockInfo, setStockInfo] = useState<Nullable<StockInfo>>(null);
    const { tossWts } = useServices();

    // useMemo로 API 호출(Promise) 캐싱
    const apiCall = useMemo(() => {
        return tossWts.getStockInfo(stockCode);
    }, [stockCode, tossWts]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await apiCall;
                setStockInfo(response.result);
            } catch (error) {
                console.error('Failed to load stock info:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [apiCall]);

    return { isLoading, stockInfo };
};
