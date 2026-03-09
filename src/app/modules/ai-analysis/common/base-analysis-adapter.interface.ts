import { FlowChildJob } from 'bullmq/dist/esm/interfaces/flow-job';

export interface IBaseAnalysisAdapter<T = any> {
    execute(params?: T): Promise<FlowChildJob>;
}
