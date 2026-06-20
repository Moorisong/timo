# ⚙️ 백엔드 아키텍처 및 API 명세 (`backend_spec.md`)

이 문서는 **Timo** 애플리케이션의 백엔드 연동 및 외부 API 스펙에 대한 정보입니다.

> [!NOTE]
> **Timo는 원격 API 서버나 클라우드 데이터베이스를 두지 않는 클라이언트 사이드 단독 구동(Serverless / Client-Only) 아키텍처를 채택하고 있습니다.**
>
> 데이터의 수집, 주소 변환, 가공, 이미지 파일 합성과 저장은 모두 모바일 디바이스 로컬 내부 런타임(Expo, React Native Bridge)에서 오프라인 상태로 즉시 완결됩니다.
> 따라서 본 문서에서는 전통적인 백엔드 웹서버 대신, **디바이스 내부 OS API와의 데이터 교환 인터페이스 및 연동 흐름**을 명세합니다.

---

## 📱 로컬 디바이스 시스템 아키텍처 및 연동 흐름

클라이언트와 모바일 OS 서비스 간의 시스템 브릿지 구성은 다음과 같습니다.

```text
┌────────────────────────────────────────────────────────┐
│                      Timo Client                       │
└───────────┬───────────────────────────┬────────────────┘
            │                           │
            │ (Geocoding Query)         │ (Media Save I/O)
            ▼                           ▼
┌───────────────────────┐   ┌────────────────────────────┐
│      Apple Map        │   │       iOS Photos           │
│     (CoreLocation)    │   │         Library            │
└───────────────────────┘   └────────────────────────────┘
┌───────────────────────┐   ┌────────────────────────────┐
│      Google Map       │   │      Android Media         │
│      (Location)       │   │         (DCIM)             │
└───────────────────────┘   └────────────────────────────┘
     [위치 좌표 -> 주소]            [이미지 영속 저장]
```

1.  **위치 변환 모듈 (Reverse Geocoding):**
    *   디바이스 GPS 위도 및 경도 값을 수신한 뒤, 운영체제 기본 위치 디코딩 서비스(iOS: Apple Map Geocoding, Android: Google Play Location Services)와 브릿지를 맺어 한글 주소 문자열을 반환받습니다.
2.  **미디어 쓰기 모듈 (Photo Storage Engine):**
    *   메모리에 생성된 합성 이미지 로컬 URI를 받아 모바일 OS 미디어 저장 매체 인터페이스(iOS Photos framework, Android MediaStore API)를 호출하여 갤러리에 저장합니다.

---

## 🔌 디바이스 OS 연동 데이터 구조 (Request / Response DTO 대용)

### 1. Reverse Geocoding API (`expo-location`)

사용자가 현재 위도/경도를 전송하여 기기 OS로부터 주소를 획득할 때 가공되는 데이터 구조입니다.

*   **입력 좌표 데이터 (Input Coordinates Query):**
    ```typescript
    {
      latitude: number;   // 위도 (예: 37.5665)
      longitude: number;  // 경도 (예: 126.9780)
    }
    ```
*   **출력 행정 주소 구조 (Output Address Object):**
    ```typescript
    {
      country: string | null;          // 국가명 (예: "대한민국")
      region: string | null;           // 시/도 (예: "서울특별시")
      subregion: string | null;        // 구/군 (예: "중구")
      city: string | null;             // 시 (예: "서울")
      district: string | null;         // 동/읍/면 (예: "태평로1가")
      street: string | null;           // 도로명 (예: "세종대로")
      streetNumber: string | null;     // 건물번호 (예: "110")
      name: string | null;             // 랜드마크명 (예: "서울특별시청")
      formattedAddress: string | null; // 완성형 한글 주소 (우선 적용)
    }
    ```

---

## 🔒 디바이스 권한 및 인증/보안 모델

Timo는 중앙 사용자 인증(JWT, OAuth) 대신, 모바일 운영체제의 **보안 샌드박스 기반 권한(System Permission)** 모델을 통해 리소스 접근을 안전하게 제어합니다.

### 1. 요구 권한 목록
*   `CAMERA` (카메라 권한): 실시간 카메라 스냅샷 촬영을 위해 필수적으로 획득해야 합니다.
*   `ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION` (위치 권한): 정확한 점검 현장의 좌표 및 행정구역 주소를 수집하기 위해 동의를 구합니다.
*   `WRITE_EXTERNAL_STORAGE` / `READ_MEDIA_IMAGES` (갤러리 접근 권한): 촬영된 워터마크 결과물을 기기 내 사진 보관함(DCIM 폴더)에 기록하기 위해 필요합니다.

---

## 🔗 연동 확인된 모바일 시스템 모듈 (Third-party Modules)

*   **iOS CoreLocation & Android Play Location:** 로컬 GPS 센서 실시간 리스닝 및 캐시 좌표 갱신 처리
*   **expo-sharing Bridge:** 로컬 디스크 파일 핸들러(`file://...`)를 시스템 공유 메커니즘으로 이관하여 카카오톡, 이메일, 드라이브 업로드 등 타 앱과의 가교 역할 수행
