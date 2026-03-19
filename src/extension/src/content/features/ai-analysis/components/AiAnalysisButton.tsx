import React, { useState } from 'react';
import {
    BackendApiService,
    LocationService,
    TossWtsApiService,
} from '../../../services';

interface AiAnalysisButtonProps {
    services: {
        backend: BackendApiService;
        location: LocationService;
        tossWts: TossWtsApiService;
    };
}

/**
 * AI 분석 버튼 컴포넌트
 * @param services
 * @constructor
 */
export const AiAnalysisButton: React.FC<AiAnalysisButtonProps> = ({
    services,
}) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (loading) {
            return;
        }

        setLoading(true);
        try {
            const stockCode = services.location.extractStockCode();
            const [stockResponse, tradingTrendResponse] = await Promise.all([
                services.tossWts.getStockInfo(stockCode),
                services.tossWts.getTradingTrend(stockCode),
            ]);

            const { symbol, name } = stockResponse.result;

            await services.backend.requestStockAiAnalysis({
                stockSymbol: symbol,
                stockName: name,
                tradingTrends: tradingTrendResponse.result.body,
            });

            alert('AI 분석 요청이 완료되었습니다. 결과는 알림으로 전달됩니다.');
        } catch (error) {
            console.error('Failed to request AI analysis:', error);
            alert('AI 분석 요청에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            title="AI 분석 요청"
            style={{
                fontSize: '18px',
                border: 'none',
                background: 'none',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.5 : 1,
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            📊
        </button>
    );
};
