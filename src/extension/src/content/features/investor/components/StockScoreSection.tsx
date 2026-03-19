import React, { useEffect, useState } from 'react';
import type { StockScoreResponseDto } from '@app/modules/domains/analysis/dto/responses/stock-score.response.dto';
import { BackendApiService, TossWtsApiService } from '../../../services';
import { Skeleton } from '../../../components/Skeleton';

interface StockScoreSectionProps {
    stockCode: string;
    services: {
        backend: BackendApiService;
        tossWts: TossWtsApiService;
    };
}

export const StockScoreSection: React.FC<StockScoreSectionProps> = ({
    stockCode,
    services,
}) => {
    const [data, setData] = useState<StockScoreResponseDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [stockResponse, tradingTrendResponse] = await Promise.all(
                    [
                        services.tossWts.getStockInfo(stockCode),
                        services.tossWts.getTradingTrend(stockCode),
                    ],
                );
                const { symbol, name } = stockResponse.result;

                const response =
                    await services.backend.requestStockScoreAnalysis({
                        stockSymbol: symbol,
                        stockName: name,
                        tradingTrends: tradingTrendResponse.result.body,
                    });

                if (response.data) {
                    setData(JSON.parse(response.data) as StockScoreResponseDto);
                }
            } catch (error) {
                console.error('Failed to fetch stock score:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [stockCode, services]);

    if (loading) {
        return <Skeleton />;
    }

    if (!data) {
        return null;
    }

    const signalIconMap: Record<string, string> = {
        danger: '🔴',
        warning: '🟡',
        positive: '🟢',
    };

    const tooltipText = [
        data.summary,
        ...(data.signals.length
            ? [
                  '',
                  '[감지된 시그널]',
                  ...data.signals.map(
                      (s) => `${signalIconMap[s.level] ?? 'ℹ️'} ${s.message}`,
                  ),
              ]
            : []),
    ].join('\n');

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '16px 0',
                fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            }}
        >
            <style>
                {`
                .tooltip-container {
                    position: absolute;
                    left: 0;
                    top: 25px;
                    visibility: hidden;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    z-index: 99999;
                    background: white;
                    border: 1px solid #f2f4f6;
                    padding: 12px;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    white-space: pre-wrap;
                    font-size: 13px;
                    line-height: 1.5;
                    width: max-content;
                    max-width: 300px;
                    color: #333d4b;
                }

                .score-bar-wrapper:hover .tooltip-container {
                    visibility: visible;
                    opacity: 1;
                    transform: translateY(0);
                }
                `}
            </style>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <span
                    style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#4e5968',
                    }}
                >
                    위험도
                </span>
                <span
                    style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#333d4b',
                    }}
                >
                    {data.score}
                </span>
            </div>

            <div
                className="score-bar-wrapper"
                style={{
                    position: 'relative',
                    width: '100%',
                    cursor: 'pointer',
                }}
            >
                <div
                    style={{
                        height: '8px',
                        backgroundColor: '#f2f4f6',
                        borderRadius: '4px',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            width: `${(data.score / 10) * 100}%`,
                            backgroundColor:
                                data.score >= 8
                                    ? '#f04452'
                                    : data.score >= 5
                                      ? '#ffbb00'
                                      : '#3182f6',
                            transition: 'width 0.5s ease-out',
                        }}
                    />
                </div>
                <div className="tooltip-container">{tooltipText}</div>
            </div>
        </div>
    );
};
