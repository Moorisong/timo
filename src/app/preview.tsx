/**
 * Preview Screen
 * 촬영 이미지에 워터마크/메타데이터 합성 후 저장/공유
 */

import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Download, Share2, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

import { COLORS } from '@/constants';
import ComposerOverlay from '@/services/image-composer';
import { saveImageToGallery } from '@/services/media-saver';
import { formatTimestamp } from '@/utils/format-date';

import type { CaptureData } from '@/types';

import { styles } from './preview.styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ captureData?: string }>();
  const viewShotRef = useRef<ViewShot>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 300);
  }, []);

  const captureData: CaptureData | null = params.captureData
    ? JSON.parse(params.captureData)
    : null;

  const timestamp = captureData
    ? formatTimestamp(new Date(captureData.timestamp))
    : formatTimestamp(new Date());

  const handleClose = () => router.back();

  const captureComposedImage = useCallback(async (): Promise<string | null> => {
    try {
      if (viewShotRef.current?.capture) {
        return await viewShotRef.current.capture();
      }
      return null;
    } catch (error) {
      if (__DEV__) {
        console.error('합성 이미지 캡처 실패:', error);
      }
      return null;
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const composedUri = await captureComposedImage();
      if (!composedUri) {
        showToast('이미지 합성에 실패했습니다.');
        return;
      }
      const success = await saveImageToGallery(composedUri);
      if (success) {
        showToast('갤러리에 저장되었습니다.');
        setTimeout(() => {
          router.back();
        }, 300);
      } else {
        showToast('사진 저장 권한을 확인해주세요.');
      }
    } catch {
      showToast('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, captureComposedImage, router, showToast]);

  const handleShare = useCallback(async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const composedUri = await captureComposedImage();
      if (!composedUri) {
        showToast('이미지 합성에 실패했습니다.');
        return;
      }
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(composedUri, { mimeType: 'image/jpeg' });
      } else {
        showToast('공유 기능을 사용할 수 없습니다.');
      }
    } catch {
      showToast('공유 중 오류가 발생했습니다.');
    } finally {
      setIsSharing(false);
    }
  }, [isSharing, captureComposedImage, showToast]);

  const isLandscape = captureData ? captureData.width > captureData.height : false;
  const imageAspectRatio = captureData && captureData.height > 0
    ? captureData.width / captureData.height
    : (isLandscape ? 4 / 3 : 3 / 4);
  
  // 1. 화면에 보일 레이아웃 크기 설정 (화면 너비 기준)
  const composerWidth = SCREEN_WIDTH;
  const composerHeight = composerWidth / imageAspectRatio;

  // 2. 저장용 고해상도 캡처 규격 설정 (1920px 수준의 초고화질)
  const TARGET_CAPTURE_WIDTH = 1920;
  const captureWidth = TARGET_CAPTURE_WIDTH;
  const captureHeight = captureWidth / imageAspectRatio;

  // 화면에는 1:1 원래 배율로 렌더링됩니다.
  const scale = 1;

  return (
    <View style={styles.container}>
      <View style={styles.composerWrapper}>
        <ViewShot
          ref={viewShotRef}
          options={{
            format: 'jpg',
            quality: 0.98,
            width: captureWidth,
            height: captureHeight,
          }}
          style={[styles.viewShot, { width: composerWidth, height: composerHeight }]}
        >
          {captureData ? (
            <ComposerOverlay
              imageUri={captureData.imageUri}
              timestamp={timestamp}
              settings={captureData.settings}
              location={captureData.location}
              imageWidth={composerWidth}
              imageHeight={composerHeight}
              scale={scale}
            />
          ) : (
            <View style={styles.mockPlaceholder}>
              <Text style={styles.mockText}>촬영된 이미지</Text>
            </View>
          )}
        </ViewShot>
      </View>

      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent']}
        style={styles.topGradient}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.bottomGradient}
        pointerEvents="none"
      />

      <SafeAreaView edges={['top']} style={styles.topBar}>
        <Pressable
          style={styles.iconButton}
          onPress={handleClose}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="닫기"
        >
          <X size={18} color={COLORS.textPrimary} />
        </Pressable>
        <Text style={styles.title}>미리보기</Text>
        <View style={styles.spacer} />
      </SafeAreaView>

      <SafeAreaView edges={['bottom']} style={styles.bottomActions}>
        <Pressable
          style={styles.actionItem}
          onPress={handleClose}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="재촬영"
        >
          <View style={styles.secondaryButton}>
            <Trash2 size={20} color="rgba(255,255,255,0.7)" />
          </View>
          <Text style={styles.actionText}>재촬영</Text>
        </Pressable>

        <Pressable
          style={styles.actionItem}
          onPress={handleShare}
          disabled={isSharing}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="공유"
        >
          <View style={styles.secondaryButton}>
            {isSharing ? (
              <ActivityIndicator
                size="small"
                color="rgba(255,255,255,0.8)"
              />
            ) : (
              <Share2 size={20} color="rgba(255,255,255,0.8)" />
            )}
          </View>
          <Text style={styles.actionText}>공유</Text>
        </Pressable>

        <Pressable
          style={styles.actionItem}
          onPress={handleSave}
          disabled={isSaving}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="저장"
        >
          <View style={styles.primaryButton}>
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Download size={22} color="#FFF" />
            )}
          </View>
          <Text style={styles.saveActionText}>저장</Text>
        </Pressable>
      </SafeAreaView>

      {toastVisible && (
        <View style={styles.toastContainer}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </View>
  );
}
