# 🏠 홈서버 및 배포 인프라 명세 (`deployment_spec.md`)

이 문서는 **Timo** 애플리케이션의 클라이언트 빌드 자동화, 플랫폼별 배포 규격 및 EAS(Expo Application Services) 인프라 설정을 역추적하여 기술합니다.

---

## 🛠 빌드 및 배포 아키텍처 개요

Timo는 클라우드 기반 빌드/배포 자동화 플랫폼인 **EAS (Expo Application Services)** 인프라를 활용하여 클라이언트 앱을 빌드 및 패키징합니다.

```text
┌─────────────────┐       ┌─────────────────┐       ┌──────────────────┐
│   Source Code   ├──────►│    EAS CLI      ├──────►│   EAS Build      │
│   (Git Repo)    │       │   (Local Dev)   │       │   (Cloud VM)     │
└─────────────────┘       └─────────────────┘       └────────┬─────────┘
                                                             │
                                                             │ (Artifact Output)
                                                             ▼
                                                    ┌──────────────────┐
                                                    │ Android: .aab    │
                                                    │ iOS: .ipa / Test │
                                                    └──────────────────┘
```

---

## ⚙️ EAS 빌드 프로필 명세 (`eas.json`)

프로젝트 루트의 `eas.json` 파일 구조를 분석하여 파악한 플랫폼별 빌드 환경 및 파이프라인 정보는 다음과 같습니다.

### 1. 개발용 프로필 (`development`)
*   **배포 모드:** `internal` (내부 배포 전용)
*   **EAS Development Client:** `true` (테스트 디바이스에 Expo Go 대신 개발자 전용 런타임을 임베드하여 배포)

### 2. 프리뷰 프로필 (`preview`)
*   **배포 모드:** `internal` (테스트 용도)
*   **Android 빌드 대상:** `.apk` (단말기에 직접 바로 인스톨하여 즉시 테스트할 수 있는 실행 파일)

### 3. 로컬 최적화 개발 빌드 (`local-dev`)
*   **배포 모드:** `internal`
*   **Android 빌드 대상:** `.apk`
*   **특수 Gradle 명령어:** `:app:assembleRelease -PreactNativeArchitectures=arm64-v8a` (특정 64비트 아키텍처 디바이스만을 타겟팅하여 현지 컴파일 속도를 극대화)

### 4. 상용 릴리즈 프로필 (`production`)
*   **Android 빌드 대상:** `.aab` (Google Play 스토어 등록에 최적화된 Android App Bundle 규격 생성)

---

## 📦 Gradle 컴파일 성능 최적화 플러그인 설정

네이티브(Native Code) 컴파일 속도 향상과 메모리 오버플로우 방지를 위해 `app.json` 내부에 **`expo-build-properties`** 설정이 적용되어 있습니다.

```json
{
  "android": {
    "extraParams": {
      "org.gradle.jvmargs": "-Xmx4096m -XX:MaxMetaspaceSize=1024m -XX:+UseG1GC",
      "org.gradle.caching": "true",
      "org.gradle.parallel": "true",
      "org.gradle.configureondemand": "true",
      "org.gradle.daemon": "true",
      "org.gradle.vfs.watch": "true"
    }
  }
}
```

*   **JVM 최대 힙 메모리 (`-Xmx4096m`):** 대규모 컴파일 작업 시 메모리 부족으로 빌드가 튕기는 현상 방지.
*   **컴파일 병렬화 (`org.gradle.parallel`):** 멀티코어 CPU 자원을 빌드 작업에 효율적으로 병렬 배분.
*   **캐싱 활성화 (`org.gradle.caching`):** 동일한 모듈 재빌드 시 컴파일 시간을 최소화.
*   **설정 자동 최적화 (`org.gradle.configureondemand`):** 변경이 있는 모듈 프로젝트만 컴파일 스레드에 등록하여 최적 컴파일 유도.

---

## 🚀 실제 빌드 및 배포 자동화 커맨드 레시피

### 1. EAS 클라우드 Android 빌드 (생산용)
```bash
# 구글 플레이 스토어 배포용 AAB 빌드
npm run build:android
```

### 2. 로컬 환경에서의 즉시 설치용 APK 빌드 (EAS Local Build)
```bash
# 로컬 호스트 컴퓨터의 자원을 빌려 빠른 APK 빌드 파일 생성
npm run build:android-preview-local
```
