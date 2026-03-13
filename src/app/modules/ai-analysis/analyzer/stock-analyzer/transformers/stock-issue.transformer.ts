import { Pipe } from '@common/types';
import { replaceTemplate } from '../../../common';
import { STOCK_ISSUE_PROMPT_TEMPLATE } from '../prompts';

type Args = {
    stockName: string;
};

export class StockIssueTransformer implements Pipe<Args, string> {
    transform({ stockName }: Args): string {
        const currentDate = new Date();

        return replaceTemplate(STOCK_ISSUE_PROMPT_TEMPLATE, {
            currentDate: currentDate.toISOString(),
            stockName,
        });
    }
}
