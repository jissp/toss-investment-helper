import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@app/common/types';
import {
    InvestorAnalysis,
    InvestorTrend,
    RequestStockScoreRequestDto,
    Signal,
    SignalLevel,
    StockScoreResponseDto,
    TrendChange,
} from '../dto';

type TradingTrend = RequestStockScoreRequestDto['tradingTrends'][number];

@Injectable()
export class RequestStockInvestorScoreUseCase implements BaseUseCase<
    RequestStockScoreRequestDto,
    StockScoreResponseDto
> {
    // 기관/외인 이탈 시 위험도 가중치
    private readonly institutionalWeights = {
        netForeignerBuyVolume: 1.5,
        netPensionFundBuyVolume: 1.2,
        netFinancialInvestmentBuyVolume: 1.0,
        netBankBuyVolume: 1.0,
        netInsuranceBuyVolume: 0.6,
        netTrustBuyVolume: 0.6,
        netPrivateEquityFundBuyVolume: 0.6,
        netOtherCorporationBuyVolume: 0.5,
        netOtherFinancialInstitutionsBuyVolume: 0.5,
    };

    private readonly individualWeights = {
        netIndividualsBuyVolume: 0.3,
    };

    // 날짜 가중치: index 0 = 가장 최근
    private readonly timeWeights = [1.5, 1.3, 1.0, 0.9, 0.7, 0.6, 0.5];

    execute(payload: RequestStockScoreRequestDto): StockScoreResponseDto {
        const trends = payload.tradingTrends.slice(0, 7);

        const investorAnalysis = {
            individual: this.analyzeInvestor(trends, 'netIndividualsBuyVolume'),
            foreigner: this.analyzeInvestor(trends, 'netForeignerBuyVolume'),
            institution: this.analyzeInvestor(
                trends,
                'netInstitutionBuyVolume',
            ),
            pensionFund: this.analyzeInvestor(
                trends,
                'netPensionFundBuyVolume',
            ),
        };

        const signals = this.detectSignals(trends, investorAnalysis);
        const score = this.calculateScore(trends);

        return {
            stockName: payload.stockName,
            score,
            investorAnalysis,
            signals,
            summary: this.buildSummary(score),
        };
    }

    /**
     * 특정 투자자의 추세, 연속 일수, 방향 전환 여부를 분석합니다.
     */
    private analyzeInvestor(
        trends: TradingTrend[],
        key: keyof TradingTrend,
    ): InvestorAnalysis {
        const todayValue = (trends[0]?.[key] as number) ?? 0;
        const yesterdayValue = trends[1]?.[key] as number | undefined;

        const trend: InvestorTrend = todayValue >= 0 ? 'net_buy' : 'net_sell';

        let consecutiveDays = 0;
        for (const t of trends) {
            const val = t[key] as number;
            const isSameDirection = trend === 'net_buy' ? val >= 0 : val < 0;
            if (isSameDirection) consecutiveDays++;
            else break;
        }

        let trendChange: TrendChange = 'none';
        if (yesterdayValue !== undefined) {
            const yesterdayTrend: InvestorTrend =
                yesterdayValue >= 0 ? 'net_buy' : 'net_sell';
            if (yesterdayTrend !== trend) {
                trendChange =
                    trend === 'net_buy' ? 'sell_to_buy' : 'buy_to_sell';
            }
        }

        return { trend, consecutiveDays, trendChange };
    }

    /**
     * 수급 이상 패턴을 감지하여 시그널 목록으로 반환합니다.
     */
    private detectSignals(
        trends: TradingTrend[],
        investorAnalysis: StockScoreResponseDto['investorAnalysis'],
    ): Signal[] {
        const signals: Signal[] = [];
        const { foreigner, institution, pensionFund, individual } =
            investorAnalysis;

        const push = (level: SignalLevel, message: string) =>
            signals.push({ level, message });

        // ── 외인 ──────────────────────────────────────────────────────────────
        if (foreigner.trend === 'net_sell' && foreigner.consecutiveDays >= 3) {
            push('danger', `외인 ${foreigner.consecutiveDays}일 연속 이탈 중`);
        }
        if (foreigner.trendChange === 'buy_to_sell') {
            push('warning', '외인 매수 → 매도 전환 (이탈 시작 가능성)');
        }
        if (foreigner.trendChange === 'sell_to_buy') {
            push(
                'info',
                '외인 매도 → 매수 전환 (실수급 유입 or 숏커버링, 이유 확인 필요)',
            );
        }
        if (foreigner.trend === 'net_buy' && foreigner.consecutiveDays >= 5) {
            push(
                'info',
                `외인 ${foreigner.consecutiveDays}일 연속 매수 (실수급 vs 숏커버링 여부 별도 확인 권장)`,
            );
        }

        // ── 기관 ──────────────────────────────────────────────────────────────
        if (institution.trend === 'net_sell') {
            const level: SignalLevel =
                institution.consecutiveDays >= 3 ? 'danger' : 'warning';
            push(level, `기관 ${institution.consecutiveDays}일 연속 이탈`);
        }
        if (institution.trendChange === 'sell_to_buy') {
            push('positive', '기관 매도 → 매수 전환 (수급 개선 신호)');
        }
        if (institution.trendChange === 'buy_to_sell') {
            push('warning', '기관 매수 → 매도 전환 (수급 악화 시작)');
        }

        // ── 연기금 ────────────────────────────────────────────────────────────
        if (pensionFund.trend === 'net_sell') {
            const level: SignalLevel =
                pensionFund.consecutiveDays >= 3 ? 'danger' : 'warning';
            push(level, `연기금 ${pensionFund.consecutiveDays}일 연속 이탈`);
        }

        // ── 복합 패턴 ─────────────────────────────────────────────────────────
        if (
            individual.trend === 'net_buy' &&
            foreigner.trend === 'net_sell' &&
            institution.trend === 'net_sell'
        ) {
            push('danger', '개인 주도 매수: 외인·기관 동시 이탈 (설거지 경고)');
        }

        return signals;
    }

    /**
     * 시간 가중치 + 투자자별 위험 가중치 기반으로 수급 위험도 점수(0~10)를 계산합니다.
     */
    private calculateScore(trends: TradingTrend[]): number {
        const timeWeightSum = this.timeWeights.reduce((a, b) => a + b, 0);

        const weightedRiskScore = trends.reduce((acc, trend, idx) => {
            const timeWeight = this.timeWeights[idx];
            type Key = keyof typeof trend;

            const individualRisk = Object.entries(
                this.individualWeights,
            ).reduce((sum, [key, weight]) => {
                const value = trend[key as Key] as number;
                return sum + Math.max(value, 0) * weight;
            }, 0);

            const institutionalRisk = Object.entries(
                this.institutionalWeights,
            ).reduce((sum, [key, weight]) => {
                const value = trend[key as Key] as number;
                return sum + Math.max(-value, 0) * weight;
            }, 0);

            const riskScore = individualRisk + institutionalRisk;

            const totalNetVolume = [
                ...Object.keys(this.individualWeights),
                ...Object.keys(this.institutionalWeights),
            ].reduce((sum, key) => {
                return sum + Math.abs(trend[key as Key] as number);
            }, 0);

            const dailyScore =
                totalNetVolume === 0
                    ? 0
                    : Math.min(
                          Math.max((riskScore / totalNetVolume) * 10, 0),
                          10,
                      );

            return acc + dailyScore * timeWeight;
        }, 0);

        return Number((weightedRiskScore / timeWeightSum).toFixed(2));
    }

    private buildSummary(score: number): string {
        if (score <= 2.0) return '수급 양호: 기관·외인 순매수로 강한 수급 개선';
        if (score <= 4.5) return '수급 긍정: 안정적인 기관·외인 수급 흐름';
        if (score <= 7.0)
            return '수급 주의: 개인 중심 수급, 기관·외인 동향 확인 필요';
        return '수급 위험: 개인 주도 매수, 기관·외인 이탈 신호';
    }
}
