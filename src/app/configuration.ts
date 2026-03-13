import { NotFoundException } from '@nestjs/common';
import { IRedisConfig } from '@modules/redis/redis.types';

export interface IConfiguration {
    mongo: {
        uri: string;
    };
    redis: IRedisConfig;
    rss: {
        google: {
            business: string;
            global: string;
        };
    };
    gemini: {
        model: string;
    };
    naver: {
        enable: boolean;
        search: {
            host: string;
            key: string;
            secret: string;
        };
    };
    slack: {
        enable: boolean;
        signingSecret: string;
        appToken: string;
        token: string;
        channel: {
            stock: string;
            geminiLog: string;
        };
    };
}

export default (): IConfiguration => ({
    mongo: {
        uri: getEnv('MONGO_DATABASE_URI'),
    },
    redis: {
        mode: getEnv('REDIS_MODE') === 'cluster' ? 'cluster' : 'single',
        host: getEnv('REDIS_HOST'),
        port: getEnv('REDIS_PORT'),
    },
    gemini: {
        model: getEnv('GEMINI_CLI_MODEL'),
    },
    rss: {
        google: {
            business: getEnv('GOOGLE_RSS_BUSINESS'),
            global: getEnv('GOOGLE_RSS_GLOBAL'),
        },
    },
    naver: {
        enable: getEnv('NAVER_SEARCH_ENABLE') === 'true',
        search: {
            host: getEnv('NAVER_SEARCH_HOST'),
            key: getEnv('NAVER_SEARCH_CLIENT_ID'),
            secret: getEnv('NAVER_SEARCH_CLIENT_SECRET'),
        },
    },
    slack: {
        enable: getEnv('SLACK_ENABLE') === 'true',
        signingSecret: getEnv('SLACK_SIGNING_SECRET'),
        appToken: getEnv('SLACK_APP_TOKEN'),
        token: getEnv('SLACK_BOT_TOKEN'),
        channel: {
            stock: getEnv('SLACK_STOCK_CHANNEL_ID'),
            geminiLog: getEnv('SLACK_STOCK_GEMINI_LOG_CHANNEL_ID'),
        },
    },
});

function getEnv(key: string): string {
    if (!process.env[key]) {
        throw new NotFoundException(
            `Missing required environment variable: ${key}`,
        );
    }

    return process.env[key];
}
