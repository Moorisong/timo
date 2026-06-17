/**
 * MediaLibrary 기반 이미지 저장 서비스
 * 갤러리(DCIM)에만 이미지를 1장 저장
 */

import * as MediaLibrary from 'expo-media-library';

import { SAVE_FILE_PREFIX } from '@/constants';

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
 * MediaLibrary 쓰기 전용(writeOnly) 권한 요청
 * 여러 번 뜨는 권한 창을 방지하고 최초 1회만 노출되도록 개선
 */
export async function requestMediaPermission(): Promise<boolean> {
  try {
    const existing = await MediaLibrary.getPermissionsAsync(true);
    if (existing.granted) {
      return true;
    }
    const { status } = await MediaLibrary.requestPermissionsAsync(true);
    return status === 'granted';
  } catch (error) {
    if (__DEV__) {
      console.warn('미디어 쓰기 권한 요청 실패:', error);
    }
    return false;
  }
}

/**
 * 이미지를 갤러리(DCIM)에 1장만 저장
 * @param uri 저장할 이미지의 로컬 URI
 * @returns 저장 성공 여부
 */
export async function saveImageToGallery(uri: string): Promise<boolean> {
  try {
    const granted = await requestMediaPermission();
    if (!granted) {
      return false;
    }
    
    // DCIM에만 저장되도록 변경 (커스텀 앨범 이동/복사 로직 제거)
    await MediaLibrary.saveToLibraryAsync(uri);

    return true;
  } catch (error) {
    if (__DEV__) {
      console.warn('이미지 저장 실패:', error);
    }
    return false;
  }
}
