import { Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import { IndexCode } from '@app/common/interfaces';
import { replaceTemplate } from '@app/modules/ai-analysis/common';
import { MarketIndexItemDto } from '@app/modules/domains/ai-analysis-domain/dto/requests';
import { GLOBAL_INDEX_PROMPT_TEMPLATE } from '../prompts';

type TransformerArgs = {
    indices: MarketIndexItemDto[];
};

@Injectable()
export class GlobalIndexTransformer implements Pipe<TransformerArgs, string> {
    private readonly allowCodes = [
        IndexCode.KOSPI,
        IndexCode.KOSDAQ,
        IndexCode.NASDAQ,
        IndexCode['나스닥100 선물'],
        IndexCode.INDEXSP,
        IndexCode.VIX,
        IndexCode.DJI,
    ];

    /**
     * @param name
     * @param indices
     */
    transform({ indices }: TransformerArgs): string {
        const filteredIndices = this.filterIndices(indices);

        return replaceTemplate(GLOBAL_INDEX_PROMPT_TEMPLATE, {
            currentDate: new Date().toISOString(),
            indexListPrompt: this.transformForIndices(filteredIndices),
        });
    }

    private transformForIndices(indices: MarketIndexItemDto[]): string {
        const indexPrompts = indices.map(
            ({ displayName, latestPrice }) => `${displayName}: ${latestPrice}`,
        );

        return indexPrompts.join('\n');
    }

    private filterIndices(indices: MarketIndexItemDto[]) {
        return indices.filter(({ code }) => this.allowCodes.includes(code));
    }
}
