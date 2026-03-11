import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsEnum,
    IsNumber,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MarketType } from '../../ai-analysis-domain.types';
import { IndexCode } from '@app/common/interfaces';

export class MarketIndexItemDto {
    @ApiProperty({ enum: IndexCode, description: '지수 코드 (예: KGG01P)' })
    @IsEnum(IndexCode)
    code: IndexCode;

    @ApiProperty({ description: '지수 표시명 (예: 코스피)' })
    @IsString()
    displayName: string;

    @ApiProperty({ description: '현재 지수 가격' })
    @IsNumber()
    latestPrice: number;

    @ApiProperty({ description: '기준 가격' })
    @IsNumber()
    basePrice: number;

    @ApiProperty({ description: '등락 유형 (RISE / FALL / EVEN)' })
    @IsString()
    changeType: string;
}

export class RequestMarketAnalysisRequestDto {
    @ApiProperty({
        enum: MarketType,
        description: '시장 유형',
    })
    @IsEnum(MarketType)
    marketType: MarketType;

    @ApiProperty({ type: [MarketIndexItemDto], description: '지수 목록' })
    @ValidateNested({ each: true })
    @Type(() => MarketIndexItemDto)
    @IsArray()
    indices: MarketIndexItemDto[];
}
