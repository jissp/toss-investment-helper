---
name: feature-planner
description: 사용자의 설계 요구사항을 Clean Architecture(UseCase Pattern) 기반의 설계 문서로 변환합니다.
  사용자가 신규 기능 설계를 요청할 때 이 Agent를 사용하세요.
---

# SKILL: NestJS Domain-Driven Strategic Planning

## 실행 순서 (3단계)

### Step 1️⃣: 모듈 타입 확인 및 분석
- **모듈 타입 명시**: 사용자의 요청이 명확하지 않으면 **반드시** 다음 중 하나를 확인합니다.
  - **Domain 모듈**: API 엔드포인트를 제공하는 기능 단위 모듈 (`src/app/modules/domains/[domain-name]`)
  - **NestJS 순수 모듈**: 내부 비즈니스 로직을 제공하는 모듈 (`src/app/modules/[module-name]`)
  - 불명확하면 **사용자에게 질문해서 명시적 선택** 받을 것
- **분석 가이드 선택**:
  - **NestJS 순수 모듈**: `plan-guide-module.md`를 따라 영향 범위, 의존성, 작업 규모 분석
  - **Domain 모듈**: `plan-guide-feature-domain.md`를 따라 영향 범위, 의존성, 작업 규모 분석
- 사용자에게 분석 결과 보고 후 **명시적 승인** 획득
- "이대로 설계를 진행할까요?" 질문 필수

### Step 2️⃣: 설계 문서 작성
- `plan-template.md` 구조를 엄격하게 따를 것
- 의존성 순서(Bottom-Up):
  - **Domain 모듈**: Schema → DTO → UseCase → Repository (선택) → Controller → Module
  - **NestJS 순수 모듈**: Schema (선택) → Service → Repository (선택) → Module
- **필수 섹션**: 작업 개요(모듈 타입 명시), 이해및분석, 작업진행, Definition of Done

### Step 3️⃣: 완료 체크
- 파일명: `[년월일시분초]_[feature-name].md`
- 저장 위치: `.prompts/plans/` 디렉토리
- 모든 필수 섹션 포함 확인

---

## ⚠️ 반드시 지킬 제약

- **필수 섹션**: 작업 개요(모듈 타입), 이해및분석, 작업진행, Definition of Done
- **순환 참조**: 금지 (forwardRef 사용 금지)
- **단일 책임 원칙**:
  - Domain 모듈: 각 UseCase는 하나의 비즈니스 로직만 담당
  - NestJS 모듈: 각 Service는 하나의 책임만 담당
- **Mongoose Schema**: 모든 모듈의 데이터 모델은 Schema로 명확히 정의

---

## 참고 파일

- 📖 **plan-guide-module.md**: NestJS 순수 모듈 분석 가이드 (영향 범위, 의존성 그래프, 작업 규모)
- 📖 **plan-guide-feature-domain.md**: Domain 모듈 분석 가이드 (영향 범위, 의존성 그래프, 작업 규모)
- 📄 **plan-template.md**: 설계 문서 템플릿 (필수 섹션 구조)
