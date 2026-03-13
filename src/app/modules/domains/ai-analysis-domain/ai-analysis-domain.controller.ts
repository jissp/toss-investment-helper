import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import {
    AnalysisReportResponseDto,
    AnalysisReportsListResponseDto,
    RequestStockAnalysisRequestDto,
} from './dto';
import {
    GetAnalysisReportUseCase,
    ListAnalysisReportsUseCase,
    RequestLatestNewsAnalysisUseCase,
    RequestStockAnalysisUseCase,
} from './use-cases';

@ApiTags('AI Analysis Request')
@Controller('v1/ai-analysis')
export class AiAnalysisDomainController {
    constructor(
        private readonly requestStockAnalysisUseCase: RequestStockAnalysisUseCase,
        private readonly requestLatestNewsAnalysisUseCase: RequestLatestNewsAnalysisUseCase,
        private readonly getAnalysisReportUseCase: GetAnalysisReportUseCase,
        private readonly listAnalysisReportsUseCase: ListAnalysisReportsUseCase,
    ) {}

    @Post('stock')
    @HttpCode(201)
    @ApiOperation({
        summary: '특정 종목 분석 요청',
        description: '특정 종목에 대한 AI 분석을 요청합니다.',
    })
    @ApiCreatedResponse({
        description: '분석 요청이 등록되었습니다.',
    })
    @ApiBadRequestResponse({
        description: '요청 데이터 검증 실패',
    })
    async requestStockAnalysis(
        @Body() body: RequestStockAnalysisRequestDto,
    ): Promise<void> {
        await this.requestStockAnalysisUseCase.execute(body);
    }

    @Post('latest-news')
    @HttpCode(201)
    @ApiOperation({
        summary: '최신 뉴스 정보 요약',
        description: '최신 뉴스 정보를 요약합니다.',
    })
    @ApiCreatedResponse({
        description: '분석 요청이 등록되었습니다.',
    })
    @ApiBadRequestResponse({
        description: '요청 데이터 검증 실패',
    })
    async requestLatestNewsAnalysis(): Promise<void> {
        await this.requestLatestNewsAnalysisUseCase.execute();
    }

    @Get('reports/:reportType/:reportTarget')
    @ApiOperation({
        summary: '분석 리포트 조회',
        description: '특정 종목 또는 시장의 분석 리포트를 조회합니다.',
    })
    @ApiOkResponse({
        type: AnalysisReportResponseDto,
        description: '분석 리포트 조회 성공',
    })
    @ApiNotFoundResponse({
        description: '분석 리포트를 찾을 수 없음',
    })
    async getAnalysisReport(
        @Param('reportType') reportType: string,
        @Param('reportTarget') reportTarget: string,
    ): Promise<AnalysisReportResponseDto> {
        return this.getAnalysisReportUseCase.execute({
            reportType,
            reportTarget,
        });
    }

    @Get('reports')
    @ApiOperation({
        summary: '분석 리포트 목록 조회',
        description: '분석 리포트 목록을 조회합니다.',
    })
    @ApiOkResponse({
        type: AnalysisReportsListResponseDto,
        description: '분석 리포트 목록 조회 성공',
    })
    async listAnalysisReports(
        @Query('reportType') reportType: string,
        @Query('limit') limit?: number,
    ): Promise<AnalysisReportsListResponseDto> {
        return this.listAnalysisReportsUseCase.execute({
            reportType,
            limit,
        });
    }
}
