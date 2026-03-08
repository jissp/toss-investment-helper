import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    FavoriteStock,
    FavoriteStockDto,
} from '@app/modules/schemas/favorite-stock';

@Injectable()
export class FavoriteStockRepository {
    constructor(
        @InjectModel(FavoriteStock.name)
        private readonly model: Model<FavoriteStock>,
    ) {}

    /**
     * @param items
     */
    async createMany(items: FavoriteStockDto[]): Promise<FavoriteStock[]> {
        return this.model.insertMany(items);
    }

    /**
     * @param codes
     */
    async deleteByCodes(codes: string[]): Promise<{ deletedCount: number }> {
        const result = await this.model.deleteMany({ code: { $in: codes } });
        return { deletedCount: result.deletedCount || 0 };
    }

    /**
     *
     */
    async findAll(): Promise<FavoriteStock[]> {
        return this.model.find().exec();
    }

    /**
     * @param code
     */
    async findByCode(code: string): Promise<FavoriteStock | null> {
        return this.model.findOne({ code }).exec();
    }
}
