/**
 * GPS 상태 표시 바 컴포넌트
 * 상단에 행정 주소와 GPS 상태를 표시
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';

import { COLORS } from '@/constants';

import type { GpsInfo } from '@/types';

interface GpsStatusBarProps {
  gpsInfo: GpsInfo;
  locationEnabled: boolean;
}

const GPS_STATUS_LABELS: Record<string, string> = {
  GPS_OK: 'GPS 켜짐',
  GPS_SEARCHING: 'GPS 탐색중',
  GPS_OFF: 'GPS 꺼짐',
  GPS_ERROR: 'GPS 오류',
};

export default function GpsStatusBar({
  gpsInfo,
  locationEnabled,
}: GpsStatusBarProps) {
  const statusLabel = GPS_STATUS_LABELS[gpsInfo.status] ?? 'GPS 꺼짐';
  const isActive = gpsInfo.status === 'GPS_OK' && locationEnabled;
  const addressText = gpsInfo.location?.address ?? '위치 정보 없음';

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`위치: ${addressText}, ${statusLabel}`}
    >
      <MapPin size={11} color={COLORS.textSecondary} />
      <Text style={styles.locationText} numberOfLines={1}>
        {locationEnabled ? addressText : '위치 꺼짐'}
      </Text>
      <Text style={styles.dot}>·</Text>
      <Text style={[styles.gpsText, isActive && styles.gpsTextActive]}>
        {statusLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  locationText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    letterSpacing: 0.5,
    maxWidth: 160,
  },
  dot: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 12,
  },
  gpsText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  gpsTextActive: {
    color: COLORS.primaryLight,
  },
});
