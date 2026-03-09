import {
    ArrayMaxSize,
    ArrayMinSize,
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    TossWatchList,
    TossWatchListItem,
    TossWatchListItemPrice,
    WatchListType,
} from '@app/common/interfaces/toss';
import type { Nullable } from '@common/types';

export class WatchlistItemPricesDto implements TossWatchListItemPrice {
    @IsString()
    @ApiProperty({ description: '종목 코드' })
    code!: string;

    @IsNumber()
    @ApiPropertyOptional({ description: '기본가' })
    base: number;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: '기본가 (원화)' })
    baseKrw: Nullable<number>;

    @IsNumber()
    @ApiPropertyOptional({ description: '종가' })
    close: number;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: '종가 (원화)' })
    closeKrw: Nullable<number>;

    @IsString()
    @ApiPropertyOptional({ description: '통화' })
    currency: string;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: '' })
    estimatedPrice?: number;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: '' })
    estimatedVolume?: number;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: '' })
    overtimeMarketBase?: number;

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({ description: '' })
    overtimeMarketClose?: number;
}

export class UpdateFavoriteStockItemDto implements TossWatchListItem {
    @IsNumber()
    @ApiProperty({ description: '아이템 ID' })
    id!: number;

    @IsNumber()
    @ApiProperty({ description: '부모 리스트 ID' })
    parentListId!: number;

    @IsString()
    @ApiProperty({ description: '종목 코드' })
    code!: string;

    @IsString()
    @ApiProperty({ description: '종목 심볼' })
    symbol!: string;

    @IsString()
    @ApiProperty({ description: '종목 타입 (STOCK 등)' })
    itemType!: string;

    @IsNumber()
    @ApiProperty({ description: '정렬 순서' })
    ordering!: number;

    @IsString()
    @ApiProperty({ description: '생성일' })
    createdAt!: string;

    @IsString()
    @ApiProperty({ description: '수정일' })
    updatedAt!: string;

    @IsString()
    @ApiProperty({ description: '종목 이름' })
    name!: string;

    @IsBoolean()
    @ApiProperty({ description: '메모 여부' })
    hasMemo!: boolean;

    @ValidateNested()
    @Type(() => WatchlistItemPricesDto)
    @ApiPropertyOptional({ description: '가격 정보' })
    prices?: WatchlistItemPricesDto;

    @IsString()
    @ApiProperty({ description: '로고 이미지 URL' })
    logoImageUrl!: string;

    @IsString()
    @ApiProperty({ description: '상품 상태' })
    productStatus!: string;
}

export class WatchlistDto implements TossWatchList {
    @IsNumber()
    @ApiProperty({ description: '워치리스트 ID' })
    id!: number;

    @IsString()
    @ApiProperty({ description: '워치리스트 이름' })
    name!: string;

    @IsNumber()
    @ApiProperty({ description: '정렬 순서' })
    ordering!: number;

    @IsString()
    @ApiProperty({ description: '워치리스트 타입 (예: RECENT_WATCH)' })
    type!: WatchListType;

    @IsNumber()
    @ApiProperty({ description: '아이템 개수' })
    itemCount!: number;

    @IsString()
    @ApiProperty({ description: '생성일' })
    createdAt!: string;

    @IsString()
    @ApiProperty({ description: '수정일' })
    updatedAt!: string;

    @ArrayMinSize(0)
    @ArrayMaxSize(1000)
    @ValidateNested({ each: true })
    @Type(() => UpdateFavoriteStockItemDto)
    @ApiProperty({
        type: [UpdateFavoriteStockItemDto],
        description: 'watchlist items 배열',
    })
    items!: UpdateFavoriteStockItemDto[];
}

export class PutFavoriteStocksRequestDto {
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => WatchlistDto)
    @ApiProperty({
        type: [WatchlistDto],
        description: '토스의 newWatchList API의 watchlists 배열',
    })
    watchLists!: WatchlistDto[];
}
