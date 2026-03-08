import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { AiAnalyzerService } from '@app/modules/back-ai-analyzer';
import { ReportType } from '@app/modules/schemas/ai-analysis-report';
import { RequestMarketAnalysisRequestDto } from '../dto';

@Injectable()
export class RequestMarketAnalysisUseCase implements BaseUseCase<
    RequestMarketAnalysisRequestDto,
    void
> {
    constructor(private readonly aiAnalyzerService: AiAnalyzerService) {}

    async execute(payload: RequestMarketAnalysisRequestDto): Promise<void> {
        await this.aiAnalyzerService.requestAnalysis(
            ReportType.Market,
            payload.marketType,
        );
    }
}
