import { Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import { replaceTemplate } from '@app/modules/ai-analysis';
import { STOCK_ISSUE_PROMPT_TEMPLATE } from '../prompts';

type Args = {
    stockName: string;
};

@Injectable()
export class StockIssueTransformer implements Pipe<Args, string> {
    transform({ stockName }: Args): string {
        const currentDate = new Date();

        return replaceTemplate(STOCK_ISSUE_PROMPT_TEMPLATE, {
            currentDate: currentDate.toISOString(),
            stockName,
        });
    }
}
