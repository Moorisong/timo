# Sub-Agent Doc: Location & Data Agent

본 문서는 **Location & Data Agent**가 담당해야 할 데이터 관리, GPS 연동 및 파일 저장 로직에 대한 가이드를 정의합니다.

## 1. 역할 정의
- **GPS 수집**: `expo-location`을 활용해 현재 위치 정보(위도, 경도)를 주기적으로 수집합니다.
- **주소 변환**: `reverseGeocodeAsync`를 활용해 위경도 좌표를 행정 주소 문자열로 변환하고, 불필요한 국가명 접두사("대한민국", "South Korea")를 정규식으로 가공합니다.
- **설정 저장**: `AsyncStorage`를 통해 기관명, 담당자, 기타 메모, 위치 토글 설정 및 메타데이터 배경 온/오프 설정을 온디바이스에 비휘발성 저장합니다.
- **이미지 파일 저장**: `expo-media-library` API를 사용하여 합성된 이미지를 공용 사진첩(DCIM/Pictures)에 직접 저장합니다.

## 2. 세부 구현 사항

### 2.1 위치 연동 (Fused Location & Geocoder)
- 실시간으로 GPS 위경도를 가져와 상태(`GPS_OK`, `GPS_SEARCHING`, `GPS_OFF`, `GPS_ERROR`, `GPS_MOCKED`)를 발행합니다.
- GPS 데이터 수집 빈도: 10초(`LOCATION_UPDATE_INTERVAL_MS`), 이동 거리 필터: 10m(`LOCATION_DISTANCE_FILTER_M`).
- 배터리 및 부하 방지: 위경도가 이전 좌표 기준 약 1m 이내(소수점 이하 5째자리 오차)로 유지될 경우 불필요한 역지오코딩 API 호출을 생략하고 캐시를 사용합니다.
- Geocoder 주소 필터링: 주소 문자열 앞뒤에 불필요하게 붙은 "대한민국", "South Korea" 단어와 콤마를 제거하여 "서울특별시 강남구 테헤란로..." 형태의 로컬 주소만 남깁니다.

### 2.2 AsyncStorage 설정 저장
- 저장 구조:
  ```typescript
  interface Settings {
    agencyName: string;
    inspectorName: string;
    comment: string;
    locationEnabled: boolean;
    metadataBackgroundEnabled: boolean;
  }
  ```

### 2.3 MediaLibrary 저장 및 파일명 규칙
- 저장 경로: 갤러리 공용 앨범 (DCIM 라이브러리 직접 등록).
- 파일 이름 정의: `${SAVE_FILE_PREFIX}yyyyMMdd_HHmmss` (예: `Timo_20260619_141121.jpg`).
- 다중 노출 방지: 권한 획득 여부를 캐싱하여 중복 권한 요청 창 발생을 방지하며, 거부된 경우에는 시스템 설정 창(`Linking.openSettings`)으로 유도합니다.

## 3. 제약 및 주의사항
- **300줄 룰**: 비즈니스 훅(`useLocation`, `useSettings`) 및 저장 매니저(`media-saver.ts`)는 단일 파일 300줄을 초과하지 않고 기능 단위로 엄격히 고립시킵니다.
- **예외 처리**: Geocoder 실패 시 애플리케이션의 다른 기능(카메라 캡처 등)이 블로킹되지 않아야 합니다.

