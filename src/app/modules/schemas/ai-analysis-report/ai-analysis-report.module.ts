import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiAnalysisReport, AiAnalysisReportSchema } from './schemas';
import { AiAnalysisReportService } from './ai-analysis-report.service';

const schemas = [
    { name: AiAnalysisReport.name, schema: AiAnalysisReportSchema },
];

@Module({
    imports: [MongooseModule.forFeature(schemas)],
    providers: [AiAnalysisReportService],
    exports: [MongooseModule.forFeature(schemas), AiAnalysisReportService],
})
export class AiAnalysisReportModule {}
