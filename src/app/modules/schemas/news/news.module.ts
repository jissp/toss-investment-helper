import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema, StockNews, StockNewsSchema } from './schemas';

const schemas = [
    { name: News.name, schema: NewsSchema },
    { name: StockNews.name, schema: StockNewsSchema },
];

@Module({
    imports: [MongooseModule.forFeature(schemas)],
    providers: [],
    exports: [MongooseModule.forFeature(schemas)],
})
export class NewsModule {}
