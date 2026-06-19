# Sub-Agent Doc: Camera & UI Agent

본 문서는 **Camera & UI Agent**가 담당해야 할 구현 범위와 제약 사항을 정의합니다.

## 1. 역할 정의
- **Camera Screen (Main)**, **Preview Screen**, **Settings Screen**의 UI 구현 (React Native / Expo Router).
- **expo-camera** (`CameraView`)를 활용한 실시간 프리뷰 및 이미지 캡처 트리거 연동.
- GPS 상태 표시 및 위치 정보 ON/OFF 토글 스위치 구현.
- 위치 권한 요청(`expo-location` 권한 흐름) 및 예외 UX 안내 처리.
- 촬영 시 EXIF Orientation을 확인하여 회전된 각도(가로/세로 촬영 구도)를 적절히 보정한 원본 비율 보장.

## 2. 세부 명세

### 2.1 Camera Screen (Main UI)
- **상단 상태 영역**: 워터마크 타이틀 `Timo`와 현재 일시를 실시간 바인딩하여 표시.
- **하단 제어 영역**:
  - GPS 활성화 시 `📍 [행정 주소] [GPS 상태]` 표시바 노출.
  - 위치 정보 ON/OFF 토글 Chip/Button (즉시 반영).
  - 중앙의 원형 촬영 버튼 (최소 48dp 확보, 오작동 방지 Spacing).
  - 설정 화면으로 이동하는 설정 버튼.

### 2.2 Settings Screen
- **입력 필드**:
  - 기관명 (Agency Name): 최대 20자, placeholder: "기관명 입력"
  - 담당자 (Inspector Name): 최대 10자, placeholder: "담당자 입력"
  - 기타 (Comment): 최대 20자, placeholder: "추가 메모"
- **토글 옵션**:
  - 메타데이터 어두운 배경 영역 활성화 여부 토글 (metadataBackgroundEnabled)
- **저장 제어**: 저장 버튼을 눌렀을 때만 AsyncStorage에 저장되며, 성공 시 이전 화면으로 복귀합니다. (자동 저장 없음)

### 2.3 Preview Screen
- **합성 미리보기**: ViewShot 컴포넌트를 사용해 1:1 합성될 구도로 화면상에 드로잉.
- **하단 액션 영역**:
  - 재촬영(Trash), 공유(Share2), 저장(Download) 버튼 배치.
  - 저장 시 비동기 저장 중 인디케이터 제공.

## 3. 제약 및 주의사항
- **300줄 룰**: 단일 UI 파일이 300줄을 넘지 않도록 Screens, Components로 적절히 분리해야 합니다.
- **카메라 비즈니스 로직 분리**: 카메라 촬영 및 비동기 상태 관리는 커스텀 훅 `useCamera`에 위임하고 UI 코드 내에 결합하지 않습니다.
- **접근성**: 버튼 크기는 최소 48dp 이상으로 한 손 조작이 쉽도록 레이아웃을 구성하며, Screen Reader용 `accessibilityLabel`을 상세 제공합니다.

