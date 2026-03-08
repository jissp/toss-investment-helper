import { Config } from '../constants/config';
import type { PutFavoriteStocksRequestDto } from '@app/modules/domains/favorite-stock';
import type {
    AnalysisReportResponseDto,
    AnalysisReportsListResponseDto,
    RequestMarketAnalysisRequestDto,
    RequestStockAnalysisRequestDto,
} from '@app/modules/domains/ai-analysis-request';
import { ReportType } from '@app/modules/schemas/ai-analysis-report';
import { HttpClient } from './http-client';

export class ApiClient {
    private readonly http: HttpClient;
    private readonly host: string;

    constructor() {
        const { host } = Config.helper;
        this.host = host;
        this.http = new HttpClient(`${host}`);
    }

    /**
     * Health check API
     */
    public async healthCheck() {
        const response = await fetch(`${this.host}/health-check`, {
            method: 'GET',
        });

        return response.ok;
    }

    public async putFavoriteStocks(body: PutFavoriteStocksRequestDto) {
        return this.http.request('PUT', '/v1/favorite-stocks', {
            body: JSON.stringify(body),
            timeout: 3000,
        });
    }

    public async requestAnalysis(stockCode: string) {
        return this.http.request('POST', `/analysis/${stockCode}`, {
            timeout: 10000,
        });
    }

    /**
     * Request stock analysis API
     */
    public async requestStockAnalysis(body: RequestStockAnalysisRequestDto) {
        return this.http.request('POST', '/v1/ai-analysis-request/stock', {
            body: JSON.stringify(body),
            timeout: 10000,
        });
    }

    /**
     * Request market analysis API
     */
    public async requestMarketAnalysis(body: RequestMarketAnalysisRequestDto) {
        return this.http.request('POST', '/v1/ai-analysis-request/market', {
            body: JSON.stringify(body),
            timeout: 10000,
        });
    }

    /**
     * Get analysis report API
     */
    public async getAnalysisReport(
        reportType: ReportType,
        reportTarget: string,
    ): Promise<AnalysisReportResponseDto> {
        return this.http.request(
            'GET',
            `/v1/ai-analysis-request/reports/${reportType}/${reportTarget}`,
            {
                timeout: 10000,
            },
        );
    }

    /**
     * List analysis reports API
     */
    public async listAnalysisReports(
        reportType: ReportType,
        limit?: number,
    ): Promise<AnalysisReportsListResponseDto> {
        const queryParams = new URLSearchParams();
        queryParams.append('reportType', reportType);
        if (limit) {
            queryParams.append('limit', limit.toString());
        }

        return this.http.request(
            'GET',
            `/v1/ai-analysis-request/reports?${queryParams.toString()}`,
            {
                timeout: 10000,
            },
        );
    }
}
