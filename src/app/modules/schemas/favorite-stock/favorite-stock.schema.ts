import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { StockType } from './favorite-stock.types';

@Schema({
    collection: 'favorite_stocks',
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class FavoriteStock {
    @Prop({ type: String, required: true, unique: true, maxlength: 20 })
    @ApiProperty({ description: '종목 코드' })
    code!: string;

    @Prop({ type: String, required: true, maxlength: 10 })
    @ApiProperty({ description: '종목 심볼' })
    symbol!: string;

    @Prop({ type: String, enum: StockType, required: true })
    @ApiProperty({ enum: StockType, description: '종목 타입' })
    itemType!: StockType;

    @Prop({ type: String, required: true, maxlength: 255 })
    @ApiProperty({ type: String, description: '종목 이름' })
    name!: string;

    @Prop({ type: String, required: true, maxlength: 1000 })
    @ApiProperty({ type: String, description: '로고 이미지' })
    logoImageUrl!: string;

    @Prop({ type: Date, default: Date.now })
    @ApiProperty({ type: Date, description: '생성일' })
    createdAt!: Date;

    @Prop({ type: Date, required: false })
    @ApiPropertyOptional({ type: Date, description: '수정일' })
    updatedAt?: Date | null;
}

export const FavoriteStockSchema = SchemaFactory.createForClass(FavoriteStock);
export type FavoriteStockDto = Omit<
    FavoriteStock,
    keyof mongoose.Document | 'createdAt' | 'updatedAt'
>;
