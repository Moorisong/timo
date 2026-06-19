엑스포고 
npx expo start --clear


# Timo App - 빌드 및 서명 키 가이드 (Build Guide)

> [!WARNING]
> 본 가이드와 이 가이드가 지칭하는 개인 서명 키 정보 및 빌드 파일(*.aab)은 보안상 Git에 커밋되지 않도록 `.gitignore`에 등록되어 관리됩니다.

---

## 1. 안드로이드 로컬 빌드 방법

### A. 플레이스토어 배포용 빌드 (AAB)
EAS 클라우드 대기 시간을 줄이고 로컬 장비의 성능을 사용해 빠르게 빌드하기 위해 아래 명령어를 사용합니다.

```bash
# 네이티브 리소스 정리 및 초기화 (아이콘, 레이아웃 변경 시 권장)
npm run build:clean-android

# 로컬 빌드 실행 (AAB 파일 생성)
npm run build:android-local
```

빌드가 성공하면 프로젝트 루트 폴더에 `build-[타임스탬프].aab` 파일이 생성됩니다. 이 파일을 구글 플레이 콘솔에 직접 업로드하시면 됩니다.

### B. 로컬 기기 즉시 테스트용 빌드 (APK)
구글 플레이스토어를 거치지 않고 실제 단말기에 직접 다운로드하여 즉각적인 검증(앱 강제종료, 아이콘 정상 적용 여부 확인 등)을 하려면 아래 명령어로 APK 파일을 생성합니다.

```bash
# 네이티브 리소스 정리 및 초기화
npm run build:clean-android

# 로컬 테스트용 APK 빌드 실행
npm run build:android-preview-local
```
빌드가 완료되면 터미널에 로컬 다운로드 링크 혹은 프로젝트 루트 폴더에 생성된 `.apk` 파일을 단말기에 설치하여 빠르게 테스트할 수 있습니다.

---

## 2. 서명 키(Keystore) 관리 및 연동 오류 해결

로컬 빌드 시 구글 플레이 콘솔에서 **서명 키 불일치 오류**가 발생하는 경우, 로컬 환경에 올바른 Keystore가 매핑되지 않았기 때문입니다. 아래 절차에 따라 Expo 서버의 자격 증명을 연동하십시오.

### 방법 A: Expo Credentials 자동 연동 (권장)
처음 로컬 빌드를 실행할 때 Expo 로그인 세션이 유효하다면 EAS CLI가 자동으로 원격 서버의 서명 키를 참조합니다.
```bash
eas build --platform android --profile production --local
```
* 진행 과정 중 `Use credentials from EAS` 등의 프롬프트가 표시되면 동의하고 진행합니다.

### 방법 B: `credentials.json`을 통한 수동 연동
자동 연동이 실패하거나 명시적으로 키를 매핑해야 할 경우 다음 단계를 수행합니다.

1. **Expo Credential 정보 다운로드**
   ```bash
   eas credentials
   ```
   * 터미널 선택: `Android` -> `production` -> `Keystore: Download keystore to a file` 순으로 이동하여 `.jks` (또는 `.keystore`) 키스토어 파일을 로컬로 다운로드합니다.
   * 다운로드 시 터미널 화면에 노출되는 `Keystore password`, `Key alias`, `Key password`를 안전한 곳에 기록해 둡니다.

2. **`credentials.json` 작성 (로컬 전용)**
   프로젝트 루트 디렉토리에 `credentials.json` 파일을 생성하고 아래 형식을 맞추어 기록합니다.
   ```json
   {
     "android": {
       "keystore": "./path-to-your-keystore.jks",
       "keystorePassword": "YOUR_KEYSTORE_PASSWORD",
       "keyAlias": "YOUR_KEY_ALIAS",
       "keyPassword": "YOUR_KEY_PASSWORD"
     }
   }
   ```
   > [!CAUTION]
   > `credentials.json`과 다운로드 받은 `.jks` 파일은 **절대로 Git에 커밋하지 마십시오**.

---

## 3. 관련 파일 Git Ignore 설정 목록
아래 파일들은 외부 유출 방지 및 로컬 전용 빌드를 위해 `.gitignore`에 자동/수동 제외 처리되어 있습니다.
- `*.aab` (빌드 결과물 파일)
- `credentials.json` (개인 서명 키 매핑 정보)
- `*.jks`, `*.keystore` (로컬 보관용 안드로이드 서명 키 파일)



# 1. 꼬인 네이티브 캐시 및 아이콘 삭제/재생성
npm run build:clean-android

# 2. 로컬 테스트용 APK 빌드 (첫 빌드는 NDK 컴파일로 조금 걸리나, 이후에는 매우 빠릅니다)
npm run build:android-preview-local

