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
 */
export async function requestMediaPermission(): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * 이미지를 갤러리에 저장
 * @param uri 저장할 이미지의 로컬 URI
 * @returns 저장 성공 여부
 */
export async function saveImageToGallery(uri: string): Promise<boolean> {
  try {
    const granted = await requestMediaPermission();
    if (!granted) {
      return false;
    }

    const asset = await MediaLibrary.createAssetAsync(uri);

    // Timo 앨범에 저장
    let album = await MediaLibrary.getAlbumAsync(SAVE_ALBUM_NAME);
    if (album === null) {
      await MediaLibrary.createAlbumAsync(SAVE_ALBUM_NAME, asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }

    return true;
  } catch (error) {
    if (__DEV__) {
      console.error('이미지 저장 실패:', error);
    }
    return false;
  }
}
