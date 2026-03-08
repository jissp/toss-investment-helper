## 1. 사전 분석 및 위험 평가 (Analyze)

작업 시작 전, 다음 항목을 반드시 분석하고 사용자에게 보고하세요.

1. **영향 범위 파악**: 신규 모듈을 사용할 다른 모듈들을 파악하고, 기존 모듈(Module), 엔티티(Entity)와의 연관 관계를 분석합니다.
2. **의존성 그래프 설계**: 신규 모듈이 기존 모듈을 참조해야 하는지 결정합니다. (**순환 참조 `forwardRef` 사용 지양**)
3. **작업 규모 산정**: (소/중/대) 분류 및 데이터베이스 마이그레이션 필요 여부를 확인합니다.
4. **승인 절차**: 분석된 범위와 설계 방향을 요약하여 사용자에게 제시하고, **"이대로 설계를 진행할까요?"**라는 질문을 통해 명시적 승인을 받으세요.

## 2. 설계 원칙 (Standard)

NestJS 순수 모듈은 내부 비즈니스 로직을 제공하며, 다른 모듈에서 import하여 사용됩니다. Clean Architecture 원칙에 따라 엄격히 준수합니다.

- **Module Structure**: 모든 모듈은 `src/app/modules/[module-name]` 하위에 위치하며, 독립된 응집도와 재사용성을 가집니다.
- **Layered Responsibility**:
    - **Service**: 단일 책임 원칙(SRP)에 따라 하나의 비즈니스 로직만 담당합니다. (Fat Service 지양)
    - **Schema/Model**: Mongoose 스키마를 정의하여 데이터 구조를 명확히 합니다. (`@app/modules/schemas` 하위에 위치하거나 모듈 내 `schemas/` 디렉토리)
    - **Repository** (선택사항): 데이터 접근 로직이 복잡한 경우, Repository 패턴을 적용할 수 있습니다. (필요한 경우만)
    - **Module**: 의존성 주입 및 다른 모듈에서의 import를 위해 `providers`와 `exports`를 올바르게 설정합니다.
    - **Config**: `ConfigService`를 통한 환경 변수 관리 (`app/configuration.ts` 참조).

### [문서 필수 포함 내용]

1. **Module Structure**: 신규 모듈의 폴더 구조 정의 (schemas, services, module 등).
2. **Implementation Sequence**: 아래 순서를 권장합니다.
    1) Mongoose Schema 정의
    2) 개별 Service 로직 구현 (단일 책임 원칙 준수)
    3) Repository 정의 (필요한 경우)
    4) Module 정의 및 의존성 주입
3. **Module Exports**: 다른 모듈에서 사용할 Service를 명확히 정의합니다.
4. **Success Criteria**: 기능 완료를 확인하기 위한 체크리스트.

## 3. 실행 흐름 (Workflow)

1. **Step 1 (Analyze)**: 코드베이스 탐색 후 작업 범위를 요약 보고.
2. **Step 2 (Ask)**: 설계 진행 여부에 대한 사용자 컨펌.
3. **Step 3 (Document)**: 모듈 구조와 의존성이 반영된 설계 문서 생성 및 저장.