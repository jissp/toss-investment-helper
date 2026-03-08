import { ApiProperty } from '@nestjs/swagger';

export class AnalysisReportResponseDto {
    @ApiProperty()
    _id: string;

    @ApiProperty()
    reportType: string;

    @ApiProperty()
    reportTarget: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    createdAt: Date;
}
