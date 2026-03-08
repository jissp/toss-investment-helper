import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseAnalysisAdapter } from './base-analysis.adapter';
import {
    AiAnalysisQueueType,
    RequestStockAnalysisParams,
} from '../ai-analysis.types';
import { FavoriteStock } from '@app/modules/schemas/favorite-stock';

@Injectable()
export class StockAnalysisAdapter extends BaseAnalysisAdapter<RequestStockAnalysisParams> {
    constructor(
        @InjectModel(FavoriteStock.name)
        private readonly favoriteStockModel: Model<FavoriteStock>,
    ) {
        super();
    }

    async execute(params: RequestStockAnalysisParams): Promise<any[]> {
        // 1. 데이터 조회
        await this.init();

        // 2. 분석 대상 정보 수집
        const stock = await this.favoriteStockModel.findOne({
            symbol: params.stockSymbol,
        });

        if (!stock) {
            throw new Error(`Stock not found: ${params.stockSymbol}`);
        }

        // 3. Children Job 구성
        const childrenJobs = [
            {
                name: 'AnalyzeStockPrice',
                queueName: AiAnalysisQueueType.PromptToGeminiCli,
                data: { ...params, stockSymbol: params.stockSymbol },
            },
            {
                name: 'AnalyzeStockNews',
                queueName: AiAnalysisQueueType.PromptToGeminiCli,
                data: { ...params, stockSymbol: params.stockSymbol },
            },
            {
                name: 'GenerateStockReport',
                queueName: AiAnalysisQueueType.PromptToGeminiCli,
                data: { stockSymbol: params.stockSymbol },
            },
        ];

        return childrenJobs;
    }

    async init(): Promise<void> {
        // 종목 정보 등 사전 조회 (필요 시)
    }
}
