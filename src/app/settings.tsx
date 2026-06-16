/**
 * Settings Screen
 * AsyncStorage 기반 설정 저장/로드
 */

import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
} from '@/constants';
import useSettings from '@/hooks/use-settings';
import { SettingsPreview } from '@/components/settings-preview';

import { styles } from './settings.styles';


export default function SettingsScreen() {
  const router = useRouter();
  const { settings, isLoaded, updateField, saveSettings } = useSettings();
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

        {/* Agency Name */}
        <View
          style={[
            styles.inputCard,
            focusedField === 'agencyName' && styles.inputCardFocused,
          ]}
        >
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
                onFocus={() => setFocusedField('agencyName')}
                onBlur={() => setFocusedField(null)}
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
        </View>

        {/* Inspector Name */}
        <View
          style={[
            styles.inputCard,
            focusedField === 'inspectorName' && styles.inputCardFocused,
          ]}
        >
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
                onFocus={() => setFocusedField('inspectorName')}
                onBlur={() => setFocusedField(null)}
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
        </View>

        {/* Notes */}
        <View
          style={[
            styles.inputCard,
            focusedField === 'comment' && styles.inputCardFocused,
          ]}
        >
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
                onFocus={() => setFocusedField('comment')}
                onBlur={() => setFocusedField(null)}
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

          <View style={styles.divider} />

          <View style={styles.switchGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>위치 정보 표시</Text>
              <Switch
                value={settings.locationEnabled}
                onValueChange={(val) => updateField('locationEnabled', val)}
                trackColor={{ false: '#333', true: COLORS.primary }}
                thumbColor={settings.locationEnabled ? '#FFF' : '#AAA'}
                accessible={true}
                accessibilityLabel="위치 정보 표시 설정 토글"
              />
            </View>
          </View>
        </View>

        {/* Preview */}
        <SettingsPreview
          agencyName={settings.agencyName}
          inspectorName={settings.inspectorName}
          comment={settings.comment}
          metadataBackgroundEnabled={settings.metadataBackgroundEnabled}
          locationEnabled={settings.locationEnabled}
        />

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
