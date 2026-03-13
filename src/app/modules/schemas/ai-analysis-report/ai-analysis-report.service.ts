import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiAnalysisReportDto } from './ai-analysis-report.types';
import { AiAnalysisReport } from './schemas/ai-analysis-report.schema';

@Injectable()
export class AiAnalysisReportService {
    constructor(
        @InjectModel(AiAnalysisReport.name)
        private readonly aiAnalysisReportModel: Model<AiAnalysisReport>,
    ) {}

    /**
     * AI 분석 리포트를 추가합니다.
     * @param aiAnalysisReport
     */
    public async addReport(aiAnalysisReport: AiAnalysisReportDto) {
        return this.aiAnalysisReportModel.create(aiAnalysisReport);
    }

    /**
     * AI 분석 리포트를 삭제합니다.
     * @param reportType
     * @param reportTarget
     */
    public async clearReport(reportType: string, reportTarget: string) {
        return this.aiAnalysisReportModel.deleteMany({
            reportType,
            reportTarget,
        });
    }

    /**
     * AI 분석 리포트를 조회합니다.
     * @param reportType
     * @param reportTarget
     */
    public async getReport({
        reportType,
        reportTarget,
    }: {
        reportType: string;
        reportTarget: string;
    }) {
        return this.aiAnalysisReportModel
            .findOne({
                reportType,
                reportTarget,
            })
            .sort({ _id: -1 });
    }

    /**
     * AI 분석 리포트 목록을 조회합니다.
     * @param reportType
     * @param limit
     */
    public async getReportsByType({
        reportType,
        limit = 10,
    }: {
        reportType: string;
        limit?: number;
    }) {
        return this.aiAnalysisReportModel
            .find({
                reportType,
            })
            .sort({ _id: -1 })
            .limit(limit);
    }
}
