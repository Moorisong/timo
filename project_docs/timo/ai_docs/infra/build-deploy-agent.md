# Infra & Deployment Agent Reference

## 📝 1. 연동 기획 명세 (`deployment_spec.md`, `project_env.md`)
본 문서는 Timo 애플리케이션의 패키징 환경, 인프라 플랫폼, 빌드 파이프라인 및 배포 최적화 설정을 다룹니다.
- **플랫폼:** React Native (`0.81.5`) 및 Expo SDK `54`
- **인프라 파이프라인:** EAS(Expo Application Services) 기반 클라우드 및 로컬 빌드 혼합 운영
- **Gradle 최적화:** 메모리 오버플로우 방지 및 병렬 컴파일 설정 (`expo-build-properties`) 내장

## 🤖 2. AI 개발 지침 및 설계 구조
### 🎯 목적
모바일 클라이언트 배포 인프라 설정, 패키지 및 런타임 종속성 관리, 그리고 최적의 빌드 환경 구축(Android `.aab`, `.apk` 생성 및 네이티브 컴파일 튜닝)을 목표로 합니다.

### 📦 패키지 및 타깃 경로 구조
- `app.json` / `app.config.js`: Expo 프로젝트 글로벌 시스템 메타데이터 및 권한 명세
- `eas.json`: EAS 클라우드 빌드 프로필 및 파이프라인 설정
- `package.json`: NPM 의존성 패키지 선언 및 실행 스크립트 관리
- `babel.config.js` / `tsconfig.json`: 트랜스파일 및 컴파일 환경 구성

### 🛠️ 개발 단계 (Step-by-Step 상세 로직)
1. **의존성 모듈 검토 및 관리:** `project_env.md`에 명시된 버전 제약 사항을 준수하여 `package.json`의 의존성을 유지보수하며, 불필요한 패키지 설치를 방지합니다.
2. **EAS 빌드 파이프라인 정비:** `eas.json` 내의 `development`, `preview`, `local-dev`, `production` 4단계 프로필 구성의 무결성을 검증하고 유지합니다.
3. **네이티브 빌드 최적화:** `app.json` 내의 `expo-build-properties` 플러그인 설정(`-Xmx4096m`, `org.gradle.parallel=true` 등)을 모니터링하여 JVM 및 Gradle 컴파일 오버헤드를 최소화합니다.
4. **로컬 환경 관리:** 디바이스 로컬 전용 앱이므로 `.env` 구성을 원천 배제하며, 환경 변수가 필요 없도록 앱 내부 로직화 기조를 지킵니다.

## 🚨 3. 철벽 코드 컨벤션 및 제약 조건
- **[300줄 분리 규칙]:** 만약 인프라 관련 커스텀 스크립트(JS/Bash) 작성 시 단일 파일 기준 **300줄**을 절대 초과할 수 없다. 스크립트가 커질 경우 `scripts/` 폴더 내 하위 모듈로 분리할 것.
- **[프레임워크 강제]:** 네이티브 Android/iOS 프로젝트 폴더 내부(`android/`, `ios/`)의 파일을 직접 수동 조작하는 행위는 엄격히 금지된다. 모든 네이티브 종속성 및 설정 변경은 `app.json`의 Expo Config Plugin을 통해 제어할 것.
- **[환경변수 금지]:** 어플리케이션은 서버리스 오프라인 단독 구동 아키텍처이므로, 시크릿 키 등을 숨기기 위한 `.env` 시스템 도입 및 `dotenv` 사용을 일체 금지한다.
