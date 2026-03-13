import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { AiAnalysisService, AiAnalysisType } from '@app/modules/ai-analysis';
import { RequestStockAnalysisRequestDto } from '../dto';

@Injectable()
export class RequestStockAnalysisUseCase implements BaseUseCase<
    RequestStockAnalysisRequestDto,
    void
> {
    constructor(private readonly aiAnalysisService: AiAnalysisService) {}

    async execute(payload: RequestStockAnalysisRequestDto): Promise<void> {
        await this.aiAnalysisService.requestAiReport({
            params: payload,
            reportPayload: {
                reportType: AiAnalysisType.Stock,
                reportTarget: payload.stockSymbol,
                title: `${payload.stockName} 종목 분석`,
            },
        });
    }
}
