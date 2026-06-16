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
  scale?: number;
}

/**
 * 설정과 위치 정보 데이터를 기반으로 3줄 메타데이터 목록 배열 반환
 */
export function composeMetadataList(settings: Settings, location: LocationData | null): string[] {
  const list: string[] = [];

  // 1. 첫 줄: 기관명 / 담당자
  if (settings.agencyName || settings.inspectorName) {
    const combined = [settings.agencyName, settings.inspectorName].filter(Boolean).join(' / ');
    if (combined) {
      list.push(combined);
    }
  }

  // 2. 두 번째 줄: 위치 정보
  const showLocation = settings.locationEnabled && location?.address;
  if (showLocation && location?.address) {
    list.push(location.address);
  }

  // 3. 세 번째 줄: 메모
  if (settings.comment) {
    list.push(settings.comment);
  }

  return list;
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
  scale = 1,
}: ComposerOverlayProps) {
  const metadataList = composeMetadataList(settings, location);
  const showOverlay = metadataList.length > 0;

  return (
    <View style={[styles.container, { width: imageWidth, height: imageHeight }]}>
      {/* 원본 이미지 */}
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        contentFit="cover"
      />

      {/* 상단 워터마크 (좌측) */}
      <View style={[styles.watermarkContainerLeft, { top: 10 * scale, left: 12 * scale }]}>
        <Text style={[styles.watermarkTitle, { fontSize: 15 * scale, letterSpacing: 1.5 * scale }]}>
          {WATERMARK_TEXT}
        </Text>
      </View>

      {/* 상단 날짜 (우측) */}
      <View style={[styles.watermarkContainerRight, { top: 10 * scale, right: 12 * scale }]}>
        {(() => {
          const [datePart, timePart] = timestamp.split('\n');
          return (
            <View
              style={[
                styles.timeBadge,
                {
                  paddingHorizontal: 12 * scale,
                  paddingVertical: 6 * scale,
                  borderRadius: 8 * scale,
                  borderWidth: 1 * scale,
                },
              ]}
            >
              <Text style={[styles.dateText, { fontSize: 10 * scale, letterSpacing: 0.5 * scale }]}>
                {datePart}
              </Text>
              <Text style={[styles.timeText, { fontSize: 15 * scale, marginTop: 1 * scale }]}>
                {timePart}
              </Text>
            </View>
          );
        })()}
      </View>

      {/* 하단: 메타데이터 오버레이 */}
      {showOverlay && (
        <View style={styles.metadataContainer}>
          <View style={[styles.metadataBg, { padding: 12 * scale }]}>
            {metadataList.map((item, idx) => {
              const isFirst = idx === 0;
              const isLocation = location?.address === item;

              let textStyle = styles.metadataText;
              let fontSizeVal = 11 * scale;
              let marginBottomVal = 0;

              if (isFirst) {
                textStyle = styles.metadataAgency;
                fontSizeVal = 13 * scale;
                marginBottomVal = 2 * scale;
              } else if (isLocation) {
                textStyle = styles.metadataLocation;
                fontSizeVal = 12 * scale;
                marginBottomVal = 2 * scale;
              }

              return (
                <Text
                  key={idx}
                  style={[textStyle, { fontSize: fontSizeVal, marginBottom: marginBottomVal }]}
                  numberOfLines={1}
                >
                  {item}
                </Text>
              );
            })}
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
  watermarkContainerLeft: {
    position: 'absolute',
    top: 10,
    left: 12,
  },
  watermarkContainerRight: {
    position: 'absolute',
    top: 10,
    right: 12,
  },
  timeBadge: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'flex-end',
  },
  watermarkTitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  dateText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginTop: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlign: 'right',
  },
  metadataContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  metadataBg: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 12,
  },
  metadataAgency: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  metadataText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
  metadataLocation: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginBottom: 2,
  },
});
