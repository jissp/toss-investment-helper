import { Injectable } from '@nestjs/common';
import { AiAnalysisService } from '@app/modules/ai-analysis';
import { ReportType } from '@app/modules/schemas/ai-analysis-report';

@Injectable()
export class AiAnalyzerService {
  constructor(private readonly aiAnalysisService: AiAnalysisService) {}

  async requestAnalysis(reportType: ReportType, target: string): Promise<void> {
    switch (reportType) {
      case ReportType.Stock:
        await this.aiAnalysisService.requestStockAnalysis({
          stockSymbol: target,
        });
        break;
      case ReportType.Market:
        await this.aiAnalysisService.requestMarketAnalysis({
          marketType: 'DOMESTIC',
        });
        break;
      default:
        throw new Error(`Unknown report type: ${reportType}`);
    }
  }
}
