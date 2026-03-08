import { Injectable } from '@nestjs/common';
import { difference, differenceBy } from 'lodash';
import { BaseUseCase } from '@app/common/types';
import { FavoriteStockRepository } from '../repositories';
import { PutFavoriteStocksRequestDto } from '../dto';

@Injectable()
export class PutFavoriteStocksUseCase implements BaseUseCase<
    PutFavoriteStocksRequestDto,
    void
> {
    constructor(
        private readonly favoriteStockRepository: FavoriteStockRepository,
    ) {}

    async execute(payload: PutFavoriteStocksRequestDto): Promise<void> {
        const stockItems = payload.watchLists.flatMap(
            (watchList) => watchList.items,
        );

        const existingItems = await this.favoriteStockRepository.findAll();

        const itemsToCreate = differenceBy(stockItems, existingItems, 'code');
        const codesToDelete = difference(existingItems, stockItems, 'code');

        if (codesToDelete.length > 0) {
            await this.favoriteStockRepository.deleteByCodes(codesToDelete);
        }

        if (itemsToCreate.length > 0) {
            await this.favoriteStockRepository.createMany(itemsToCreate);
        }
    }
}
