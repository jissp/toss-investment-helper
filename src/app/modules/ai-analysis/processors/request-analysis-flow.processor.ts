import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'bullmq';
import { Model } from 'mongoose';
import { AiAnalysisReport } from '@app/modules/schemas/ai-analysis-report';
import {
    AiAnalysisFlowType,
    RequestAnalysisFlowPayload,
} from '../ai-analysis.types';

@Processor(AiAnalysisFlowType.RequestAnalysis)
export class RequestAnalysisFlowProcessor extends WorkerHost {
    private readonly logger = new Logger(RequestAnalysisFlowProcessor.name);

    constructor(
        @InjectModel(AiAnalysisReport.name)
        private readonly aiAnalysisReportModel: Model<AiAnalysisReport>,
    ) {
        super();
    }

    async process(job: Job<RequestAnalysisFlowPayload>): Promise<any> {
        const { reportType, reportTarget, title } = job.data;
        const results = await this.getChildrenValues(job);

        await this.aiAnalysisReportModel.create({
            reportType,
            reportTarget,
            title,
            content: results[0],
        });
    }

    private async getChildrenValues(job: Job) {
        const childrenValues = await job.getChildrenValues<string>();

        return Object.values(childrenValues);
    }
}
