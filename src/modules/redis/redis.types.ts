import { FactoryProvider, ModuleMetadata, Type } from '@nestjs/common';
import { Nullable } from '@common/types';

export const RedisConfig = Symbol('RedisConfig');
export const RedisConnection = Symbol('RedisConnection');

export const RedisNullString = '__NULL__';

export type IRedisConfig = {
    mode?: 'cluster' | 'single';
    host: string;
    port: string;
};

export interface RedisAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
    /**
     * Type (class name) of provider (instance to be registered and injected).
     */
    useClass?: Type<IRedisConfig>;

    /**
     * Factory function that returns an instance of the provider to be injected.
     */
    useFactory?: (...args: any[]) => Promise<IRedisConfig> | IRedisConfig;

    /**
     * Optional list of providers to be injected into the context of the Factory function.
     */
    inject?: FactoryProvider['inject'];
}

export enum RedisSetType {
    NX = 'NX', // Only set the key if it does not already exist.
    XX = 'XX', // Only set the key if it already exists.
}

export enum RedisExpireType {
    EX = 'EX', // seconds
    PX = 'PX', // milliseconds
}

export interface RedisKeySetOptions {
    seconds: Nullable<number>;
}
