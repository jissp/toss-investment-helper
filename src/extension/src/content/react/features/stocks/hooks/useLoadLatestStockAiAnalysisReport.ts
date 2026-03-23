import { useEffect, useState } from 'react';
import { Nullable } from '@common/types';
import { useServices } from '@extension/src/content/react/context';
import { AiAnalysisType } from '@app/modules/ai-analysis';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { AnalysisReportResponseDto } from '@app/modules/domains/ai-analysis-domain';

interface Props {
    reportType: AiAnalysisType;
    reportTarget: Nullable<string>;
}

export interface UseLoadLatestStockAiAnalysisReportResult {
    isLoading: boolean;
    aiAnalysisReport: Nullable<AnalysisReportResponseDto>;
}

export const useLoadLatestStockAiAnalysisReport = ({
    reportType,
    reportTarget,
}: Props): UseLoadLatestStockAiAnalysisReportResult => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [aiAnalysisReport, setAiAnalysisReport] =
        useState<Nullable<AnalysisReportResponseDto>>(null);
    const { backend } = useServices();

    useEffect(() => {
        const fetchData = async ({ reportType, reportTarget }: Props) => {
            try {
                setIsLoading(true);

                if (isNil(reportTarget)) {
                    setAiAnalysisReport(null);
                    return;
                }

                const aiAnalysisReportResponse =
                    await backend.getStockAiAnalysisReport(
                        reportType,
                        reportTarget,
                    );
                if (!aiAnalysisReportResponse.data) {
                    throw new Error('Failed to fetch AI analysis report');
                }

                const aiAnalysisReport = JSON.parse(
                    aiAnalysisReportResponse.data,
                ) as AnalysisReportResponseDto;

                setAiAnalysisReport(aiAnalysisReport);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData({ reportType, reportTarget });

        return () => {};
    }, [reportType, reportTarget]);

    return {
        isLoading,
        aiAnalysisReport,
    };
};
