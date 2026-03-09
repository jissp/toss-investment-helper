import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bullmq';
import { Model } from 'mongoose';
import {
    AiAnalysisReport,
    ReportType,
} from '@app/modules/schemas/ai-analysis-report';
import { AiAnalysisFlowType } from '../ai-analysis.types';
import { RequestStockAnalysisRequestDto } from '@app/modules/domains/ai-analysis-request';

@Processor(AiAnalysisFlowType.RequestAnalysis)
export class RequestAnalysisFlowProcessor extends WorkerHost {
    private readonly logger = new Logger(RequestAnalysisFlowProcessor.name);

    constructor(
        @InjectModel(AiAnalysisReport.name)
        private readonly aiAnalysisReportModel: Model<AiAnalysisReport>,
    ) {
        super();
    }

    async process(job: Job<RequestStockAnalysisRequestDto>): Promise<any> {
        const { stockSymbol, stockName } = job.data;
        const results = await this.getChildrenValues(job);

        await this.aiAnalysisReportModel.create({
            reportType: ReportType.Stock,
            reportTarget: stockSymbol,
            title: `${stockName} 종목 분석`,
            content: results[0],
        });
    }

    private async getChildrenValues(job: Job) {
        const childrenValues = await job.getChildrenValues<string>();

        return Object.values(childrenValues);
    }
}
