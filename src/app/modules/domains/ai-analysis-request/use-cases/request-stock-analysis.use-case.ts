import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { AiAnalyzerService } from '@app/modules/back-ai-analyzer';
import { ReportType } from '@app/modules/schemas/ai-analysis-report';
import { RequestStockAnalysisRequestDto } from '../dto';

@Injectable()
export class RequestStockAnalysisUseCase implements BaseUseCase<
    RequestStockAnalysisRequestDto,
    void
> {
    constructor(private readonly aiAnalyzerService: AiAnalyzerService) {}

    async execute(payload: RequestStockAnalysisRequestDto): Promise<void> {
        await this.aiAnalyzerService.requestAnalysis(
            ReportType.Stock,
            payload.stockSymbol,
        );
    }
}
