import React, { useCallback, useState } from 'react';
import { useServices } from '../../../../context';
import {
    Button,
    Callout,
    PopupView,
} from '@extension/src/content/react/components';
import {
    useLoadLatestStockAiAnalysisReport,
    useLoadStockInfo,
    useLoadStockTradingTrend,
} from '@extension/src/content/react/features/stocks/hooks';
import { AiAnalysisType } from '@app/modules/ai-analysis/interfaces/ai-analysis.enum';
import { useUrlChange } from '@extension/src/content/react/hooks';
import { isNil } from '@nestjs/common/utils/shared.utils';

interface RequestAiAnalysisByStockButtonProps {
    stockCode: string;
}

interface GenerateOpenAnalysisReportViewProps {
    stockCode: string;
}

const AiAnalysisByStockToolbar: React.FC<
    RequestAiAnalysisByStockButtonProps
> = ({ stockCode }) => {
    if (!stockCode) {
        return null;
    }

    const { backend } = useServices();
    const [isRequesting, setIsRequesting] = useState(false);
    const { isLoading: isLoadingStockInfo, stockInfo } = useLoadStockInfo({
        stockCode,
    });
    const { isLoading: isLoadingTossTradingTrendData, tossTradingTrendData } =
        useLoadStockTradingTrend({
            stockCode,
        });

    if (isLoadingStockInfo || isLoadingTossTradingTrendData || isRequesting) {
        return (
            <Button title={'AI 분석 요청 중'} onClick={() => {}}>
                ⏳
            </Button>
        );
    }

    const handleRequestAiAnalysisByStockClick = async () => {
        if (
            isLoadingStockInfo ||
            isLoadingTossTradingTrendData ||
            isRequesting
        ) {
            return;
        }

        setIsRequesting(true);
        try {
            if (isNil(stockInfo) || isNil(tossTradingTrendData)) {
                return;
            }
            const { code, name } = stockInfo;

            await backend.requestStockAiAnalysisReport({
                stockSymbol: code,
                stockName: name,
                tradingTrends: tossTradingTrendData.body,
            });

            alert('AI 분석 요청이 완료되었습니다. 결과는 알림으로 전달됩니다.');
        } catch (error) {
            console.error('Failed to request AI analysis:', error);
            alert('AI 분석 요청에 실패했습니다.');
        } finally {
            setIsRequesting(false);
        }
    };

    return (
        <Button
            title={'AI 분석 요청'}
            onClick={handleRequestAiAnalysisByStockClick}
        >
            📊
        </Button>
    );
};

const OpenAiAnalysisReportViewButton: React.FC<
    GenerateOpenAnalysisReportViewProps
> = ({ stockCode }) => {
    const { isLoading, aiAnalysisReport } = useLoadLatestStockAiAnalysisReport({
        reportType: AiAnalysisType.Stock,
        reportTarget: stockCode,
    });
    const [isOpenedReportView, setIsOpenedReportView] =
        useState<boolean>(false);

    if (!aiAnalysisReport) {
        return null;
    }

    if (isLoading) {
        return (
            <Button title={'AI 분석 리포트 로딩 중'} onClick={() => {}}>
                ⏳
            </Button>
        );
    }

    const handleOpenAiAnalysisByStockClick = () => {
        if (isLoading) {
            return;
        }

        setIsOpenedReportView(!isOpenedReportView);
    };

    return (
        <>
            <Button
                title={'AI 분석 리포트 보기'}
                onClick={handleOpenAiAnalysisByStockClick}
            >
                🗄️
            </Button>
            <PopupView
                id={'open-ai-analysis-report-view-popup'}
                width={'50%'}
                height={'50%'}
                handlePopupClose={() => setIsOpenedReportView(false)}
                isOpenedReportView={isOpenedReportView}
            >
                <Callout>{aiAnalysisReport.content}</Callout>
            </PopupView>
        </>
    );
};

/**
 * AI 분석 버튼 컴포넌트
 */
export const RequestAiAnalysisByStockButtonGroup: React.FC = () => {
    const { location } = useServices();
    const [stockCode, setStockCode] = useState<string>(
        location.extractStockCode(),
    );

    // URL 변경 감지 콜백을 useCallback으로 메모이제이션
    const handleUrlChange = useCallback(
        (url: string) => {
            const newStockCode = location.extractStockCode(url);
            setStockCode(newStockCode);
        },
        [location],
    );

    useUrlChange(handleUrlChange);

    return (
        <div className={'njzdl36'}>
            <AiAnalysisByStockToolbar stockCode={stockCode} />
            <OpenAiAnalysisReportViewButton stockCode={stockCode} />
        </div>
    );
};
