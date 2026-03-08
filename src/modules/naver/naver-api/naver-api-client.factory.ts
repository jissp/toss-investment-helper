import axios from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import type { NaverConfig } from '@modules/naver/common';
import { NaverApiProvider } from './naver-api.types';
import { NaverApiClient } from './naver-api.client';

@Injectable()
export class NaverApiClientFactory {
    constructor(
        @Inject(NaverApiProvider.NaverApiConfig)
        private readonly config: NaverConfig,
    ) {}

    /**
     * Naver API Client를 생성합니다.
     */
    public create() {
        const client = axios.create(this.getNaverAppConfig());

        return new NaverApiClient(client);
    }

    /**
     * Naver API Client 설정을 가져옵니다.
     * @private
     */
    private getNaverAppConfig() {
        return {
            baseURL: this.config.search.host,
            headers: {
                'X-Naver-Client-Id': this.config.search.key,
                'X-Naver-Client-Secret': this.config.search.secret,
            },
            timeout: 5000,
        };
    }
}
