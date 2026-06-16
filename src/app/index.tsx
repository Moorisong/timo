/**
 * Camera Screen (Main)
 * 실시간 카메라 프리뷰, GPS 상태, 워터마크 표시
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Settings, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, WATERMARK_TEXT } from '@/constants';
import useCamera from '@/hooks/use-camera';
import useLocation from '@/hooks/use-location';
import useSettings from '@/hooks/use-settings';
import { CameraPreview, GpsStatusBar, CaptureButton } from '@/components/camera';
import { formatTimestamp } from '@/utils/format-date';

import type { CaptureData } from '@/types';

export default function CameraScreen() {
  const router = useRouter();
  const [now, setNow] = useState(new Date());
  const { settings } = useSettings();
  const { cameraRef, hasPermission, isCapturing, requestPermission, takePicture } =
    useCamera();
  const { gpsInfo } = useLocation(settings.locationEnabled);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleCapture = async () => {
    const photo = await takePicture();
    if (photo) {
      const captureData: CaptureData = {
        imageUri: photo.uri,
        width: photo.width,
        height: photo.height,
        timestamp: new Date(),
        settings,
        location: gpsInfo.location,
      };
      router.push({
        pathname: '/preview',
        params: {
          captureData: JSON.stringify(captureData),
        },
      });
    }
  };



  return (
    <View style={styles.container}>
      {/* Camera Feed */}
      <CameraPreview
        cameraRef={cameraRef}
        hasPermission={hasPermission}
        onRequestPermission={requestPermission}
      />

      {/* Top Gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'transparent']}
        style={styles.topGradient}
        pointerEvents="none"
      />

      {/* Bottom Gradient */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.bottomGradient}
        pointerEvents="none"
      />

      {/* Top Bar */}
      <SafeAreaView edges={['top']} style={styles.topBar}>
        <GpsStatusBar
          gpsInfo={gpsInfo}
          locationEnabled={settings.locationEnabled}
        />
        <View style={styles.watermarkGroup}>
          <Text style={styles.watermarkTitle}>{WATERMARK_TEXT}</Text>
          <Text style={styles.watermarkTime}>{formatTimestamp(now)}</Text>
        </View>
      </SafeAreaView>

      {/* Bottom Controls */}
      <SafeAreaView edges={['bottom']} style={styles.bottomControls}>
        <View style={styles.controlsRow}>
          {/* Location Toggle */}
          <Pressable
            style={[
              styles.locationChip,
              settings.locationEnabled && styles.locationChipActive,
            ]}
            onPress={() => router.push('/settings')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={
              settings.locationEnabled ? '위치 켜짐' : '위치 꺼짐'
            }
          >
            <MapPin
              size={12}
              color={
                settings.locationEnabled
                  ? COLORS.primaryLight
                  : COLORS.textSecondary
              }
            />
            <Text
              style={[
                styles.locationChipText,
                settings.locationEnabled && styles.locationChipTextActive,
              ]}
            >
              {settings.locationEnabled ? '위치 켜짐' : '위치 꺼짐'}
            </Text>
          </Pressable>

          {/* Capture Button */}
          <CaptureButton
            onCapture={handleCapture}
            isCapturing={isCapturing}
          />

          {/* Settings Button */}
          <Pressable
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="설정 화면 열기"
            accessibilityHint="탭하면 설정 화면으로 이동합니다"
          >
            <Settings size={18} color={COLORS.textPrimary} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 128,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 192,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  watermarkGroup: {
    alignItems: 'flex-end',
  },
  watermarkTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  watermarkTime: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    letterSpacing: 0.2,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 32,
    paddingBottom: 48,
    paddingTop: 24,
    zIndex: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationChipActive: {
    backgroundColor: COLORS.primaryBg,
    borderColor: 'rgba(59,130,246,0.5)',
  },
  locationChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
  },
  locationChipTextActive: {
    color: '#93C5FD',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
