/**
 * 카메라 프리뷰 컴포넌트
 * CameraView 래퍼 + 에러 상태 UI
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CameraView } from 'expo-camera';
import { ZapOff, Camera } from 'lucide-react-native';

import { COLORS } from '@/constants';

interface CameraPreviewProps {
  cameraRef: React.RefObject<CameraView | null>;
  hasPermission: boolean | null;
  onRequestPermission: () => void;
}

export default function CameraPreview({
  cameraRef,
  hasPermission,
  onRequestPermission,
}: CameraPreviewProps) {
  // 권한 미결정 (로딩)
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <View style={styles.errorBox}>
          <View style={styles.iconWrap}>
            <Camera size={28} color={COLORS.textMuted} />
          </View>
          <Text style={styles.errorTitle}>카메라 권한 확인 중</Text>
          <Text style={styles.errorSubtitle}>잠시만 기다려주세요</Text>
        </View>
      </View>
    );
  }

  // 권한 거부
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <View style={styles.errorBox}>
          <View style={styles.iconWrap}>
            <ZapOff size={28} color={COLORS.textMuted} />
          </View>
          <Text style={styles.errorTitle}>카메라 권한이 필요합니다</Text>
          <Text style={styles.errorSubtitle}>
            촬영을 위해 카메라 접근을 허용해주세요
          </Text>
          <Pressable
            style={styles.permissionButton}
            onPress={onRequestPermission}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="카메라 권한 허용"
          >
            <Text style={styles.permissionButtonText}>권한 허용</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // 정상 카메라 프리뷰
  return (
    <CameraView
      ref={cameraRef}
      style={styles.camera}
      facing="back"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  errorBox: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorSubtitle: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  permissionButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
