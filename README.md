# Timo 📸

Timo는 모바일 환경에서 현장 점검 및 조사를 진행할 때 촬영 사진에 위치 정보(GPS), 타임스탬프, 그리고 사용자 커스텀 메타데이터를 정밀하게 워터마크로 합성하여 저장해주는 **현장 점검 맞춤형 카메라 애플리케이션**입니다.

---

## 🚀 주요 기능

- **실시간 카메라 및 오버레이**: 실시간 카메라 프리뷰 및 화면 상의 실시간 날짜/시간, GPS 수집 정보 표시.
- **GPS 메타데이터 연동**: 사용자 설정 기반으로 실시간 GPS 좌표(위도, 경도) 및 주소 정보를 수집하고 사진에 영구 합성.
- **맞춤형 정보 워터마크**:
  - 점검 기관명, 담당자명, 세부 현장 메모 기입 가능.
  - 이모지 입력을 정상 지원하여 보다 직관적인 표현 가능.
- **워터마크 디자인 변경**: 메타데이터의 시인성을 위해 배경 어두운 박스 처리 토글 가능.
- **촬영 피드백 제어**: 불필요한 플래시 및 셔터 애니메이션 깜빡임을 없애 현장 촬영에서의 최적화된 사용 경험 제공.

---

## 🛠 기술 스택

- **Core**: React Native, Expo
- **Navigation**: Expo Router (파일 기반 라우팅)
- **Camera**: Expo Camera (`CameraView` 사용)
- **Image handling**: Expo Image, React Native View Shot (오프스크린 합성 렌더러)
- **Icons**: Lucide React Native
- **Testing**: Jest, Testing Library React Native

---

## 📦 시작하기

### 1. 의존성 패키지 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
# Expo 개발 서버 시작
npx expo start

# 또는 캐시 클리어와 함께 실행
npx expo start --clear
```

### 3. 테스트 실행

```bash
# 전체 테스트 실행
npx jest

# 변경 감지 모드 테스트
npx jest --watch
```

---

## 📂 프로젝트 구조

```text
src/
├── app/               # Expo Router 기반 스크린 레이아웃 및 스타일 (카메라 화면, 설정 화면, 미리보기 화면 등)
├── components/        # 공통 UI 컴포넌트 및 카메라 관련 전용 UI 컴포넌트
├── constants/         # 전역 설정 상수, 테마 및 색상 정보
├── hooks/             # 카메라 관리, 위치 정보(GPS) 제어, 설정 저장/로드 관련 Custom Hooks
├── services/          # 이미지 워터마크 합성 엔진 (Composer) 및 파일 저장용 서비스
├── utils/             # 이모지 안전 문자열 처리 등 다목적 유틸리티 함수
└── types/             # Typescript 전역 타입 정의
```

---

## 🧪 테스트 코드 작성 규칙

본 프로젝트는 안정성 높은 기능 보장 및 버그 예방을 위해 엄격한 유닛 테스트/컴포넌트 테스트 작성을 권장합니다.

- 새로운 유틸리티 구현 시, `src/utils/__tests__` 내 유닛 테스트 필수 작성.
- 컴포넌트 렌더링 검증 시, `src/components/.../__tests__` 내 컴포넌트 동작 및 속성 전달 테스트 필수 작성.
