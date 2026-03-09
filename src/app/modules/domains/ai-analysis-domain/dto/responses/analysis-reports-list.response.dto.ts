import { ApiProperty } from '@nestjs/swagger';
import { AnalysisReportResponseDto } from './analysis-report.response.dto';

export class AnalysisReportsListResponseDto {
    @ApiProperty({
        type: [AnalysisReportResponseDto],
    })
    reports: AnalysisReportResponseDto[];

    @ApiProperty()
    total: number;
}
