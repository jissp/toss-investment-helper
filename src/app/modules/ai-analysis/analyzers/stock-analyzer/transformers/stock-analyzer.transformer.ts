import { Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import { TradingTrendData } from '@app/common/interfaces';
import { replaceTemplate } from '@app/modules/ai-analysis';
import { STOCK_ANALYZER_PROMPT_TEMPLATE } from '../prompts';

type Args = {
    tradingTrends: TradingTrendData[];
    resultPrompts: string[];
};

@Injectable()
export class StockAnalyzerTransformer implements Pipe<Args, string> {
    transform({ resultPrompts, tradingTrends }: Args): string {
        const currentDate = new Date();

        return replaceTemplate(STOCK_ANALYZER_PROMPT_TEMPLATE, {
            currentDate: currentDate.toISOString(),
            mergedResultPrompts: resultPrompts.join('\n\n'),
            promptForInvestors: this.transformByTradingTrend(tradingTrends),
        });
    }

    private transformByTradingTrend(tradingTrends: TradingTrendData[]) {
        const slicedTradingTrends = tradingTrends.slice(0, 7);

        const prompts = slicedTradingTrends.map(
            ({
                baseDate,
                netIndividualsBuyVolume,
                netForeignerBuyVolume,
                netInstitutionBuyVolume,
                netPensionFundBuyVolume,
            }) => {
                return `- **날짜**: ${baseDate} **개인 순매수량**: ${netIndividualsBuyVolume} **외국인 순매수량**: ${netForeignerBuyVolume} **기관 순매수량**: ${netInstitutionBuyVolume} **연기금 순매수량**: ${netPensionFundBuyVolume}`;
            },
        );

        return prompts.join('\n');
    }
}
