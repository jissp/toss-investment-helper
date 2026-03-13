import { ApiProperty } from '@nestjs/swagger';
import type { Nullable } from '@common/types';

export class AnalysisReportResponseDto {
    @ApiProperty({
        type: String,
        description: '리포트 ID',
    })
    _id: string;

    @ApiProperty({
        type: String,
        description: '리포트 유형',
    })
    reportType: string;

    @ApiProperty({
        type: String,
        description: '분석 대상',
        nullable: true,
    })
    reportTarget: Nullable<string> = null;

    @ApiProperty({
        type: String,
        description: '리포트 제목',
    })
    title: string;

    @ApiProperty({
        type: String,
        description: 'AI 분석 내용',
    })
    content: string;

    @ApiProperty({
        type: Date,
        description: '생성일',
    })
    createdAt: Date;
}
