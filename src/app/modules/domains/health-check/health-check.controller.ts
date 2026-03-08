import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation } from '@nestjs/swagger';

@Controller('health-check')
export class HealthCheckController {
    @Get()
    @HttpCode(204)
    @ApiOperation({
        summary: '헬스 체크',
        description: '서버의 상태를 체크합니다.',
    })
    @ApiNoContentResponse({
        description: '헬스체크 성공',
    })
    healthCheck() {
        console.log('Health check successful');

        return {
            data: 'ok',
        };
    }
}
