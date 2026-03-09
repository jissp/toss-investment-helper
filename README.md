# Toss Investment Helper

토스증권(Toss Securities) 사용자의 투자 결정을 돕기 위한 AI 기반 투자 보조 도구입니다. 뉴스 크롤링, AI 분석, 그리고 크롬 확장 프로그램을 통한 실시간 정보를 제공합니다.

## 1. 개요

- **프로젝트명**: Toss Investment Helper
- **주요 기능**:
  - 토스증권 웹 사이트 확장 기능 (Chrome Extension)
    - 종목 분석 추가 (관심 종목 추가/해제 버튼 옆)
      ![img.png](assets/img.png)
  - Gemini AI를 활용한 뉴스 및 종목 분석
  - 구글 RSS 및 네이버 뉴스를 통한 실시간 정보 수집
  - Slack을 통한 분석 결과 알림 및 로그 확인
- **기술 스택**:
  - **Backend**: TypeScript (NestJS), MongoDB, Redis (BullMQ)
  - **Chrome Extension**: Vite, CRXJS, TypeScript
  - **AI**: Gemini AI Integration

---

## 2. Quick Start

### 초기 환경 설정

1. **환경 변수 설정**
   `.env.prod` 파일을 루트 디렉토리에 생성하고 필요한 정보를 입력합니다.
   ```env
   MONGO_DATABASE_URI="mongodb://toss:helper@mongo:27017"

   REDIS_HOST="redis"
   REDIS_PORT=6379
   REDIS_MODE="single"

   STOCK_PLUS_HOST="https://spn.stockplus.com"
   GOOGLE_RSS_BUSINESS="https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtdHZHZ0pMVWlnQVAB?hl=ko&gl=KR&ceid=KR%3Ako"

   NAVER_SEARCH_ENABLE="true"
   NAVER_SEARCH_HOST="https://openapi.naver.com"
   NAVER_SEARCH_CLIENT_ID=""
   NAVER_SEARCH_CLIENT_SECRET=""

   GEMINI_CLI_MODEL="gemini-3-flash-preview"

   SLACK_ENABLE="false"
   SLACK_SIGNING_SECRET=""
   SLACK_BOT_TOKEN=""
   SLACK_APP_TOKEN=""
   SLACK_STOCK_CHANNEL_ID=""
   SLACK_STOCK_GEMINI_LOG_CHANNEL_ID=""
   ```

2. **Docker Build**

   MongoDB와 Redis를 Docker로 실행합니다.
   ```bash
   docker-compose up -d
   ```

3. Gemini Login
   1. Docker Container로 접속
      ```
      docker exec -it [ContainerID] /bin/sh
      ```
   2. gemini 실행 후 절차에 따라 Login

### 크롬 확장 프로그램 빌드 및 설치

1. **확장 프로그램 빌드**
   ```bash
   npm run build:extension
   ```

2. **확장 프로그램 로드**
   - Chrome 브라우저에서 `chrome://extensions/` 접속
   - '압축해제된 확장 프로그램을 로드합니다' (Load unpacked) 클릭
   - 프로젝트 내 `src/extension/dist` 폴더 선택

---

## 3. 주요 기능 소개

### 토스증권 확장 프로그램 (Chrome Extension)

#### AI 뉴스 분석 (AI Analysis)
- **Gemini AI 활용**: 수집된 뉴스의 핵심 내용을 요약하고, 해당 뉴스가 시장이나 특정 종목에 미칠 영향을 분석합니다.
- **마켓/스톡 애널라이저**: 거시적인 시장 상황 분석과 개별 종목 분석을 별도 프로세스로 처리합니다.

### 자동화된 뉴스 수집 (News Crawler)
- **멀티 소스**: 구글 RSS와 네이버 검색 API를 통해 실시간으로 투자 관련 뉴스를 크롤링합니다.
- **스케줄링**: 주기적으로 뉴스를 수집하고 중복을 제거하여 데이터베이스에 저장합니다.
