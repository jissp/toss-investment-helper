import { Injectable } from '@nestjs/common';
import { Pipe } from '@common/types';
import { StockAnalyzerTransformer } from './analyzer/stock-analyzer/transformers';

@Injectable()
export class AggregateTransformerFactory {
    private readonly transformers = {
        [StockAnalyzerTransformer.name]: StockAnalyzerTransformer,
    };

    public getTransformer(name: string): Pipe<any, string> {
        const TransformerClass = this.transformers[name];

        if (!TransformerClass) {
            throw new Error(
                `[AggregateTransformerFactory] '${name}'에 해당하는 Transformer를 찾을 수 없습니다.`,
            );
        }

        return new TransformerClass();
    }
}
