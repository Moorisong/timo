# Sub-Agent Doc: Location & Data Agent

본 문서는 **Location & Data Agent**가 담당해야 할 데이터 관리, GPS 연동 및 파일 저장 로직에 대한 가이드를 정의합니다.

## 1. 역할 정의
- **GPS 수집**: Google Fused Location Provider를 활용해 현재 위치 정보(위도, 경도)를 주기적으로 수집합니다.
- **주소 변환**: Geocoder를 활용해 위경도 좌표를 행정 주소 문자열(예: `Seoul, Korea` 등)로 안전하게 변환합니다.
- **설정 저장**: DataStore를 통해 기관명, 담당자, 기타 메모 및 위치 토글 ON/OFF 설정을 온디바이스에 저장하고 flow 형태로 관찰합니다.
- **이미지 파일 저장**: MediaStore API를 사용하여 합성된 이미지를 공용 사진 디렉토리에 저장합니다.

## 2. 세부 구현 사항

### 2.1 위치 연동 (Fused Location & Geocoder)
- 실시간으로 GPS 위경도를 가져와 상태(`GPS OK`, `GPS SEARCHING`, `GPS OFF`, `GPS ERROR`)를 발행합니다.
- 수집된 좌표는 Geocoder를 사용하여 행정 주소명으로 매핑합니다. Geocoder가 실패하거나 네트워크 지연이 발생할 경우 예외 처리를 명확히 하여 UI나 이미지 합성이 멈추지 않도록 처리합니다.

### 2.2 Local DataStore 설정 저장
- DB 없이 가벼운 설정을 로컬에 유지하기 위해 Jetpack DataStore를 사용합니다.
- 저장 항목:
  ```kotlin
  data class Settings(
      val agencyName: String,
      val inspectorName: String,
      val comment: String,
      val locationEnabled: Boolean
  )
  ```

### 2.3 MediaStore 저장 및 파일명 규칙
- Android 10+(API 29) 이상의 Scoped Storage 정책에 대응해야 합니다.
- 저장 경로: `/Pictures/Timo/`
- 파일 이름 정의: `Timo_yyyyMMdd_HHmmss.jpg`
- 저장 완료 후 MediaStore에 신규 이미지 등록 이벤트를 스캔하여 갤러리에 즉시 반영되도록 구현합니다.

## 3. 제약 및 주의사항
- **300줄 룰**: 저장소 클래스(`MediaStoreSaver`)와 주소 변환 클래스(`GeocoderHelper`)는 개별 파일로 분리합니다.
- **권한 처리 연동**: 위치 권한이 없을 경우 GPS 수집을 안전하게 중단하고 `GPS OFF` 상태를 전달해야 합니다.
