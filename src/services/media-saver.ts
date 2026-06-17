/**
 * MediaLibrary 기반 이미지 저장 서비스
 * 합성된 이미지를 갤러리에 저장
 */

import * as MediaLibrary from 'expo-media-library';

import { SAVE_ALBUM_NAME, SAVE_FILE_PREFIX } from '@/constants';

/**
 * 타임스탬프 기반 파일명 생성
 * 형식: Timo_yyyyMMdd_HHmmss
 */
export function generateFileName(date: Date): string {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${SAVE_FILE_PREFIX}${y}${mo}${d}_${h}${mi}${s}`;
}

/**
 * MediaLibrary 권한 요청
 * Android 13 이상에서 Audio 권한 누락으로 인한 getPermissionsAsync/requestPermissionsAsync 예외 차단
 */
export async function requestMediaPermission(): Promise<boolean> {
  try {
    // 1. 먼저 일반 미디어 권한(읽기/쓰기 모두 포함)을 요청합니다.
    const existing = await MediaLibrary.getPermissionsAsync();
    if (existing.granted) {
      return true;
    }
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    // 2. 일반 권한 요청이 실패하는 경우 (예: Expo Go / 시뮬레이터 한계)
    // writeOnly: true로 폴백하여 최소한 에셋 저장은 가능하게 만듭니다.
    if (__DEV__) {
      console.warn('일반 미디어 권한 요청 실패, writeOnly로 재시도합니다:', error);
    }
    try {
      const existingWrite = await MediaLibrary.getPermissionsAsync({ writeOnly: true } as any);
      if (existingWrite.granted) {
        return true;
      }
      const { status } = await MediaLibrary.requestPermissionsAsync({ writeOnly: true } as any);
      return status === 'granted';
    } catch (writeOnlyError) {
      if (__DEV__) {
        console.warn('writeOnly 미디어 권한 요청도 불가합니다:', writeOnlyError);
      }
      return false;
    }
  }
}

/**
 * 이미지를 갤러리에 저장
 * @param uri 저장할 이미지의 로컬 URI
 * @returns 저장 성공 여부
 */
export async function saveImageToGallery(uri: string): Promise<boolean> {
  try {
    // 1. 먼저 권한 체크 및 요청을 시도합니다.
    const granted = await requestMediaPermission();
    if (!granted) {
      return false;
    }
    
    // 2. 권한이 확보된 경우에만 미디어 라이브러리에 에셋을 생성합니다.
    const asset = await MediaLibrary.createAssetAsync(uri);

    // 3. 사용자가 기본 카메라 앨범에 저장을 요청했으므로, 앨범명을 'Camera'로 설정했을 경우
    // 별도의 커스텀 앨범(Timo 등)으로 이동/복사 작업을 생략하여 getAlbumAsync 에러를 우회합니다.
    if (SAVE_ALBUM_NAME !== 'Camera' && SAVE_ALBUM_NAME !== 'camera') {
      try {
        let album = await MediaLibrary.getAlbumAsync(SAVE_ALBUM_NAME);
        if (album === null) {
          await MediaLibrary.createAlbumAsync(SAVE_ALBUM_NAME, asset, true);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, true);
        }
      } catch (albumError) {
        if (__DEV__) {
          console.warn('Timo 앨범 저장/이동 중 에러 발생:', albumError);
        }
      }
    }

    return true;
  } catch (error) {
    if (__DEV__) {
      console.warn('이미지 저장 실패:', error);
    }
    return false;
  }
}
