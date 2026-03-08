export interface BackgroundEvent<T = unknown> {
    type: BackgroundEventType;
    data?: T;
}

export enum BackgroundEventType {
    HealthCheckRequest = 'HealthCheckRequest',
    HealthCheckResponse = 'HealthCheckResponse',
    UpdateFavoriteStock = 'UpdateFavoriteStock',
}
