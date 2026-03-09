import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { AiAnalysisService } from '@app/modules/ai-analysis';
import { RequestMarketAnalysisRequestDto } from '../dto';

@Injectable()
export class RequestMarketAnalysisUseCase implements BaseUseCase<
    RequestMarketAnalysisRequestDto,
    void
> {
    constructor(private readonly aiAnalysisService: AiAnalysisService) {}

    async execute(payload: RequestMarketAnalysisRequestDto): Promise<void> {
        await this.aiAnalysisService.requestMarketAnalysis({
            marketType: payload.marketType,
        });
    }
}
