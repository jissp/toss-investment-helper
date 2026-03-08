import { IBaseAnalysisAdapter } from '../ai-analysis.types';

export abstract class BaseAnalysisAdapter<
    T = any,
> implements IBaseAnalysisAdapter<T> {
    /**
     * 분석 대상에 맞는 Children Job을 생성하고 반환합니다.
     * 내부적으로 init()을 호출하여 필요한 데이터를 먼저 조회합니다.
     */
    abstract execute(params?: T): Promise<any[]>;

    /**
     * 분석에 필요한 데이터를 DB에서 조회합니다.
     * (종목 정보, 시장 정보 등)
     */
    abstract init(): Promise<void>;
}
