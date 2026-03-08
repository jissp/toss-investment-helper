---
description: Controller의 메서드를 extension API Client 패턴으로 변환합니다.
---

도메인 모듈의 API들을 분석하여 크롬 확장 프로그램의 API Client에 기능을 추가하세요.

# 필수 사항
1. 반드시 지침 사항을 순서대로 실행하세요.

# 지침 사항
1. 도메인 모듈읠 API 목록을 확인하고 분석하세요.
2. 크롬 확장 프로그램의 API 클라이언트 파일을 확인하고 분석하세요.
3. 존재하지 않은 API가 존재할 경우 API 클라이언트에 API 호출 메소드를 추가하세요.

# 참고

## 디렉토리 구조

### 도메인 모듈
NestJS에 클린 아키텍처 UseCase 패턴을 도입한 구조를 가지고 있습니다.

- 도메인 모듈 디렉토리: src/app/modules/domains/[domain]
- 컨트롤러: [도메인 모듈 디렉토리]/*.controller.ts

### 크롬 확장 프로그램

- 크롬 확장 프로그램 디렉토리: src/extension/src
- API 클라이언트 파일: [크롬 확장 프로그램 디렉토리]/common/utils/api.ts

## 예시

### AS-IS (도메인 모듈 API)
```typescript
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

```

### TO-BE (API 클라이언트)

```typescript
import type { PutFavoriteStocksRequestDto } from '@app/modules/domains/favorite-stock';

class ApiClient {
  public async putFavoriteStocks(body: PutFavoriteStocksRequestDto) {
    return this.http.request('POST', '/v1/favorite-stocks', {
      body: JSON.stringify(body),
      timeout: 3000,
    });
  }
}
```