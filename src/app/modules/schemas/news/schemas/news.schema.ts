import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import mongoose from 'mongoose';

@Schema({
    collection: 'news',
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class News {
    @Prop({ type: String, required: true, unique: true, maxlength: 500 })
    @ApiProperty({ description: '뉴스 ID' })
    articleId!: string;

    @Prop({ type: String, required: false, maxlength: 255 })
    @ApiProperty({ description: '뉴스 출처', nullable: true })
    category?: string;

    @Prop({ type: String, required: true, maxlength: 500 })
    @ApiProperty({ description: '뉴스 제목' })
    title!: string;

    @Prop({ type: String, required: false })
    @ApiProperty({ description: '뉴스 내용', nullable: true })
    description?: string;

    @Prop({ type: String, required: false, maxlength: 1000 })
    @ApiProperty({ description: '뉴스 링크', nullable: true })
    link?: string;

    @Prop({ type: Date, required: true })
    @ApiProperty({ type: Date, description: '뉴스기사 작성일' })
    publishedAt!: Date;

    @Prop({ type: Date, default: Date.now })
    @ApiProperty({ type: Date, description: '생성일' })
    createdAt!: Date;

    @Prop({ type: Date, required: false })
    @ApiPropertyOptional({ type: Date, description: '수정일' })
    updatedAt?: Date | null;
}

export const NewsSchema = SchemaFactory.createForClass(News);

NewsSchema.index({
    category: 1,
});
NewsSchema.index(
    {
        createdAt: 1,
    },
    {
        expires: 86400 * 5,
    },
);

export type NewsDto = Omit<
    News,
    keyof mongoose.Document | 'createdAt' | 'updatedAt'
>;
