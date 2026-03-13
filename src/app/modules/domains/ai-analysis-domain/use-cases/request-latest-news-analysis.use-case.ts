import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import { AiAnalysisService, AiAnalysisType } from '@app/modules/ai-analysis';

@Injectable()
export class RequestLatestNewsAnalysisUseCase implements BaseUseCase<
    void,
    void
> {
    constructor(private readonly aiAnalysisService: AiAnalysisService) {}

    async execute(): Promise<void> {
        await this.aiAnalysisService.requestAiReport<AiAnalysisType.LatestNews>(
            {
                params: undefined,
                reportPayload: {
                    reportType: AiAnalysisType.LatestNews,
                    title: `최신 뉴스 요약`,
                },
            },
        );
    }
}
