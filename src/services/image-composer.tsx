/**
 * 이미지 합성 엔진 (View Shot 기반)
 * 촬영 이미지 위에 워터마크, 타임스탬프, 메타데이터를 합성하는 오프스크린 뷰
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

import { WATERMARK_TEXT } from '@/constants';

import type { Settings, LocationData } from '@/types';

interface ComposerOverlayProps {
  imageUri: string;
  timestamp: string;
  settings: Settings;
  location: LocationData | null;
  imageWidth: number;
  imageHeight: number;
}

/**
 * 합성용 오프스크린 View 컴포넌트
 * react-native-view-shot으로 캡처하여 최종 이미지 생성
 */
export default function ComposerOverlay({
  imageUri,
  timestamp,
  settings,
  location,
  imageWidth,
  imageHeight,
}: ComposerOverlayProps) {
  const hasMetadata = !!(
    settings.agencyName ||
    settings.inspectorName ||
    settings.comment
  );
  const showLocation =
    settings.locationEnabled && location?.address;

  return (
    <View style={[styles.container, { width: imageWidth, height: imageHeight }]}>
      {/* 원본 이미지 */}
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        contentFit="cover"
      />

      {/* 우측 상단: 워터마크 + 타임스탬프 */}
      <View style={styles.watermarkContainer}>
        <View style={styles.watermarkBg}>
          <Text style={styles.watermarkTitle}>{WATERMARK_TEXT}</Text>
          <Text style={styles.watermarkTime}>{timestamp}</Text>
        </View>
      </View>

      {/* 하단: 메타데이터 오버레이 */}
      {(hasMetadata || showLocation) && (
        <View style={styles.metadataContainer}>
          <View style={styles.metadataBg}>
            {!!settings.agencyName && (
              <Text style={styles.metadataAgency}>
                {settings.agencyName}
              </Text>
            )}
            {!!settings.inspectorName && (
              <Text style={styles.metadataText}>
                {settings.inspectorName}
              </Text>
            )}
            {!!settings.comment && (
              <Text style={styles.metadataText}>
                {settings.comment}
              </Text>
            )}
            {showLocation && (
              <Text style={styles.metadataLocation}>
                📍 {location?.address}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  watermarkContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    alignItems: 'flex-end',
  },
  watermarkBg: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'flex-end',
  },
  watermarkTitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  watermarkTime: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  metadataContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  metadataBg: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  metadataAgency: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  metadataText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 1,
  },
  metadataLocation: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    marginTop: 4,
  },
});
