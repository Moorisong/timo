# Sub-Agent Doc: Camera & UI Agent

본 문서는 **Camera & UI Agent**가 담당해야 할 구현 범위와 제약 사항을 정의합니다.

## 1. 역할 정의
- **Camera Screen (Main)** 및 **Settings Screen**의 UI 구현 (Jetpack Compose).
- **CameraX**를 활용한 실시간 프리뷰 및 이미지 캡처 트리거 연동.
- GPS 상태 표시 및 위치 정보 ON/OFF 토글 스위치 구현.
- 위치 권한 요청(PermissionHelper) 및 권한 거부 시 예외 UX 안내 처리.

## 2. 세부 명세

### 2.1 Camera Screen (Main UI)
- **상단 상태 영역**: `📍 [행정 주소]  [GPS 상태]` 표시.
  - GPS 상태 정의: `GPS OK`(정상), `GPS SEARCHING`(탐색 중), `GPS OFF`(권한 없음), `GPS ERROR`(실패).
- **프리뷰 영역**: 화면에 워터마크(`Timo`)와 실시간 날짜/시간 미리보기를 합성할 구도로 노출 (최종 결과물과 1:1 구도 지향).
- **하단 제어 영역**:
  - 위치 정보 ON/OFF 토글 Chip/Button (즉시 반영).
  - 중앙의 원형 촬영 버튼 (최소 48dp 확보, 오작동 방지 Spacing).
  - 설정 화면으로 이동하는 설정 버튼.

### 2.2 Settings Screen
- **입력 필드**:
  - 기관명 (Agency Name): 최대 20자, placeholder: "기관명 입력"
  - 담당자 (Inspector Name): 최대 10자, placeholder: "담당자 입력"
  - 기타 (Comment): 최대 20자, placeholder: "추가 메모"
- **저장 제어**: 저장 버튼을 눌렀을 때만 변경 사항이 반영되며, 성공 시 적절한 피드백(Toast 등)을 노출하고 이전 화면으로 복귀합니다. (자동 저장 없음)

## 3. 제약 및 주의사항
- **300줄 룰**: 단일 UI 파일이 300줄을 넘지 않도록 Screens, Components로 적절히 분리해야 합니다.
- **카메라 비즈니스 로직 분리**: CameraX 설정 및 캡처 인터페이스는 별도의 `CameraXManager`에 위임하고 UI 코드 내에 결합하지 않습니다.
- **접근성**: 버튼 크기는 최소 48dp 이상으로 한 손 조작이 쉽도록 레이아웃을 구성합니다.
