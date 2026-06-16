/**
 * Settings Screen
 * AsyncStorage 기반 설정 저장/로드
 */

import React from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Save,
  FileText,
  User,
  Building2,
  StickyNote,
  X,
} from 'lucide-react-native';

import {
  COLORS,
  MAX_AGENCY_NAME_LENGTH,
  MAX_INSPECTOR_NAME_LENGTH,
  MAX_COMMENT_LENGTH,
  WATERMARK_TEXT,
} from '@/constants';
import useSettings from '@/hooks/use-settings';
import { formatTimestamp } from '@/utils/format-date';

import { styles } from './settings.styles';

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, isLoaded, updateField, saveSettings } = useSettings();

  const handleSave = async () => {
    const success = await saveSettings();
    if (success) {
      router.back();
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>설정 로드 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="뒤로가기"
          >
            <ArrowLeft size={18} color={COLORS.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>설정</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sectionHeader}>
          <FileText size={14} color={COLORS.textSecondary} />
          <Text style={styles.sectionTitle}>보고서 정보</Text>
        </View>

        <View style={styles.card}>
          {/* Agency Name */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <View style={styles.labelGroup}>
                <Building2 size={14} color={COLORS.primaryLight} />
                <Text style={styles.labelText}>기관명</Text>
              </View>
              <Text style={styles.charCount}>
                {settings.agencyName.length}/{MAX_AGENCY_NAME_LENGTH}
              </Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={settings.agencyName}
                onChangeText={(t) =>
                  updateField(
                    'agencyName',
                    t.slice(0, MAX_AGENCY_NAME_LENGTH)
                  )
                }
                placeholder="예: 환경부 한강유역환경청"
                placeholderTextColor="rgba(255,255,255,0.4)"
                autoCapitalize="none"
                autoCorrect={false}
                accessible={true}
                accessibilityLabel="기관명 입력"
              />
              {settings.agencyName.length > 0 && (
                <Pressable
                  onPress={() => updateField('agencyName', '')}
                  style={styles.clearButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="기관명 지우기"
                >
                  <X size={16} color={COLORS.textMuted} />
                </Pressable>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Inspector Name */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <View style={styles.labelGroup}>
                <User size={14} color={COLORS.primaryLight} />
                <Text style={styles.labelText}>담당자명</Text>
              </View>
              <Text style={styles.charCount}>
                {settings.inspectorName.length}/{MAX_INSPECTOR_NAME_LENGTH}
              </Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={settings.inspectorName}
                onChangeText={(t) =>
                  updateField(
                    'inspectorName',
                    t.slice(0, MAX_INSPECTOR_NAME_LENGTH)
                  )
                }
                placeholder="예: 김준호"
                placeholderTextColor="rgba(255,255,255,0.4)"
                autoCapitalize="none"
                autoCorrect={false}
                accessible={true}
                accessibilityLabel="담당자명 입력"
              />
              {settings.inspectorName.length > 0 && (
                <Pressable
                  onPress={() => updateField('inspectorName', '')}
                  style={styles.clearButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="담당자명 지우기"
                >
                  <X size={16} color={COLORS.textMuted} />
                </Pressable>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Notes */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <View style={styles.labelGroup}>
                <StickyNote size={14} color={COLORS.primaryLight} />
                <Text style={styles.labelText}>메모</Text>
              </View>
              <Text style={styles.charCount}>
                {settings.comment.length}/{MAX_COMMENT_LENGTH}
              </Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={settings.comment}
                onChangeText={(t) =>
                  updateField('comment', t.slice(0, MAX_COMMENT_LENGTH))
                }
                placeholder="예: 현장 점검 #047"
                placeholderTextColor="rgba(255,255,255,0.4)"
                autoCapitalize="none"
                autoCorrect={false}
                accessible={true}
                accessibilityLabel="메모 입력"
              />
              {settings.comment.length > 0 && (
                <Pressable
                  onPress={() => updateField('comment', '')}
                  style={styles.clearButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="메모 지우기"
                >
                  <X size={16} color={COLORS.textMuted} />
                </Pressable>
              )}
            </View>
          </View>
        </View>

        <Text style={styles.helperText}>
          입력된 항목은 촬영 사진에 자동으로 표시됩니다.
        </Text>

        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <FileText size={14} color={COLORS.textSecondary} />
          <Text style={styles.sectionTitle}>오버레이 디자인</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.switchGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>배경 박스 표시</Text>
              <Switch
                value={settings.metadataBackgroundEnabled}
                onValueChange={(val) => updateField('metadataBackgroundEnabled', val)}
                trackColor={{ false: '#333', true: COLORS.primary }}
                thumbColor={settings.metadataBackgroundEnabled ? '#FFF' : '#AAA'}
                accessible={true}
                accessibilityLabel="배경 박스 표시 설정 토글"
              />
            </View>
          </View>
        </View>

        {/* Preview */}
        {(settings.agencyName ||
          settings.inspectorName ||
          settings.comment) ? (
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
                  !settings.metadataBackgroundEnabled && styles.previewOverlayNoBg,
                ]}
              >
                {(!!settings.agencyName || !!settings.inspectorName) && (
                  <Text
                    style={[
                      styles.previewAgency,
                      !settings.metadataBackgroundEnabled && {
                        textShadowColor: 'rgba(0,0,0,0.7)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 3,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {[settings.agencyName, settings.inspectorName].filter(Boolean).join(' / ')}
                  </Text>
                )}
                {!!settings.comment && (
                  <Text
                    style={[
                      styles.previewText,
                      !settings.metadataBackgroundEnabled && {
                        textShadowColor: 'rgba(0,0,0,0.7)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 3,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {settings.comment}
                  </Text>
                )}
              </View>
              {/* 워터마크 미리보기 (좌측) */}
              <View style={styles.previewWatermarkLeft}>
                <Text style={styles.watermarkTitle}>{WATERMARK_TEXT}</Text>
              </View>
              {/* 날짜 미리보기 (우측) */}
              <View style={styles.previewWatermarkRight}>
                {(() => {
                  const [datePart, timePart] = formatTimestamp(new Date()).split('\n');
                  return (
                    <View
                      style={[
                        styles.timeBadge,
                        !settings.metadataBackgroundEnabled && {
                          backgroundColor: 'transparent',
                          borderColor: 'transparent',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dateText,
                          !settings.metadataBackgroundEnabled && {
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
                          !settings.metadataBackgroundEnabled && {
                            textShadowColor: 'rgba(0,0,0,0.7)',
                            textShadowOffset: { width: 0, height: 1 },
                            textShadowRadius: 3,
                          },
                        ]}
                      >
                        {timePart}
                      </Text>
                    </View>
                  );
                })()}
              </View>
            </View>
          </View>
        ) : null}

        <Pressable
          style={styles.saveButton}
          onPress={handleSave}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="설정 저장"
        >
          <Save size={16} color="#FFF" />
          <Text style={styles.saveButtonText}>설정 저장</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
