import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoriteStock, FavoriteStockSchema } from './favorite-stock.schema';

const schemas = [
    {
        name: FavoriteStock.name,
        schema: FavoriteStockSchema,
    },
];

@Module({
    imports: [MongooseModule.forFeature(schemas)],
    exports: [MongooseModule.forFeature(schemas)],
})
export class FavoriteStockModule {}
