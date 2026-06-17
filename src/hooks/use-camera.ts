/**
 * 카메라 관리 훅
 * expo-camera 기반 촬영 관리
 */

import { useState, useRef, useCallback } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { CAMERA_QUALITY } from '@/constants';

interface PictureResult {
  uri: string;
  width: number;
  height: number;
}

interface UseCameraReturn {
  cameraRef: React.RefObject<CameraView | null>;
  hasPermission: boolean | null;
  isCapturing: boolean;
  requestPermission: () => Promise<boolean>;
  takePicture: () => Promise<PictureResult | null>;
}

export default function useCamera(): UseCameraReturn {
  const cameraRef = useRef<CameraView | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [permission, requestCameraPermission] = useCameraPermissions();

  const hasPermission = permission?.granted ?? null;

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const result = await requestCameraPermission();
      return result.granted;
    } catch {
      return false;
    }
  }, [requestCameraPermission]);

  const takePicture = useCallback(async (): Promise<PictureResult | null> => {
    if (!cameraRef.current || isCapturing) return null;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: CAMERA_QUALITY,
        exif: true,
      });
      if (photo?.uri) {
        const orientation = photo.exif?.Orientation ?? photo.exif?.orientation;
        const isRotated = orientation === 5 || orientation === '5' ||
                          orientation === 6 || orientation === '6' ||
                          orientation === 7 || orientation === '7' ||
                          orientation === 8 || orientation === '8';
        return {
          uri: photo.uri,
          width: isRotated ? photo.height : photo.width,
          height: isRotated ? photo.width : photo.height,
        };
      }
      return null;
    } catch (error) {
      if (__DEV__) {
        console.error('촬영 실패:', error);
      }
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing]);

  return {
    cameraRef,
    hasPermission,
    isCapturing,
    requestPermission,
    takePicture,
  };
}
