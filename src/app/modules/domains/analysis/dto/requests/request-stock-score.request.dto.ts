import { ApiProperty } from '@nestjs/swagger';
import {
    ArrayMinSize,
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { Nullable } from '@common/types';
import { TradingTrendData } from '@app/common/interfaces';

class TradingTrendDto implements TradingTrendData {
    @ApiProperty({ description: '은행 매수량' })
    @IsNumber()
    bankBuyVolume: number;

    @ApiProperty({ description: '기준가' })
    @IsNumber()
    base: number;

    @ApiProperty({ description: '기준일자' })
    @IsString()
    baseDate: string;

    @ApiProperty({ description: '매수 잔고 수량', required: false })
    @IsOptional()
    @IsNumber()
    buyBalanceQuantity: Nullable<number>;

    @ApiProperty({ description: '매수 잔고율', required: false })
    @IsOptional()
    @IsNumber()
    buyBalanceRate: Nullable<number>;

    @ApiProperty({ description: '종가' })
    @IsNumber()
    close: number;

    @ApiProperty({ description: '금융투자 매수량' })
    @IsNumber()
    financialInvestmentBuyVolume: number;

    @ApiProperty({ description: '외국인 매수량' })
    @IsNumber()
    foreignerBuyVolume: number;

    @ApiProperty({ description: '외국인 보유량' })
    @IsNumber()
    foreignerHoldingVolume: number;

    @ApiProperty({ description: '외국인 한도량' })
    @IsNumber()
    foreignerLimitVolume: number;

    @ApiProperty({ description: '외국인 비율' })
    @IsNumber()
    foreignerRatio: number;

    @ApiProperty({ description: '외국인 매도량' })
    @IsNumber()
    foreignerSellVolume: number;

    @ApiProperty({ description: '외국인 여부' })
    @IsBoolean()
    hasForeigner: boolean;

    @ApiProperty({ description: '개인 여부' })
    @IsBoolean()
    hasIndividual: boolean;

    @ApiProperty({ description: '기관 여부' })
    @IsBoolean()
    hasInstitution: boolean;

    @ApiProperty({ description: '장중 여부' })
    @IsBoolean()
    inMarketTime: boolean;

    @ApiProperty({ description: '개인 매수량' })
    @IsNumber()
    individualsBuyVolume: number;

    @ApiProperty({ description: '개인 매도량' })
    @IsNumber()
    individualsSellVolume: number;

    @ApiProperty({ description: '기관 매수량' })
    @IsNumber()
    institutionBuyVolume: number;

    @ApiProperty({ description: '기관 매도량' })
    @IsNumber()
    institutionSellVolume: number;

    @ApiProperty({ description: '보험 매수량' })
    @IsNumber()
    insuranceBuyVolume: number;

    @ApiProperty({ description: '보험기타 매수량' })
    @IsNumber()
    insuranceOtherBuyVolume: number;

    @ApiProperty({ description: '순 은행 매수량' })
    @IsNumber()
    netBankBuyVolume: number;

    @ApiProperty({ description: '순 금융투자 매수량' })
    @IsNumber()
    netFinancialInvestmentBuyVolume: number;

    @ApiProperty({ description: '순 외국인 매수량' })
    @IsNumber()
    netForeignerBuyVolume: number;

    @ApiProperty({ description: '순 개인 매수량' })
    @IsNumber()
    netIndividualsBuyVolume: number;

    @ApiProperty({ description: '순 기관 매수량' })
    @IsNumber()
    netInstitutionBuyVolume: number;

    @ApiProperty({ description: '순 보험 매수량' })
    @IsNumber()
    netInsuranceBuyVolume: number;

    @ApiProperty({ description: '순 보험기타 매수량' })
    @IsNumber()
    netInsuranceOtherBuyVolume: number;

    @ApiProperty({ description: '순 기타법인 매수량' })
    @IsNumber()
    netOtherCorporationBuyVolume: number;

    @ApiProperty({ description: '순 기타금융기관 매수량' })
    @IsNumber()
    netOtherFinancialInstitutionsBuyVolume: number;

    @ApiProperty({ description: '순 연기금 매수량' })
    @IsNumber()
    netPensionFundBuyVolume: number;

    @ApiProperty({ description: '순 사모펀드 매수량' })
    @IsNumber()
    netPrivateEquityFundBuyVolume: number;

    @ApiProperty({ description: '순 신탁사모펀드 매수량' })
    @IsNumber()
    netTrustAndPrivateEquityFundBuyVolume: number;

    @ApiProperty({ description: '순 신탁 매수량' })
    @IsNumber()
    netTrustBuyVolume: number;

    @ApiProperty({ description: '기타법인 매수량' })
    @IsNumber()
    otherCorporationBuyVolume: number;

    @ApiProperty({ description: '기타금융기관 매수량' })
    @IsNumber()
    otherFinancialInstitutionsBuyVolume: number;

    @ApiProperty({ description: '연기금 매수량' })
    @IsNumber()
    pensionFundBuyVolume: number;

    @ApiProperty({ description: '사모펀드 매수량' })
    @IsNumber()
    privateEquityFundBuyVolume: number;

    @ApiProperty({ description: '매도 잔고 수량', required: false })
    @IsOptional()
    @IsNumber()
    sellBalanceQuantity: Nullable<number>;

    @ApiProperty({ description: '매도 잔고율', required: false })
    @IsOptional()
    @IsNumber()
    sellBalanceRate: Nullable<number>;

    @ApiProperty({ description: '신탁사모펀드 매수량' })
    @IsNumber()
    trustAndPrivateEquityFundBuyVolume: number;

    @ApiProperty({ description: '신탁 매수량' })
    @IsNumber()
    trustBuyVolume: number;

    @ApiProperty({ description: '업데이트 일시' })
    @IsString()
    updatedAt: string;
}

export class RequestStockScoreRequestDto {
    @ApiProperty({
        description: '종목 심볼 코드 (예: 005930)',
    })
    @IsString()
    stockSymbol: string;

    @ApiProperty({
        description: '종목 이름 (예: 삼성전자)',
    })
    @IsString()
    stockName: string;

    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => TradingTrendDto)
    @ApiProperty({
        type: [TradingTrendDto],
        description: '거래 추세 데이터',
    })
    tradingTrends: TradingTrendDto[];
}
