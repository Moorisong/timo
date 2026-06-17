/**
 * Camera Screen (Main)
 * 실시간 카메라 프리뷰, GPS 상태, 워터마크 표시
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS, WATERMARK_TEXT } from '@/constants';
import useCamera from '@/hooks/use-camera';
import useLocation from '@/hooks/use-location';
import useSettings from '@/hooks/use-settings';
import { CameraPreview, CaptureButton, GpsStatusBar } from '@/components/camera';
import { formatTimestamp } from '@/utils/format-date';

import type { CaptureData } from '@/types';

export default function CameraScreen() {
  const router = useRouter();
  const [now, setNow] = useState(new Date());
  const { settings, updateField, loadSettings } = useSettings();

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [loadSettings])
  );
  const { cameraRef, hasPermission, isCapturing, requestPermission, takePicture } =
    useCamera();
  const { gpsInfo, testMockGps } = useLocation(settings.locationEnabled);

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
        <Text style={styles.watermarkTitle}>{WATERMARK_TEXT}</Text>
        {(() => {
          const [datePart, timePart] = formatTimestamp(now).split('\n');
          return (
            <View style={styles.timeBadge}>
              <Text style={styles.dateText}>{datePart}</Text>
              <Text style={styles.timeText}>{timePart}</Text>
            </View>
          );
        })()}
      </SafeAreaView>

      {/* Bottom Controls */}
      <SafeAreaView edges={['bottom']} style={styles.bottomControls}>
        <View style={styles.controlsRow}>
          {/* Location Toggle Space for layout balance */}
          <View style={styles.sideControlWrapper}>
            {settings.locationEnabled && (
              <>
                <GpsStatusBar gpsInfo={gpsInfo} locationEnabled={settings.locationEnabled} />
                {__DEV__ && (
                  <Pressable
                    onPress={testMockGps}
                    style={{ marginTop: 8, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: 'rgba(255,50,50,0.8)', borderRadius: 4, alignSelf: 'flex-start' }}
                  >
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>MOCK 테스트</Text>
                  </Pressable>
                )}
              </>
            )}
          </View>

          {/* Capture Button */}
          <CaptureButton
            onCapture={handleCapture}
            isCapturing={isCapturing}
          />

          {/* Settings Button */}
          <View style={[styles.sideControlWrapper, { alignItems: 'flex-end' }]}>
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
    paddingHorizontal: 16,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
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
  timeBadge: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'flex-end',
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

  sideControlWrapper: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
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
