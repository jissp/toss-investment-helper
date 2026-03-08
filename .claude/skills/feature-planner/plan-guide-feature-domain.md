## 1. 사전 분석 및 위험 평가 (Analyze)

작업 시작 전, 다음 항목을 반드시 분석하고 사용자에게 보고하세요.

1. **영향 범위 파악**: 기존 모듈(Module), 엔티티(Entity), 서비스(Service)와의 연관 관계를 분석합니다.
2. **의존성 그래프 설계**: 신규 기능이 기존 모듈을 참조해야 하는지, 혹은 공통 모듈로 분리해야 하는지 결정합니다. (**순환 참조 `forwardRef` 사용 지양**)
3. **작업 규모 산정**: (소/중/대) 분류 및 데이터베이스 마이그레이션 필요 여부를 확인합니다.
4. **승인 절차**: 분석된 범위와 설계 방향을 요약하여 사용자에게 제시하고, **"이대로 설계를 진행할까요?"**라는 질문을 통해 명시적 승인을 받으세요.

## 2. 설계 원칙 (Standard)

Domain 모듈은 API 엔드포인트를 제공하는 기능 단위 모듈입니다. NestJS의 기본 아키텍처와 Clean Architecture 요소를 결합하여 엄격히 준수합니다.

- **Domain-Driven Module**: 모든 기능은 `src/app/modules/domains/[domain-name]` 하위의 도메인 모듈로 분리되어야 하며, 각 도메인은 독립된 응집도를 가집니다.
- **Layered Responsibility**:
    - **Controller**: HTTP 요청 라우팅 및 응답 구조 정의. UseCase를 주입받아 호출합니다.
    - **UseCase**: `BaseUseCase` 인터페이스를 구현하며, 단일 책임 원칙(SRP)에 따라 하나의 비즈니스 유즈케이스만 담당합니다. (Fat Service 지양)
    - **DTO**: `class-validator`를 이용한 입력값 검증 및 타입 정의. `dto/responses`, `dto/requests` 등으로 세분화합니다.
    - **Schema/Model**: Mongoose 스키마를 정의하여 데이터 구조를 명확히 합니다. (`schemas/` 디렉토리 또는 `@app/modules/schemas`)
    - **Repository** (선택사항): 복잡한 데이터 접근 로직이 필요한 경우 Repository 패턴을 적용합니다.
    - **Config**: `ConfigService`를 통한 환경 변수 관리 (`app/configuration.ts` 참조).
- **UseCase Pattern 컨벤션**
    - **DTO 재사용 원칙**: HTTP 요청 DTO를 UseCase에서도 직접 사용
        - ✅ DTO 재사용 (예: CreateKeywordBody 직접 import)
        - ✅ DTO (Payload) 외 Path, Query가 존재하는 경우에는 Params 선언 가능
        - ❌ 위 상황을 제외한 중복 정의 (예: CreateKeywordBody를 재사용해도 되는데 CreateKeywordParams 선언하는 행위)
    - **이유**: 동일한 데이터 구조를 정의하는 것은 불필요한 중복, 검증은 컨트롤러 계층에서 완료됨

### [문서 필수 포함 내용]

1. **Domain Structure**: 신규 도메인의 폴더 구조 정의 (dto, use-cases, controller, schemas, module 등).
2. **Implementation Sequence**: 아래 순서를 권장합니다.
    1) Mongoose Schema 정의
    2) DTO(Request/Response) 정의
    3) 개별 UseCase 로직 구현
    4) Repository 정의 (필요한 경우)
    5) Controller 및 API 명세
    6) Module 정의 및 의존성 주입
3. **Success Criteria**: 기능 완료를 확인하기 위한 체크리스트.

## 3. 실행 흐름 (Workflow)

1. **Step 1 (Analyze)**: 코드베이스 탐색 후 작업 범위를 요약 보고.
2. **Step 2 (Ask)**: 설계 진행 여부에 대한 사용자 컨펌.
3. **Step 3 (Document)**: 의존성 계층 구조가 반영된 설계 문서 생성 및 저장.