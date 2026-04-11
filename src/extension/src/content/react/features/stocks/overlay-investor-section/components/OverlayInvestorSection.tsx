import React, { useCallback, useEffect, useState } from 'react';
import { TradingTrendResponse } from '@app/common/interfaces';
import type {
    Signal,
    StockScoreResponseDto,
} from '@app/modules/domains/analysis';
import { Nullable } from '@common/types';
import { Callout } from '@extension/src/content/react/components';
import { Skeleton } from '@extension/src/content/react/components/Skeleton';
import {
    TossTable,
    TossTableFieldOptions,
} from '@extension/src/content/react/components/TossTable';
import {
    getNumberColorStyle,
    toShortDate,
} from '@extension/src/content/react/utils';
import { useLoadStockScore } from '@extension/src/content/react/features/stocks/overlay-investor-section/hooks';
import { useUrlChange } from '@extension/src/content/react/hooks';
import { TextAlign } from '@extension/src/content/common.types';
import { LocationService } from '@extension/src/content/services';
import {
    useLoadStockInfo,
    useLoadStockTradingTrend,
} from '@extension/src/content/react/features/stocks/hooks';

interface StockScoreSectionProps {
    stockCode: string;
}

interface StockScoreTooltipProps {
    stockScore: Nullable<StockScoreResponseDto>;
}

interface TossTradingTrendDetailsProps {
    tossTradingTrendData: Nullable<TradingTrendResponse>;
}

const tossTradingTrendFields = [
    {
        name: '종가',
        key: 'close',
    },
    {
        name: '등락률',
        key: 'priceChangeRatio',
    },
    {
        name: '개인',
        key: 'netIndividualsBuyVolume',
    },
    {
        name: '외국인',
        key: 'netForeignerBuyVolume',
    },
    {
        name: '기관',
        key: 'netInstitutionBuyVolume',
    },
    {
        name: '연기금',
        key: 'netPensionFundBuyVolume',
    },
    {
        name: '보험',
        key: 'netInsuranceBuyVolume',
    },
    {
        name: '사모펀드',
        key: 'netPrivateEquityFundBuyVolume',
    },
];

export const StockScoreTooltip: React.FC<StockScoreTooltipProps> = ({
    stockScore,
}) => {
    if (!stockScore) {
        return <Skeleton />;
    }

    return (
        <>
            <div
                style={{
                    fontSize: '14px',
                    fontWeight: '600',
                }}
            >
                <div>
                    <span>
                        <strong>위험도</strong>: {stockScore.score}
                    </span>
                </div>
                <div>
                    <span>{stockScore.summary}</span>
                </div>
                <Signals signals={stockScore.signals} />
            </div>
        </>
    );
};

const Signals = ({ signals }: { signals: Signal[] }) => {
    if (!signals.length) {
        return null;
    }

    const signalIconMap: Record<string, string> = {
        danger: '🔴',
        warning: '🟡',
        positive: '🟢',
    };

    return (
        <div>
            <div>[감지된 시그널]</div>
            {signals.map((signal) => (
                <div>
                    <span>{`${signalIconMap[signal.level] ?? 'ℹ️'} ${signal.message}`}</span>
                </div>
            ))}
        </div>
    );
};

export const TossTradingTrendDetails: React.FC<
    TossTradingTrendDetailsProps
> = ({ tossTradingTrendData }) => {
    if (!tossTradingTrendData) {
        return <Skeleton />;
    }

    if (!tossTradingTrendData.body) {
        return <Skeleton />;
    }

    const tossTradingTrendFieldNames = tossTradingTrendFields.map(
        (field) => field.name,
    );

    const transformedTossTGradingTrendData = tossTradingTrendData.body.map(
        (row) => {
            const tradingTrendValues = tossTradingTrendFields.map((field) => {
                let value: number | string = row[field.key];

                if (field.key === 'priceChangeRatio') {
                    value = ((row.close / row.base - 1) * 100).toFixed(2);
                }

                return {
                    ...field,
                    value,
                };
            });

            return [
                toShortDate(row.baseDate),
                ...tradingTrendValues.map(({ key, value }) => (
                    <span
                        style={{
                            color: getNumberColorStyle(value),
                        }}
                    >
                        {key === 'priceChangeRatio'
                            ? `${value.toLocaleString()}%`
                            : value.toLocaleString()}
                    </span>
                )),
            ];
        },
    );

    const fieldOptions: TossTableFieldOptions[] = [
        {
            textAlign: TextAlign.Left,
        },
    ];

    return (
        <TossTable
            fields={['일자', ...tossTradingTrendFieldNames]}
            rows={transformedTossTGradingTrendData}
            rowOptions={{ fieldOptions }}
        />
    );
};

export const OverlayInvestorSection: React.FC<StockScoreSectionProps> = ({
    stockCode: initialStockCode,
}) => {
    const locationService = LocationService.getInstance();
    const [stockCode, setStockCode] = useState<string>(initialStockCode);

    useEffect(() => {
        setStockCode(initialStockCode);
    }, [initialStockCode]);

    useUrlChange(
        useCallback(
            (url: string) => {
                const newStockCode = locationService.extractStockCode(url);
                setStockCode(newStockCode);
            },
            [locationService],
        ),
    );

    const { isLoading: isLoadingStockInfo, stockInfo } = useLoadStockInfo({
        stockCode,
    });
    const { isLoading: isLoadingTradingTrendData, tossTradingTrendData } =
        useLoadStockTradingTrend({ stockCode });

    const { isLoading, isMounted, stockScore } = useLoadStockScore({
        stockCode,
        stockInfo,
        tossTradingTrendData,
    });

    if (!isMounted && isLoading) {
        return <Skeleton />;
    }

    if (!stockCode || isLoadingStockInfo || isLoadingTradingTrendData) {
        return <Skeleton />;
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                backgroundColor: 'rgb(23, 23, 28)',
                height: '100%',
            }}
        >
            <Callout>
                <StockScoreTooltip stockScore={stockScore} />
            </Callout>
            <div style={{ overflow: 'auto', marginTop: '16px' }}>
                <TossTradingTrendDetails
                    tossTradingTrendData={tossTradingTrendData}
                />
            </div>
        </div>
    );
};
