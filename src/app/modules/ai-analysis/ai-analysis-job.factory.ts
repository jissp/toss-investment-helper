import { Injectable } from '@nestjs/common';
import { GeminiCliModel } from '@modules/gemini-cli';
import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';
import { ConstructorType, Pipe } from '@common/types';
import {
    AiAnalysisQueueType,
    RequestAiAnalysisAggregateJobData,
} from './interfaces';

export type PromptToGeminiCliParams = {
    prompt: string;
    model: GeminiCliModel;
};

@Injectable()
export class AiAnalysisJobFactory {
    /**
     * Gemini에게 프롬프트를 전달하는 기본 단위 Job 생성
     */
    public createPromptJob(
        name: string,
        prompt: string,
        model: GeminiCliModel = GeminiCliModel.Gemini3Pro,
    ): FlowChildJob {
        return {
            name,
            queueName: AiAnalysisQueueType.PromptToGeminiCli,
            data: {
                prompt,
                model,
            } as PromptToGeminiCliParams,
        };
    }

    /**
     * 여러 자식 Job들의 결과를 취합하여 최종 분석하는 집계 Job 생성
     */
    public createAggregateJob<TTransformArgs>(
        transformer: ConstructorType<
            Pipe<TTransformArgs & { resultPrompts: string[] }, string>
        >,
        children: FlowChildJob[],
        extraData?: TTransformArgs,
    ): FlowChildJob {
        return {
            name: '분석 결과 종합해서 재분석',
            queueName: AiAnalysisQueueType.RequestAnalysisAggregate,
            data: {
                transformer,
                ...extraData,
            } as RequestAiAnalysisAggregateJobData,
            children,
        };
    }
}
