# 💻 프론트엔드 아키텍처 명세 (`frontend_spec.md`)

이 문서는 **Timo** 클라이언트 애플리케이션의 디렉토리 구조, 채택한 설계 패턴, 컴포넌트 간 데이터 흐름, 공통 재사용 컴포넌트 구조 및 모바일 디바이스 센서와의 비동기 흐름 제어에 대해 다룹니다.

---

## 🏛 아키텍처 패턴 및 설계 사상

Timo는 **MVVM (Model-View-ViewModel)** 사상과 React의 **Custom Hooks 패턴**을 결합한 비즈니스 로직 분리 구조를 채택하고 있습니다.

```text
┌────────────────────────────────────────────────────────┐
│                      View (UI)                         │
│  src/app/ (index.tsx, preview.tsx, settings.tsx)       │
└──────────────────────────┬─────────────────────────────┘
                           │ (State & Interaction)
                           ▼
┌────────────────────────────────────────────────────────┐
│               ViewModel (Custom Hooks)                 │
│  src/hooks/ (useCamera, useLocation, useSettings)      │
└──────────────────────────┬─────────────────────────────┘
                           │ (I/O, Sensor API, Storage)
                           ▼
┌────────────────────────────────────────────────────────┐
│                Model / Service Layer                   │
│  - Storage: AsyncStorage                               │
│  - Device API: expo-camera, expo-location              │
│  - Logic Engine: image-composer, media-saver           │
└────────────────────────────────────────────────────────┘
```

*   **View Layer (`src/app/` 및 `src/components/`):** React Native 컴포넌트 및 레이아웃으로 스타일과 렌더링에만 집중합니다. 로직 처리는 ViewModel 역할을 수행하는 Hooks에게 위임합니다.
*   **ViewModel Layer (Custom Hooks):** 상태(`useState`) 관리 및 비동기 작업 스케줄링을 담당하며, 로직 흐름과 화면 UI를 완전히 격리합니다.
*   **Model/Service Layer (`src/services/`):** 데이터의 실질적인 저장, 가공, 장치 API 연동(이미지 합성 엔진, 미디어 라이브러리 I/O)을 처리합니다.

---

## 💾 상태 관리 및 데이터 흐름

원격 서버와의 실시간 API 통신이 없으므로, 전역 상태 관리 라이브러리(Redux, Recoil 등)를 사용하지 않고 아래와 같은 로컬 동기화 아키텍처를 유지합니다.

1.  **디바이스 영속 데이터 흐름 (Storage Access):**
    *   앱 설정(`agencyName`, `inspectorName`, `comment`, `locationEnabled`, `metadataBackgroundEnabled`)은 모바일 저장소인 `AsyncStorage`에 key-value 쌍으로 관리됩니다.
    *   `useSettings` 훅이 인스턴스화되면 초기화 시점에 디스크에서 읽어와 메모리 상태로 미러링합니다.
2.  **센서 데이터 흐름 (Sensor Access):**
    *   `useLocation` 훅은 백그라운드 스레드에서 주기적으로 수집되는 GPS 위도/경도를 실시간으로 관찰하고, 변경 시 Reverse Geocoding API를 통해 한글 행정 구역 주소로 가공하여 화면에 갱신합니다.
3.  **화면 간 데이터 전달 (Deep Link / Route Params):**
    *   카메라 촬영 완료 시 생성된 이미지 로컬 경로와 메타데이터(`CaptureData` 인터페이스 구조)는 `expo-router`의 네비게이션 파라미터(`captureData` JSON 스트링) 형태로 다음 미리보기 화면에 명시적으로 주입됩니다.

---

## 🧩 공통 재사용 컴포넌트 목록

| 컴포넌트 파일 | 경로 | 설명 및 주요 프롭스 |
| :--- | :--- | :--- |
| `CameraPreview` | `src/components/camera/camera-preview.tsx` | `CameraView` 래핑 컴포넌트. 카메라 권한 상태(`hasPermission`)에 따른 권한 요청 UI 자동 분기 |
| `CaptureButton` | `src/components/camera/capture-button.tsx` | 현장용 물리 셔터 감각의 원형 셔터 버튼. 탭 피드백 및 캡처 중 활성 제한 로직 내장 |
| `GpsStatusBar` | `src/components/camera/gps-status-bar.tsx` | 수집된 행정구역 주소와 GPS 상태(검색중, 켜짐, 오류, 위치조작)를 아이콘과 함께 헤더 표출 |
| `SettingsPreview` | `src/components/settings-preview.tsx` | 설정 화면 하단에 위치하여 배경 박스 토글 및 변경된 입력 정보를 실시간 이미지 오버레이 형태로 사전 검증 |
| `AnimatedIcon` | `src/components/animated-icon.tsx` | micro-animation 효과가 가미된 아이콘 컴포넌트 (모바일 네이티브 / Web 환경 대응 소스 이원화) |
| `ThemedText` / `ThemedView` | `src/components/themed-text.tsx` / `themed-view.tsx` | 다크모드/라이트모드 자동 감지 반응형 기본 타이포그래피 및 컨테이너 래퍼 |

---

## 🚨 비동기 처리 및 글로벌 에러 핸들링 구조

1.  **네이티브 권한 획득 핸들링:**
    *   카메라 권한 및 위치 수집 권한은 각각 `useCameraPermissions`와 `Location.requestForegroundPermissionsAsync`를 활용하여 비동기 프로미스로 처리합니다. 거부 또는 예외 상황 발생 시 UI 상에서 직관적으로 권한 획득 요청을 유도하도록 조건부 뷰(Error UI)를 리턴합니다.
2.  **미디어 쓰기(DCIM 저장) 권한 거부 대응:**
    *   저장소 권한 요청 거부 시, 사용자의 재시도 편의를 위해 `Linking.openSettings()` 모듈을 활용하여 기기의 시스템 설정 화면으로 바로 이동할 수 있는 대화상자(Alert) 분기 로직이 `media-saver.ts` 내에 구성되어 있습니다.
3.  **조작된 GPS(Mock GPS) 경보 기능:**
    *   디바이스가 가짜 위치 앱 등을 사용하여 가상 위도/경도를 전송할 때 `Location.LocationObject.mocked` 필드를 감지하여 `GPS_MOCKED` 상태로 자동 격리하고 화면에 "조작된 위치" 경고를 선명히 표기해 조사 데이터의 불완전성을 예방합니다.
