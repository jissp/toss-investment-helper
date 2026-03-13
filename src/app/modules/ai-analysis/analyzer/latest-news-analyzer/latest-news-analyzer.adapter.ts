import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';
import { GeminiCliModel } from '@modules/gemini-cli';
import { News, NewsCategory } from '@app/modules/schemas/news';
import { LatestNewsAnalysisTransformer } from './transformers';
import { AiAnalysisType, IBaseAnalysisAdapter } from '../../interfaces';
import { AiAnalysisJobFactory } from '../../ai-analysis-job.factory';

type InitResponse = {
    newsItems: News[];
};

@Injectable()
export class LatestNewsAnalyzerAdapter implements IBaseAnalysisAdapter<AiAnalysisType.LatestNews> {
    constructor(
        private readonly aiAnalysisJobFactory: AiAnalysisJobFactory,
        @InjectModel(News.name) private readonly newsModel: Model<News>,
    ) {}

    async execute(): Promise<FlowChildJob> {
        const { newsItems } = await this.init();

        return this.aiAnalysisJobFactory.createPromptJob(
            '최신 뉴스(이슈) 정리',
            new LatestNewsAnalysisTransformer().transform({
                newsItems,
            }),
            GeminiCliModel.Gemini3Flash,
        );
    }

    private async init(): Promise<InitResponse> {
        const newsItems = await this.newsModel
            .find({
                category: NewsCategory.Google,
            })
            .limit(40)
            .lean();

        return {
            newsItems,
        };
    }
}
