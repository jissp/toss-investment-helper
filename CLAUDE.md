# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

토스증권 사용자의 투자 결정을 돕는 AI 기반 투자 보조 도구.

- **NestJS 백엔드**: 뉴스 크롤링, Gemini AI 분석, Slack 알림
- **Chrome Extension**: Vite + CRXJS 기반, 토스증권 페이지에 UI 주입
- **인프라**: MongoDB(데이터 저장), Redis/BullMQ(비동기 작업 큐)

## 명령어

```bash
# 개발 서버 (dotenv -e .env 사용)
npm run start:dev

# 빌드
npm run build

# 크롬 확장 프로그램 빌드 → src/extension/dist
npm run build:extension

# 테스트
npm run test
npm run test:watch
npm run test:cov

# E2E 테스트
npm run test:e2e

# 단일 테스트 파일 실행
npx jest src/modules/rss-reader/tests/rss-reader.spec.ts

# 린트 (자동 수정 포함)
npm run lint

# Docker (MongoDB + Redis 실행)
docker-compose up -d
```

## 아키텍처

### 디렉토리 구조

```
src/
├── app/                    # NestJS 앱 코어 (AppModule, configuration)
│   ├── common/             # 공통 타입, 유틸 (BaseUseCase 인터페이스 등)
│   └── modules/
│       ├── domains/        # HTTP 엔드포인트 (Controller → UseCase 패턴)
│       │   ├── ai-analysis-domain/   # AI 분석 요청/조회 API
│       │   ├── analysis/             # 수급 점수 계산 API
│       │   └── favorite-stock/       # 관심 종목 관리 API
│       ├── ai-analysis/    # AI 분석 비즈니스 로직 (BullMQ Flow 조율)
│       │   └── analyzers/  # stock-analyzer, market-analyzer
│       ├── news-crawler/   # 뉴스 크롤링 스케줄러 + BullMQ 프로세서
│       └── schemas/        # Mongoose 스키마 + 서비스 (news, favorite-stock, ai-analysis-report)
├── modules/                # 재사용 인프라 모듈
│   ├── gemini-cli/         # Gemini CLI 프로세스 스폰 래퍼
│   ├── queue/              # BullMQ 추상화 (QueueModule.forFeature)
│   ├── redis/              # Redis 연결 + @Cacheable 데코레이터
│   ├── slack/              # Slack 알림 서비스
│   ├── naver/              # 네이버 검색 API 클라이언트
│   ├── google-rss/         # 구글 RSS 클라이언트
│   └── rss-reader/         # RSS XML 파싱
└── extension/              # Chrome Extension (별도 Vite 빌드)
    └── src/
        ├── background/     # Service Worker
        └── content/        # 토스증권 페이지 DOM 조작, UseCase 패턴
```

### 핵심 패턴

**UseCase 패턴**: 모든 비즈니스 로직은 `BaseUseCase<T, R>` 인터페이스를 구현하는 UseCase 클래스에 위치. Controller는 UseCase만 호출.

**BullMQ Flow**: AI 분석 요청은 `AiAnalysisService` → `FlowProducer`를 통해 비동기 처리.

- 부모 Job(`RequestAnalysisFlow`) → 자식 Job(`PromptToGeminiCli`) 구조
- `QueueModule.forFeature({ queueTypes, flowTypes })` 로 모듈별 큐 등록

**Path Aliases** (tsconfig 기준):

- `@app/*` → `src/app/*`
- `@modules/*` → `src/modules/*`
- `@common/*` → `src/common/*`

### AI 분석 흐름

1. HTTP POST `/v1/ai-analysis/stock` 또는 `/v1/ai-analysis/market`
2. `AiAnalysisDomainController` → `RequestStockAnalysisUseCase`
3. `AiAnalysisService.requestStockAnalysis()` → `AdapterFactory`로 적절한 Adapter 선택
4. `StockAnalyzerAdapter` / `MarketAnalyzerAdapter` → BullMQ Children Jobs 생성
5. `PromptToGeminiCliProcessor` → `GeminiCliService.requestPrompt()` 실행 (gemini CLI 프로세스 스폰)
6. 분석 결과 MongoDB(`AiAnalysisReport`) 저장 + Slack 알림

### Chrome Extension ↔ Backend 통신

- Content Script가 토스증권 페이지(`toss.im/securities`) DOM에 버튼/섹션 주입
- `BackendApiService`를 통해 로컬 백엔드(`localhost:3000`) API 호출
- Background Service Worker와 Chrome Message Passing으로 통신

## 환경 설정

`.env` 파일 필수 (개발: `.env`, 프로덕션: `.env.prod`). 모든 환경변수는 `src/app/configuration.ts`에서 관리. 모든 환경변수가 존재하지 않으면 앱 기동 시
`NotFoundException` 발생.

Gemini 사용을 위해 `gemini` CLI가 설치되어 있어야 하며, Docker 환경에서는 컨테이너 내에서 별도 로그인 필요.