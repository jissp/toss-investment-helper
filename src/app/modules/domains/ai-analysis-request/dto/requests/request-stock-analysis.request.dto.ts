import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RequestStockAnalysisRequestDto {
    @ApiProperty({
        description: '종목 코드 (예: 005930)',
    })
    @IsString()
    stockSymbol: string;

    @ApiProperty({
        description: '분석 유형 (선택)',
        required: false,
    })
    @IsOptional()
    @IsString()
    analysisType?: string;
}
