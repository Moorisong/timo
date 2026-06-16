import React from 'react';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { WATERMARK_TEXT } from '@/constants';
import { formatTimestamp } from '@/utils/format-date';
import { styles } from '@/app/settings.styles';

interface SettingsPreviewProps {
  agencyName: string;
  inspectorName: string;
  comment: string;
  metadataBackgroundEnabled: boolean;
  locationEnabled: boolean;
}

export function SettingsPreview({
  agencyName,
  inspectorName,
  comment,
  metadataBackgroundEnabled,
  locationEnabled,
}: SettingsPreviewProps) {
  if (!agencyName && !inspectorName && !comment && !locationEnabled) {
    return null;
  }

  const [datePart, timePart] = formatTimestamp(new Date()).split('\n');
  const mockAddress = '경기 가상시 미래로 77';

  return (
    <View style={styles.previewSection}>
      <Text style={styles.sectionTitle}>사진 미리보기</Text>
      <View style={styles.previewCard}>
        <Image
          source={require('@/../assets/images/preview_placeholder.png')}
          style={styles.previewImage}
          contentFit="cover"
        />
        <View
          style={[
            styles.previewOverlay,
            !metadataBackgroundEnabled && styles.previewOverlayNoBg,
          ]}
        >
          {(!!agencyName || !!inspectorName) && (
            <Text
              style={[
                styles.previewAgency,
                !metadataBackgroundEnabled && {
                  textShadowColor: 'rgba(0,0,0,0.7)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
                },
              ]}
              numberOfLines={1}
            >
              {[agencyName, inspectorName].filter(Boolean).join(' / ')}
            </Text>
          )}
          {locationEnabled && (
            <Text
              style={[
                styles.previewLocation || styles.previewAgency,
                !metadataBackgroundEnabled && {
                  textShadowColor: 'rgba(0,0,0,0.7)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
                },
              ]}
              numberOfLines={1}
            >
              {mockAddress}
            </Text>
          )}
          {!!comment && (
            <Text
              style={[
                styles.previewText,
                !metadataBackgroundEnabled && {
                  textShadowColor: 'rgba(0,0,0,0.7)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
                },
              ]}
              numberOfLines={1}
            >
              {comment}
            </Text>
          )}
        </View>
        {/* 워터마크 미리보기 (좌측) */}
        <View style={styles.previewWatermarkLeft}>
          <Text style={styles.watermarkTitle}>{WATERMARK_TEXT}</Text>
        </View>
        {/* 날짜 미리보기 (우측) */}
        <View style={styles.previewWatermarkRight}>
          <View
            style={[
              styles.timeBadge,
              !metadataBackgroundEnabled && {
                backgroundColor: 'transparent',
                borderColor: 'transparent',
              },
            ]}
          >
            <Text
              style={[
                styles.dateText,
                !metadataBackgroundEnabled && {
                  textShadowColor: 'rgba(0,0,0,0.7)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
                },
              ]}
            >
              {datePart}
            </Text>
            <Text
              style={[
                styles.timeText,
                !metadataBackgroundEnabled && {
                  textShadowColor: 'rgba(0,0,0,0.7)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 3,
                },
              ]}
            >
              {timePart}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
