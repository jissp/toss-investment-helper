import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { AiAnalysisReportService } from '@app/modules/schemas/ai-analysis-report';
import { AnalysisReportsListResponseDto } from '../dto';

interface ListAnalysisReportsPayload {
    reportType: string;
    limit?: number;
}

@Injectable()
export class ListAnalysisReportsUseCase implements BaseUseCase<
    ListAnalysisReportsPayload,
    Promise<AnalysisReportsListResponseDto>
> {
    constructor(
        private readonly aiAnalysisReportService: AiAnalysisReportService,
    ) {}

    async execute(
        payload: ListAnalysisReportsPayload,
    ): Promise<AnalysisReportsListResponseDto> {
        const reports = await this.aiAnalysisReportService.getReportsByType({
            reportType: payload.reportType,
            limit: payload.limit || 10,
        });

        return {
            reports: reports.map((report) => ({
                _id: report._id.toString(),
                reportType: report.reportType,
                reportTarget: report.reportTarget,
                title: report.title,
                content: report.content,
                createdAt: report.createdAt,
            })),
            total: reports.length,
        };
    }
}
