# Timo 프로젝트 기획 및 설계서

## 1. 프로젝트 개요
Timo는 공공기관, 지자체, 현장 실무자가 사진을 촬영하고 이를 **보고서 및 증빙 자료로 즉시 활용할 수 있도록 하는 현장 기록용 카메라 앱**입니다. (React Native / Expo 기반)

- **워터마크 필수 삽입**: 모든 촬영 이미지에 'Timo' 워터마크가 우측 상단에 고정 삽입됩니다. (비활성화 불가)
- **날짜/시간 자동 기록**: 촬영 시점 기준의 날짜 및 시간이 워터마크 바로 아래에 자동 기록되며 수정할 수 없습니다.
- **현장 메타데이터 입력**: 기관명(최대 20자), 담당자(최대 10자), 기타 메모(최대 20자)를 설정에서 관리하며, 이미지 하단에 라벨 형태로 출력됩니다.
- **배경 반투명 토글**: 메타데이터 배경에 반투명 어두운 배경(배너)을 넣거나 뺄 수 있는 토글 설정 기능이 제공됩니다.
- **위치 정보 제공**: 촬영 시점의 GPS 정보를 행정 주소로 변환하여 이미지에 포함할 수 있으며, 메인 화면에서 토글(ON/OFF)할 수 있습니다. (역지오코딩 시 "대한민국", "South Korea" 등 불필요한 국가명 접두사/접미사는 자동으로 정리됩니다.)
- **광고 없음**: 공공 및 업무 환경에 최적화된 UI/UX 신뢰성을 유지합니다.
- **로컬 독립형 구조**: 서버나 데이터베이스 없이 AsyncStorage와 Expo MediaLibrary를 활용하여 온디바이스에서 모든 프로세스를 처리합니다.

---

## 2. 시스템 아키텍처 및 Flow
Timo는 서버 없이 동작하는 온디바이스 React Native / Expo 애플리케이션입니다.

```
UI Layer (CameraScreen / SettingsScreen / PreviewScreen)
        ↓
Expo Camera Layer (촬영 및 EXIF 기반 회전 보정)
        ↓
Image Composition Layer (ViewShot 기반 고해상도 합성)
        ↓
Storage Layer (AsyncStorage 설정 보관 & Expo MediaLibrary 공용 DCIM 저장)
        ↓
Device Gallery
```

### 이미지 레이아웃 구조
```
Timo (Watermark)
2026-06-16 14:32:10
──────────────────
      IMAGE
──────────────────
기관명 (Supplier) / 담당자 (Inspector)
📍 위치 정보 (행정 주소 - ON일 때만 표시)
기타 (Comment)
(배경 설정에 따라 반투명 블랙 백그라운드 배너 적용 가능)
```

---

## 3. 서브 에이전트 설계 및 문서 인덱스
토큰 최소화 및 에이전트 간의 명확한 역할 분담을 위해 모듈별로 서브 에이전트 개발 지침 문서를 정의합니다.

각 에이전트의 역할과 상세 가이드는 아래 링크를 참조하세요:

1. **[Camera & UI Agent](file:///Users/shkim/Desktop/Project/timo/docs/sub_agents_docs/CameraUiAgent.md)**
   - Expo Router 기반 화면 구조, `expo-camera` 연동, 이미지 회전 보정 처리, 위치 권한 처리 및 State 관리.
2. **[Image Processing Agent](file:///Users/shkim/Desktop/Project/timo/docs/sub_agents_docs/ImageProcessingAgent.md)**
   - `react-native-view-shot` 기반 이미지 합성 오버레이 구현 및 고해상도(1920px) 스케일 렌더링.
3. **[Location & Data Agent](file:///Users/shkim/Desktop/Project/timo/docs/sub_agents_docs/LocationDataAgent.md)**
   - GPS 수집, 행정 주소 변환(Geocoder 정규식 가공), AsyncStorage 설정 관리 및 MediaLibrary 저장.

