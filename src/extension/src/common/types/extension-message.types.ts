export interface ExtensionMessage<T = unknown> {
    type: ExtensionMessageType;
    data?: T;
}

export enum ExtensionMessageType {
    SendServerMessage = 'SendServerMessage',
    UpdateFavoriteStock = 'UpdateFavoriteStock',
}

export interface SendServerMessageBody {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    body?: any;
}

export interface SendServerMessageResponse {
    ok: boolean;
    status: number;
    data?: string;
}
