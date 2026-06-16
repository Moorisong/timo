# Timo 프로젝트 기획 및 설계서

## 1. 프로젝트 개요
Timo는 공공기관, 지자체, 현장 실무자가 사진을 촬영하고 이를 **보고서 및 증빙 자료로 즉시 활용할 수 있도록 하는 현장 기록용 카메라 앱**입니다.

- **워터마크 필수 삽입**: 모든 촬영 이미지에 'Timo' 워터마크가 우측 상단에 고정 삽입됩니다. (비활성화 불가)
- **날짜/시간 자동 기록**: 촬영 시점 기준의 날짜 및 시간이 워터마크 바로 아래에 자동 기록되며 수정할 수 없습니다.
- **현장 메타데이터 입력**: 기관명(최대 20자), 담당자(최대 10자), 기타 메모(최대 20자)를 설정에서 관리하며, 이미지 하단에 라벨 형태로 출력됩니다.
- **위치 정보 제공**: 촬영 시점의 EXIF GPS 정보를 행정 주소로 변환하여 이미지에 포함할 수 있으며, 메인 화면에서 토글(ON/OFF)할 수 있습니다.
- **광고 없음**: 공공 및 업무 환경에 최적화된 UI/UX 신뢰성을 유지합니다.
- **로컬 독립형 구조**: 서버나 데이터베이스 없이 DataStore와 MediaStore를 활용하여 온디바이스에서 모든 프로세스를 처리합니다.

---

## 2. 시스템 아키텍처 및 Flow
Timo는 서버 없이 동작하는 온디바이스 시스템입니다.

```
UI Layer (Camera / Settings)
        ↓
CameraX Layer (촬영)
        ↓
Image Processing Layer (Canvas 합성)
        ↓
Storage Layer (MediaStore 저장)
        ↓
Device Gallery
```

### 이미지 레이아웃 구조
```
Timo
2026-06-16 14:32:10
──────────────────
      IMAGE
──────────────────
기관명 (Supplier)
담당자 (Inspector)
기타 (Comment)
📍 위치 정보 (행정 주소 - ON일 때만 표시)
```

---

## 3. 서브 에이전트 설계 및 문서 인덱스
토큰 최소화 및 에이전트 간의 명확한 역할 분담을 위해 모듈별로 서브 에이전트 개발 지침 문서를 정의합니다.

각 에이전트의 역할과 상세 가이드는 아래 링크를 참조하세요:

1. **[Camera & UI Agent](file:///Users/shkim/Desktop/Project/timo/docs/sub_agents_docs/camera_ui_agent.md)**
   - UI 레이아웃, CameraX 연동, 위치 권한 처리 및 State 관리.
2. **[Image Processing Agent](file:///Users/shkim/Desktop/Project/timo/docs/sub_agents_docs/image_processing_agent.md)**
   - Canvas 기반 이미지 합성 로직 및 비변조 텍스트 드로잉 구현.
3. **[Location & Data Agent](file:///Users/shkim/Desktop/Project/timo/docs/sub_agents_docs/location_data_agent.md)**
   - GPS 수집, 행정 주소 변환(Geocoder), DataStore 설정 관리 및 MediaStore 저장.
