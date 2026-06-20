# 🗄️ 데이터베이스 정의서 (`database_schema.md`)

이 문서는 **Timo** 애플리케이션의 영속성 데이터 저장 구조 및 로컬 키-값 저장소 명세를 다룹니다.

> [!NOTE]
> **Timo는 원격 데이터베이스(DBMS)를 운용하지 않으며, 로컬 샌드박스 보안 스토리지인 AsyncStorage를 메인 데이터 저장소로 채택하고 있습니다.**
>
> 관계형 테이블 구조(PK, FK) 대신, 단일 레벨 키-밸류(Key-Value) 구조로 설정 정보를 관리합니다.

---

## 🗃️ 영속 데이터 저장소 개요

*   **데이터베이스 엔진:** `@react-native-async-storage/async-storage`
*   **스토리지 메커니즘:** SQLite 기반의 플랫폼별 로컬 영속 스토리지 매핑 (iOS: 디렉토리 기반 인덱스 스토리지, Android: SQLite 백엔드)
*   **보안 범위:** 타 앱에 의해 침범될 수 없는 Timo 고유 샌드박스 내부 스토리지

---

## 🔑 AsyncStorage 키 정의 및 데이터 스키마

Timo의 설정 정보는 아래의 스키마에 따라 키-밸류 데이터 형태로 저장 및 관리됩니다.

### 1. 사용자 설정 데이터 명세

| 키 이름 (Storage Key) | 데이터 타입 | 기본값 (Default) | 유효성 조건 (Validation) | 상세 설명 |
| :--- | :--- | :--- | :--- | :--- |
| `timo_agency_name` | `string` | `""` | 최대 20자 이내 (유니코드 대응) | 조사 및 점검을 수행하는 소속 기관 또는 회사명 |
| `timo_inspector_name` | `string` | `""` | 최대 10자 이내 (유니코드 대응) | 현장 실무 및 점검 담당자의 이름 |
| `timo_comment` | `string` | `""` | 최대 20자 이내 (유니코드 대응) | 세부 현장 상태 정보 또는 추가 기입 메모 사항 |
| `timo_location_enabled` | `boolean` (문자열 `"true"`/`"false"`로 보관) | `true` | `true` 또는 `false` | 실시간 GPS 추적 활성화 및 오버레이 주소 렌더링 여부 |
| `timo_metadata_background_enabled` | `boolean` (문자열 `"true"`/`"false"`로 보관) | `true` | `true` 또는 `false` | 워터마크 텍스트 및 주소 텍스트 박스의 블랙 반투명 배경 상자 표시 여부 |

---

## 📐 제약 조건 및 유효성 검사 로직

사용자가 부적절하게 긴 문자열을 입력하여 촬영 본의 시인성을 저해하는 것을 예방하기 위해, 로컬에서 입력 문자열 바이트 단위의 잘라내기 검증을 진행합니다.

1.  **유니코드 기준 글자수 계산 (`src/utils/unicode.ts`):**
    *   일반적인 JavaScript `.length` 속성은 복합 유니코드 기호나 이모지(Emoji) 입력 시 실제 눈으로 보이는 글자수보다 크게 리턴되는 왜곡(Surrogate Pair) 현상이 발생합니다.
    *   Timo는 `Intl.Segmenter` API를 활용하여 사용자가 입력한 문자열을 올바른 유니코드 조합 글자수로 정확하게 슬라이싱 및 검증합니다.
2.  **데이터 입력 상한선:**
    *   **기관명 (`agencyName`):** 최대 20자
    *   **담당자명 (`inspectorName`):** 최대 10자
    *   **메모 (`comment`):** 최대 20자
