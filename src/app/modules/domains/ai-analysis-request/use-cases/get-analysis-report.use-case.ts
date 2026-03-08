import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import {
    AiAnalysisReportService,
    ReportType,
} from '@app/modules/schemas/ai-analysis-report';
import { AnalysisReportResponseDto } from '../dto';

interface GetAnalysisReportPayload {
    reportType: ReportType;
    reportTarget: string;
}

@Injectable()
export class GetAnalysisReportUseCase implements BaseUseCase<
    GetAnalysisReportPayload,
    AnalysisReportResponseDto
> {
    constructor(
        private readonly aiAnalysisReportService: AiAnalysisReportService,
    ) {}

    async execute(
        payload: GetAnalysisReportPayload,
    ): Promise<AnalysisReportResponseDto> {
        const report = await this.aiAnalysisReportService.getReport({
            reportType: payload.reportType,
            reportTarget: payload.reportTarget,
        });

        if (!report) {
            throw new NotFoundException('분석 리포트를 찾을 수 없습니다.');
        }

        return {
            _id: report._id.toString(),
            reportType: report.reportType,
            reportTarget: report.reportTarget,
            title: report.title,
            content: report.content,
            createdAt: report.createdAt,
        };
    }
}
