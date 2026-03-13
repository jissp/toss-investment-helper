import { ApiProperty } from '@nestjs/swagger';
import { AnalysisReportResponseDto } from './analysis-report.response.dto';

export class AnalysisReportsListResponseDto {
    @ApiProperty({
        type: [AnalysisReportResponseDto],
        description: '분석 리포트 목록',
    })
    reports: AnalysisReportResponseDto[];

    @ApiProperty({
        type: Number,
        description: '리포트 총 개수',
    })
    total: number;
}
