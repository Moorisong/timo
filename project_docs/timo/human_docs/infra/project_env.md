# 📦 프로젝트 환경 및 세팅 구성 (`project_env.md`)

이 문서는 **Timo** 애플리케이션의 개발 환경, 의존성 패키지, 빌드 및 실행 방법에 대해 소스 코드를 바탕으로 정리한 명세서입니다.

---

## 런타임 및 개발 언어 스펙

현재 프로젝트는 **React Native** 및 **Expo SDK 54** 환경에서 빌드되고 구성되었습니다.

*   **Node.js 권장 버전:** `v18` 이상 (LTS 버전 권장)
*   **프레임워크:** React Native `0.81.5` / Expo `^54.0.35`
*   **개발 언어:** TypeScript `~5.9.2`
*   **UI 및 패키징 프레임워크:** Expo SDK 54
*   **패키지 매니저:** npm

---

## 핵심 의존성 패키지 구성

| 패키지명 | 버전 | 역할 |
| :--- | :--- | :--- |
| `react` | `19.1.0` | 핵심 React 프레임워크 |
| `react-native` | `0.81.5` | 크로스 플랫폼 모바일 런타임 |
| `expo` | `^54.0.35` | Expo 핵심 모듈 |
| `expo-router` | `~6.0.24` | 파일 기반 라우팅 및 네비게이션 엔진 |
| `expo-camera` | `~17.0.10` | 디바이스 카메라 연동 (`CameraView` 사용) |
| `expo-location` | `~19.0.8` | 실시간 GPS 수집 및 주소 변환 (Reverse Geocoding) |
| `expo-media-library` | `~18.2.1` | 촬영된 이미지를 로컬 갤러리(DCIM)에 저장 |
| `expo-sharing` | `~15.0.11` | 기기 내 설치된 타 앱으로 이미지 공유 기능 수행 |
| `react-native-view-shot` | `4.0.3` | 화면에 보이지 않는 오프스크린 뷰 합성 렌더러 (1920px 해상도 이미지 생성) |
| `@react-native-async-storage/async-storage` | `2.2.0` | 온디바이스 영속성 키-밸류 저장소 |
| `lucide-react-native` | `^1.18.0` | 앱 전역 UI 아이콘 세트 |
| `expo-image` | `~3.0.11` | 고성능 이미지 뷰 컴포넌트 |
| `react-native-reanimated` | `~4.1.1` | 고성능 컴포넌트 애니메이션 처리 |

---

## 로컬 개발 및 테스트 명령어

### 1. 패키지 설치
```bash
npm install
```

### 2. 개발 서버 시작 (Expo Metro Bundler)
```bash
# 기본 Expo 개발 서버 시작
npx expo start

# Metro 캐시 클리어와 함께 시작
npx expo start --clear

# 웹 브라우저에서 실행
npm run web
```

### 3. 플랫폼별 클라이언트 로컬 구동 (Prebuild 실행 및 에뮬레이터/시뮬레이터 빌드)
```bash
# 안드로이드 에뮬레이터/기기 빌드 실행
npm run android

# iOS 시뮬레이터/기기 빌드 실행
npm run ios
```

### 4. 테스트 및 린트 코드 수행
```bash
# 전체 Jest 테스트 실행
npm run test

# ESLint 검사 실행
npm run lint
```

---

## 프로젝트 환경설정 (.env) 구성

본 프로젝트는 원격 서버 통신 없이 디바이스 센서 및 AsyncStorage를 활용하여 **로컬 단독(Standalone)으로 구동**하는 오프라인-퍼스트 앱입니다.

따라서 로컬 구동 및 서버 연동을 위한 **별도의 `.env` 환경 변수가 필요하지 않습니다.** 모든 설정은 앱 내 설정 화면(`src/app/settings.tsx`)을 통해 관리되며, 모바일 기기의 보안 로컬 스토리지에 유지됩니다.
