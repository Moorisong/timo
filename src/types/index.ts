/**
 * 앱 전역 타입 정의
 */

/** GPS 상태 정의 */
export type GpsStatus = 'GPS_OK' | 'GPS_SEARCHING' | 'GPS_OFF' | 'GPS_ERROR' | 'GPS_MOCKED';

/** 사용자 설정 */
export interface Settings {
  agencyName: string;
  inspectorName: string;
  comment: string;
  locationEnabled: boolean;
  metadataBackgroundEnabled: boolean;
}

/** 위치 데이터 */
export interface LocationData {
  latitude: number;
  longitude: number;
  address: string | null;
}

/** 촬영 시 합성에 필요한 메타데이터 */
export interface CaptureData {
  imageUri: string;
  width: number;
  height: number;
  timestamp: Date;
  settings: Settings;
  location: LocationData | null;
}

/** GPS 상태 정보 */
export interface GpsInfo {
  status: GpsStatus;
  location: LocationData | null;
}
