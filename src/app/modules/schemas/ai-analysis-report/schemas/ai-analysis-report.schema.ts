import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
    collection: 'ai_analysis_reports',
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class AiAnalysisReport {
    /**
     * 리포트 유형
     */
    @Prop({ type: String, required: true })
    @ApiProperty({
        type: String,
        description: '리포트 유형',
    })
    reportType!: string;

    /**
     * 분석 대상
     */
    @Prop({ type: String, required: true, maxlength: 255 })
    @ApiProperty({
        type: String,
        description: '분석 대상',
    })
    reportTarget!: string;

    /**
     * 리포트 제목
     */
    @Prop({ type: String, required: true, maxlength: 255 })
    @ApiProperty({
        description: '리포트 제목',
    })
    title!: string;

    /**
     * AI 분석 내용
     */
    @Prop({ type: String, required: true })
    @ApiProperty({
        description: 'AI 분석 내용',
    })
    content!: string;

    @Prop({ type: Date, default: Date.now })
    @ApiProperty({ type: Date, description: '생성일' })
    createdAt!: Date;
}

export const AiAnalysisReportSchema =
    SchemaFactory.createForClass(AiAnalysisReport);
