import { Pipe } from '@common/types';
import { TradingTrendData } from '@app/common/interfaces';
import { replaceTemplate } from '../../../common';
import { STOCK_ANALYZER_PROMPT_TEMPLATE } from '../prompts';

type Args = {
    tradingTrends: TradingTrendData[];
    resultPrompts: string[];
};

export class StockAnalyzerTransformer implements Pipe<Args, string> {
    transform({ resultPrompts }: Args): string {
        const currentDate = new Date();

        return replaceTemplate(STOCK_ANALYZER_PROMPT_TEMPLATE, {
            currentDate: currentDate.toISOString(),
            mergedResultPrompts: resultPrompts.join('\n\n'),
        });
    }
}
