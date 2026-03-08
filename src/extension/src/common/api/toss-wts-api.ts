import { Config } from '@extension/src/common/constants';
import { NewWatchResponse, TossWtsResponse } from '@app/common/interfaces';

export class TossWtsApiClient {
    private host: string;

    constructor() {
        const { host } = Config.toss.wts;
        this.host = host;
    }

    public async getWatchLists<
        R = TossWtsResponse<NewWatchResponse>,
    >(): Promise<R> {
        const response = await fetch(
            `${this.host}/api/v1/new-watchlists?includePrice=true&lazyLoad=false`,
            {
                method: 'GET',
                credentials: 'include',
            },
        );

        const json = await response.json();

        return json as R;
    }
}
