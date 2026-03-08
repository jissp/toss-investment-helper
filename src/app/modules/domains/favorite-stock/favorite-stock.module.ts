import { Module } from '@nestjs/common';
import { FavoriteStockModule as FavoriteStockSchemaModule } from '@app/modules/schemas/favorite-stock';
import { FavoriteStockRepository } from './repositories';
import { PutFavoriteStocksUseCase } from './use-cases';
import { FavoriteStockController } from './favorite-stock.controller';

const repositories = [FavoriteStockRepository];
const useCases = [PutFavoriteStocksUseCase];

@Module({
    imports: [FavoriteStockSchemaModule],
    controllers: [FavoriteStockController],
    providers: [...repositories, ...useCases],
    exports: [],
})
export class FavoriteStockModule {}
