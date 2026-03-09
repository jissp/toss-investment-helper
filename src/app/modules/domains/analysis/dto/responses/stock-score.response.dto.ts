import { ApiProperty } from '@nestjs/swagger';

export type InvestorTrend = 'net_buy' | 'net_sell';
export type TrendChange = 'sell_to_buy' | 'buy_to_sell' | 'none';
export type SignalLevel = 'positive' | 'info' | 'warning' | 'danger';

export interface InvestorAnalysis {
    /** 오늘 기준 순매수/순매도 방향 */
    trend: InvestorTrend;
    /** 같은 방향이 연속된 일수 */
    consecutiveDays: number;
    /** 어제 대비 방향 전환 여부 */
    trendChange: TrendChange;
}

export interface Signal {
    level: SignalLevel;
    message: string;
}

export class StockScoreResponseDto {
    @ApiProperty({
        type: String,
        description: '종목명',
    })
    stockName: string;

    @ApiProperty({
        type: Number,
        description: '수급 위험도 점수 (0~10, 낮을수록 수급 좋음)',
    })
    score: number;

    @ApiProperty({
        description: '투자자별 수급 동향 분석',
    })
    investorAnalysis: {
        individual: InvestorAnalysis;
        foreigner: InvestorAnalysis;
        institution: InvestorAnalysis;
        pensionFund: InvestorAnalysis;
    };

    @ApiProperty({
        description: '감지된 수급 패턴 시그널 목록',
    })
    signals: Signal[];

    @ApiProperty({
        type: String,
        description: '종합 수급 해석',
    })
    summary: string;
}
