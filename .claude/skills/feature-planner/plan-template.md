---
template: plan
version: 1.6
description: Architecture-Aware Design Template (Support Pure/Domain/Hybrid)
variables:
  - feature: Feature name
  - date: Creation date (YYYY-MM-DD)
  - project: Project name
---

# [설계] {{feature}}

## 1. 작업 개요
- **작성일**: {{date}}
- **모듈 정보**:
    - **위치**: `src/app/modules/...`
    - **유형**:
        - [ ] **NestJS 순수 모듈** (내부 비즈니스 로직 / Cron / Worker - Controller/DTO 미사용)
        - [ ] **Domain API 모듈** (외부 API 엔드포인트 제공 - Controller/DTO 사용)
- **아키텍처 패턴**:
    - [ ] **Clean Architecture (UseCase 중심)**: 유즈케이스 단위의 독립적인 비즈니스 로직
    - [ ] **3-Tier Architecture (Service 중심)**: 단순 CRUD 또는 일반적인 서비스 계층 구조
    - [ ] **Hybrid**: 서비스와 유즈케이스 혼합 (예: `order-collector` 방식)

## 2. 시스템 아키텍처 (System Architecture)

### 2.1 데이터 흐름 (Data Flow)
[로직의 시작부터 끝까지 데이터가 어떻게 흐르는지 순차적으로 기술합니다.]
1. **Trigger**: [예: Cron Job 실행, Controller API 호출, Queue Message 수신]
2. **Input/State Check**: [예: 작업 대상 조회 또는 이전 상태 확인]
3. **Core Process**: [핵심 비즈니스 로직 단계 기술]
4. **Side Effects / Output**: [결과물 및 상태 변화 (DB 업데이트, 큐 등록 등)]

### 2.2 주요 컴포넌트 및 역할
- **`[Name]UseCase` / `Service`**: [핵심 로직 담당 및 비즈니스 규칙 처리]
- **`[Name]Repository` / `Schema`**: [데이터 영속성 및 저장소 접근 담당 (필요 시)]
- **`[Name]Controller` / `DTO`**: [Domain 모듈인 경우에만 HTTP 진입점 및 검증 담당]

## 3. 상세 설계 (Detailed Design)

### 3.1 모듈 구조 (Directory Tree)
*해당 모듈 유형에 필요한 항목만 선택하여 구현합니다. 불필요한 레이어는 생성하지 않습니다.*
```text
[module-name]/
├── use-cases/          # (선택) 복잡한 비즈니스 로직 단위 (Clean Arch/Hybrid)
├── services/           # (선택) 범용 도메인 기능 또는 단순 로직 (3-Tier/Hybrid)
├── dto/                # [Domain 모듈 필수] API 요청/응답 정의
│   ├── requests/
│   └── responses/
├── schemas/            # (선택) Mongoose 스키마 및 모델
├── [module].controller.ts # [Domain 모듈 필수] HTTP 라우팅 및 진입점
├── [module].types.ts      # 상수, Enum, 인터페이스 정의
├── [module].module.ts     # 의존성 주입(DI) 및 모듈 구성
└── index.ts               # Public API Export (모듈 외부에서 접근할 심볼 정의)
```

### 3.2 인프라 및 통신 규격 (Infra & Contract)
- **Queue/Message**: [Queue Name, Job Name, Retry Strategy (BullMQ 등)]
- **External Interface**: [연동할 외부 API 엔드포인트 또는 시스템 인터페이스]

## 4. 안정성 및 예외 처리 (Reliability)
- **멱등성(Idempotency)**: [중복 실행 시 데이터 정합성 보장 전략]
- **에러 핸들링**: [실패 시 재시도 전략 또는 폴백(Fallback) 로직]
- **성능 최적화**: [Batch 처리, 타임아웃, 리소스 제한 등 고려 사항]

## 5. 작업 진행 순서 (Implementation Sequence)

1. [ ] **Phase 1: 데이터 기반 정의** (Types, Constants, Schema 정의)
2. [ ] **Phase 2: 핵심 비즈니스 로직** (UseCase 또는 Service 구현)
    - *NestJS 순수 모듈/Worker는 여기서 핵심 로직 완료*
3. [ ] **Phase 3: 인터페이스 정의 (Domain 모듈 전용)** (DTO 및 Controller 구현)
4. [ ] **Phase 4: 인프라 연동 및 모듈 통합** (Module 등록, Queue/Provider 설정)
5. [ ] **Phase 5: 검증 및 문서화** (테스트 수행 및 Swagger/README 업데이트)

## 6. Definition of Done (검증 항목)
- [ ] 모듈 유형(Pure/Domain)에 적합한 아키텍처 패턴 적용 확인
- [ ] 불필요한 레이어(순수 모듈에서의 Controller/DTO 등) 생성 여부 점검
- [ ] 핵심 비즈니스 시나리오 및 예외 케이스 동작 확인
- [ ] `index.ts`를 통한 명시적인 Export 리스트 확인

## 7. 향후 과제 (Roadmap)
- [ ] [현재 구현 범위에서 제외된 고도화 필요 항목]
