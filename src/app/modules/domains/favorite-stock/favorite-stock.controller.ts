import { Body, Controller, HttpCode, Put } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiNoContentResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { PutFavoriteStocksRequestDto } from './dto';
import { PutFavoriteStocksUseCase } from './use-cases';

@ApiTags('Favorite Stocks')
@Controller('v1/favorite-stocks')
export class FavoriteStockController {
    constructor(
        private readonly putFavoriteStocksUseCase: PutFavoriteStocksUseCase,
    ) {}

    @Put()
    @HttpCode(204)
    @ApiOperation({
        summary: '관심 종목 업데이트',
        description:
            '가장 최신 관심 종목 데이터로 전체 데이터를 업데이트합니다.',
    })
    @ApiNoContentResponse({
        description: '업데이트 성공',
    })
    @ApiBadRequestResponse({
        description: '요청 데이터 검증 실패',
    })
    async putFavoriteStocks(
        @Body() body: PutFavoriteStocksRequestDto,
    ): Promise<void> {
        await this.putFavoriteStocksUseCase.execute(body);
    }
}
