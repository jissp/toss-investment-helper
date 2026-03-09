import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MarketAnalyzerQueueType } from '../market-analyzer.types';

@Processor(MarketAnalyzerQueueType.RequestMarketAnalysis)
export class RequestMarketAnalysisProcessor extends WorkerHost {
    private readonly logger = new Logger(RequestMarketAnalysisProcessor.name);

    constructor() {
        super();
    }

    async process(job: Job, token?: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
}
