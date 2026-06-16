/**
 * 앱 전역 설정 상수
 * 매직넘버 방지 및 중앙화된 설정 관리
 */

/** 입력 필드 최대 길이 */
export const MAX_AGENCY_NAME_LENGTH = 20;
export const MAX_INSPECTOR_NAME_LENGTH = 10;
export const MAX_COMMENT_LENGTH = 20;

/** 타임스탬프 포맷 관련 */
export const TIMESTAMP_FORMAT = 'yyyy-MM-dd HH:mm:ss';

/** 이미지 저장 관련 */
export const SAVE_ALBUM_NAME = 'Camera';
export const SAVE_FILE_PREFIX = 'Timo_';

/** 워터마크 텍스트 */
export const WATERMARK_TEXT = 'Timo';

/** GPS 위치 수집 관련 */
export const LOCATION_UPDATE_INTERVAL_MS = 5000;
export const LOCATION_DISTANCE_FILTER_M = 10;

/** 카메라 관련 */
export const CAMERA_QUALITY = 0.9;
export const MIN_BUTTON_SIZE = 48;

/** 앱 설정 기본값 */
export const DEFAULT_SETTINGS = {
  agencyName: '',
  inspectorName: '',
  comment: '',
  locationEnabled: true,
  metadataBackgroundEnabled: true,
} as const;
