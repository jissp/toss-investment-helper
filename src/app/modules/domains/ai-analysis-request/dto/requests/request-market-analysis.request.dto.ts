import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { MarketType } from '../../ai-analysis-request.types';

export class RequestMarketAnalysisRequestDto {
    @ApiProperty({
        enum: MarketType,
        description: '시장 유형',
    })
    @IsEnum(MarketType)
    marketType: MarketType;
}
