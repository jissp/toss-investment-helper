import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestStockScoreRequestDto, StockScoreResponseDto } from './dto';
import { RequestStockInvestorScoreUseCase } from './use-cases';

@ApiTags('AI Analysis Request')
@Controller('v1/analysis')
export class AnalysisDomainController {
    constructor(
        private readonly requestStockInvestorScoreUseCase: RequestStockInvestorScoreUseCase,
    ) {}

    @Post('stock-scores')
    @HttpCode(201)
    @ApiOperation({
        summary: '종목의 수급 점수 요청',
        description: '특정 종목의 수급 점수를 요청합니다.',
    })
    @ApiOkResponse({
        type: StockScoreResponseDto,
    })
    requestStockScore(
        @Body() body: RequestStockScoreRequestDto,
    ): StockScoreResponseDto {
        return this.requestStockInvestorScoreUseCase.execute(body);
    }
}
