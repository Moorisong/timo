/**
 * 카메라 관리 훅
 * expo-camera 기반 촬영 관리
 */

import { useState, useRef, useCallback } from 'react';
import { CameraView } from 'expo-camera';
import { useCameraPermissions } from 'expo-camera';

import { CAMERA_QUALITY } from '@/constants';

interface UseCameraReturn {
  cameraRef: React.RefObject<CameraView | null>;
  hasPermission: boolean | null;
  isCapturing: boolean;
  requestPermission: () => Promise<boolean>;
  takePicture: () => Promise<string | null>;
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

  const takePicture = useCallback(async (): Promise<string | null> => {
    if (!cameraRef.current || isCapturing) return null;

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: CAMERA_QUALITY,
      });
      return photo?.uri ?? null;
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
