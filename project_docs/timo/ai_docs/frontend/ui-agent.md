# Frontend UI & Component Agent Reference

## 📝 1. 연동 기획 명세 (`frontend_spec.md`, `ui_design_spec.md`)
본 문서는 Timo 애플리케이션의 클라이언트 UI, 컴포넌트 간 데이터 흐름, 디자인 테마를 다룹니다.
- **아키텍처 패턴:** MVVM 및 React Custom Hooks 기반 로직 분리 구조
- **주요 뷰 구성:** 메인 카메라 화면 (`/`), 합성 미리보기 화면 (`/preview`), 설정 화면 (`/settings`)
- **디자인 테마:** 순수 블랙 배경(`#000000`), 메인 포인트 컬러(`#3B82F6`), 반투명 화이트 텍스트 등 프리미엄 다크 스페이스 테마 적용.

## 🤖 2. AI 개발 지침 및 설계 구조
### 🎯 목적
React Native 및 Expo Router 기반의 페이지 및 UI 컴포넌트를 설계하고, 비즈니스 로직(ViewModel)과 시각적 렌더링(View)을 명확히 격리하여 유지보수성을 극대화합니다.

### 📦 패키지 및 타깃 경로 구조
- `src/app/`: Expo Router 기반 파일 라우팅 진입점
- `src/components/`: 공통 UI 컴포넌트 (CameraPreview, CaptureButton, GpsStatusBar 등)
- `src/hooks/`: 뷰 모델 역할을 하는 Custom Hooks (useCamera, useLocation 등)
- `src/constants/`: 전역 테마, 색상, 레이아웃 상수

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **View Layer 구현:** `src/app/` 하위에 페이지 단위의 화면 컨테이너를 구성합니다. 스타일링은 `src/constants/colors.ts` 및 `theme.ts`를 가져와 일관성 있게 적용합니다.
2. **Component 모듈화:** 화면에서 반복적으로 사용되거나, 복잡도가 높은 뷰(예: 셔터 버튼, 미리보기 오버레이 박스)는 `src/components/` 하위로 분리합니다.
3. **ViewModel 연결:** 페이지와 컴포넌트 내부에서 데이터를 직접 Fetch하거나 디바이스 API를 호출하지 않고, `src/hooks/`에서 제공하는 Custom Hooks를 연결하여 상태값(`state`)과 액션(`action`)만 전달받아 UI를 렌더링합니다.

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]:** 본 모듈의 실제 구현 소스 코드는 단일 파일 기준 **300줄**을 절대 초과할 수 없다. 구현 중 한계 도달 시 즉시 sub-component나 utils로 분리 및 구조 분해할 것.
- **[플랫폼 프레임워크 제약]:** 네이티브(Android/iOS) 로직 직접 수정을 지양하며, 오직 React Native 및 Expo SDK 범위 내에서 크로스 플랫폼을 지원하도록 구현할 것.
- **[하드코딩 금지]:** 색상 헥스코드나 패딩/마진 수치를 UI 컴포넌트에 직접 하드코딩하지 말고, 반드시 `src/constants/`의 설정값을 Import하여 사용할 것.
- **[로직-UI 격리]:** 컴포넌트 내부에 복잡한 비동기 흐름이나 센서 권한 처리 로직을 두지 않으며, 모든 무거운 처리는 Hooks 계층으로 분리할 것.
