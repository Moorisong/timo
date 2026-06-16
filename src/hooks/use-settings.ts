/**
 * 설정 저장/로드 훅
 * AsyncStorage 기반 온디바이스 설정 관리
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import {
  STORAGE_KEY_AGENCY_NAME,
  STORAGE_KEY_INSPECTOR_NAME,
  STORAGE_KEY_COMMENT,
  STORAGE_KEY_LOCATION_ENABLED,
  DEFAULT_SETTINGS,
} from '@/constants';

import type { Settings } from '@/types';

interface UseSettingsReturn {
  settings: Settings;
  isLoaded: boolean;
  updateField: <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => void;
  saveSettings: () => Promise<boolean>;
  loadSettings: () => Promise<void>;
}

const STORAGE_MAP: Record<keyof Settings, string> = {
  agencyName: STORAGE_KEY_AGENCY_NAME,
  inspectorName: STORAGE_KEY_INSPECTOR_NAME,
  comment: STORAGE_KEY_COMMENT,
  locationEnabled: STORAGE_KEY_LOCATION_ENABLED,
};

export default function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<Settings>({
    ...DEFAULT_SETTINGS,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      const keys = Object.values(STORAGE_MAP);
      const pairs = await AsyncStorage.multiGet(keys);
      const loaded: Partial<Settings> = {};

      for (const [key, value] of pairs) {
        if (value === null) continue;

        if (key === STORAGE_KEY_AGENCY_NAME) {
          loaded.agencyName = value;
        } else if (key === STORAGE_KEY_INSPECTOR_NAME) {
          loaded.inspectorName = value;
        } else if (key === STORAGE_KEY_COMMENT) {
          loaded.comment = value;
        } else if (key === STORAGE_KEY_LOCATION_ENABLED) {
          loaded.locationEnabled = value === 'true';
        }
      }

      setSettings((prev) => ({ ...prev, ...loaded }));
    } catch (error) {
      if (__DEV__) {
        console.error('설정 로드 실패:', error);
      }
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const updateField = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const saveSettings = useCallback(async (): Promise<boolean> => {
    try {
      const pairs: [string, string][] = [
        [STORAGE_KEY_AGENCY_NAME, settings.agencyName],
        [STORAGE_KEY_INSPECTOR_NAME, settings.inspectorName],
        [STORAGE_KEY_COMMENT, settings.comment],
        [STORAGE_KEY_LOCATION_ENABLED, String(settings.locationEnabled)],
      ];

      await AsyncStorage.multiSet(pairs);
      return true;
    } catch (error) {
      if (__DEV__) {
        console.error('설정 저장 실패:', error);
      }
      Alert.alert('저장 실패', '설정 저장 중 오류가 발생했습니다.');
      return false;
    }
  }, [settings]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return { settings, isLoaded, updateField, saveSettings, loadSettings };
}
