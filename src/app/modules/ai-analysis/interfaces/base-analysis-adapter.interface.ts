import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';
import { AiAnalysisType } from './ai-analysis.enum';
import { AiReportParams } from './ai-analysis.types';

export interface IBaseAnalysisAdapter<T extends AiAnalysisType> {
    execute(params?: AiReportParams<T>): Promise<FlowChildJob>;
}
