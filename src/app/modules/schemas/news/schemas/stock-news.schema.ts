import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'stock_news' })
export class StockNews {
    @Prop({ type: String, required: true, maxlength: 32 })
    stockCode!: string;

    @Prop({ type: String, required: true, unique: true, maxlength: 255 })
    articleId!: string;

    @Prop({ type: String, required: true, maxlength: 255 })
    category!: string;

    @Prop({ type: String, required: true, maxlength: 500 })
    title!: string;

    @Prop({ type: String, required: false })
    description?: string;

    @Prop({ type: String, required: false, maxlength: 500 })
    link?: string;

    @Prop({ type: Date, required: true })
    publishedAt!: Date;

    @Prop({ type: Date, default: Date.now })
    createdAt!: Date;
}

export const StockNewsSchema = SchemaFactory.createForClass(StockNews);
StockNewsSchema.index({
    category: 1,
});
StockNewsSchema.index(
    {
        createdAt: 1,
    },
    {
        expires: 86400 * 5,
    },
);
