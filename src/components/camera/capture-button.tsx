/**
 * 촬영 버튼 컴포넌트
 * 원형 셔터 버튼 + 촬영 중 로딩 상태
 */

import React from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';

import { COLORS } from '@/constants';

interface CaptureButtonProps {
  onCapture: () => void;
  isCapturing: boolean;
}

export default function CaptureButton({
  onCapture,
  isCapturing,
}: CaptureButtonProps) {
  return (
    <Pressable
      style={styles.wrapper}
      onPress={onCapture}
      disabled={isCapturing}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="사진 촬영"
      accessibilityHint="탭하면 사진을 촬영합니다"
    >
      <View style={styles.ring} />
      <View style={styles.inner}>
        {isCapturing && (
          <ActivityIndicator size="small" color={COLORS.primary} />
        )}
      </View>
    </Pressable>
  );
}

const WRAPPER_SIZE = 76;
const INNER_SIZE = 64;
const RING_RADIUS = WRAPPER_SIZE / 2;
const INNER_RADIUS = INNER_SIZE / 2;

const styles = StyleSheet.create({
  wrapper: {
    width: WRAPPER_SIZE,
    height: WRAPPER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: RING_RADIUS,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  inner: {
    width: INNER_SIZE,
    height: INNER_SIZE,
    borderRadius: INNER_RADIUS,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});
