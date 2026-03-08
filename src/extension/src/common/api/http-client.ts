/**
 * HTTP 요청 옵션 인터페이스
 */
type RequestOptions = Omit<RequestInit, 'signal'> & {
    timeout?: number;
    retryCount?: number;
};

/**
 * HTTP 에러 클래스
 */
class HttpError extends Error {
    constructor(
        public readonly status: number,
        public readonly statusText: string,
        message: string,
    ) {
        super(message);
        this.name = 'HttpError';
    }

    isClientError(): boolean {
        return this.status >= 400 && this.status < 500;
    }

    isServerError(): boolean {
        return this.status >= 500;
    }

    isTimeout(): boolean {
        return this.message.includes('timeout');
    }
}

/**
 * HTTP 클라이언트 클래스
 * fetch를 래핑하여 타임아웃, 에러 처리, 헤더 관리를 강화
 */
class HttpClient {
    private readonly timeout: number = 5000;

    constructor(private readonly baseUrl: string) {}

    async request<T = unknown>(
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        path: string,
        options?: RequestOptions,
    ): Promise<T> {
        const controller = new AbortController();
        const timeoutId = setTimeout(
            () => controller.abort(),
            options?.timeout ?? this.timeout,
        );

        try {
            const url = this.buildUrl(path);
            const headers = this.buildHeaders(
                options?.headers as Record<string, string> | undefined,
            );
            const response = await fetch(url, {
                method,
                signal: controller.signal,
                headers,
                ...options,
            });

            return await this.handleResponse<T>(response);
        } catch (error) {
            throw this.handleError(error, options?.timeout ?? this.timeout);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    private buildHeaders(
        customHeaders?: Record<string, string>,
    ): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            ...customHeaders,
        };
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            throw new HttpError(
                response.status,
                response.statusText,
                `HTTP ${response.status}: ${response.statusText}`,
            );
        }

        if ([201, 204].includes(response.status)) {
            return true as T;
        }

        const json = await response.json();

        return (json.data ?? json) as T;
    }

    private handleError(error: unknown, timeoutMs: number): Error {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return new Error(`Request timeout after ${timeoutMs}ms`);
            }
            return error;
        }
        return new Error('Unknown error occurred');
    }

    private buildUrl(path: string): string {
        return `${this.baseUrl}${path}`;
    }
}

export type { RequestOptions };
export { HttpError, HttpClient };
