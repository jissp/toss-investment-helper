import { Module } from '@nestjs/common';
import { RequestStockInvestorScoreUseCase } from './use-cases';
import { AnalysisDomainController } from './analysis-domain.controller';

const useCases = [RequestStockInvestorScoreUseCase];

@Module({
    imports: [],
    controllers: [AnalysisDomainController],
    providers: [...useCases],
})
export class AnalysisDomainModule {}
