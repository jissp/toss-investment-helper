import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from '@modules/redis';
import { QueueModule } from '@modules/queue';
import { SlackModule } from '@modules/slack';
import { NewsCrawlerModule } from '@app/modules/news-crawler';
import { AiAnalysisModule } from '@app/modules/ai-analysis';
import { HealthCheckModule } from '@app/modules/domains/health-check/health-check.module';
import { FavoriteStockModule } from '@app/modules/domains/favorite-stock';
import { AiAnalysisDomainModule } from '@app/modules/domains/ai-analysis-domain';
import { AnalysisDomainModule } from '@app/modules/domains/analysis';
import configuration, { IConfiguration } from './configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const mongoConfig =
                    configService.get<IConfiguration['mongo']>('mongo');
                if (!mongoConfig) {
                    throw new Error('Mongo configuration is missing');
                }

                return {
                    uri: mongoConfig.uri,
                    dbName: 'toss-investment',
                    autoCreate: true,
                };
            },
        }),
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (
                configService: ConfigService,
            ): IConfiguration['redis'] => {
                return configService.get<IConfiguration['redis']>('redis')!;
            },
        }),
        QueueModule.forRootAsync(),
        ScheduleModule.forRoot(),
        SlackModule.forRoot(),
        AiAnalysisModule.forRoot(),
        HealthCheckModule,
        NewsCrawlerModule,
        FavoriteStockModule,
        AiAnalysisDomainModule,
        AnalysisDomainModule,
    ],
})
export class AppModule {}
