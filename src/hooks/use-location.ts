/**
 * GPS 위치 수집 훅
 * expo-location 기반으로 실시간 위치 및 행정 주소 제공
 */

import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

import {
  LOCATION_UPDATE_INTERVAL_MS,
  LOCATION_DISTANCE_FILTER_M,
} from '@/constants';

import type { GpsStatus, LocationData, GpsInfo } from '@/types';

interface UseLocationReturn {
  gpsInfo: GpsInfo;
  requestPermission: () => Promise<boolean>;
  refreshLocation: () => Promise<void>;
}

export default function useLocation(enabled: boolean): UseLocationReturn {
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>('GPS_SEARCHING');
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  const reverseGeocode = useCallback(
    async (latitude: number, longitude: number): Promise<string | null> => {
      try {
        const results = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        if (results.length > 0) {
          const addr = results[0];
          // 1. formattedAddress가 존재하는 경우 우선 사용 (대한민국 등 불필요한 국가명 접두사 제거)
          if (addr.formattedAddress) {
            let cleanAddr = addr.formattedAddress;
            // '대한민국 ' 또는 'South Korea ' 제거
            cleanAddr = cleanAddr.replace(/^(대한민국|South Korea)\s+/, '');
            // 뒤쪽에 ', 대한민국' 또는 ', South Korea'가 붙는 경우 제거
            cleanAddr = cleanAddr.replace(/,\s*(대한민국|South Korea)$/, '');
            // 혹시 콤마로 역순 배치된 영어식 포맷인 경우 한글/기존 순서로 원복할 수도 있으나, 보통 한국 로케일이면 올바른 순서로 들어옵니다.
            // 만약 콤마가 포함되어 있다면 콤마와 양끝 공백을 다듬어줍니다.
            if (cleanAddr.trim()) {
              return cleanAddr.trim();
            }
          }

          // 2. formattedAddress가 없을 때의 Fallback 조합 로직
          const parts: string[] = [];
          
          if (addr.country) {
            parts.push(addr.country);
          }
          if (addr.region && addr.region !== addr.country) {
            parts.push(addr.region);
          }
          if (addr.subregion && addr.subregion !== addr.region) {
            parts.push(addr.subregion);
          }
          if (addr.city && addr.city !== addr.subregion && addr.city !== addr.region) {
            parts.push(addr.city);
          }
          if (addr.district && addr.district !== addr.city && addr.district !== addr.subregion) {
            parts.push(addr.district);
          }
          if (addr.street) {
            parts.push(addr.street);
          }
          if (addr.streetNumber) {
            parts.push(addr.streetNumber);
          }
          if (addr.name && 
              addr.name !== addr.street && 
              addr.name !== addr.streetNumber && 
              addr.name !== addr.district && 
              addr.name !== addr.city) {
            parts.push(addr.name);
          }
          
          return parts.filter(Boolean).join(' ') || null;
        }
        return null;
      } catch {
        return null;
      }
    },
    []
  );

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsStatus('GPS_OFF');
        return false;
      }
      return true;
    } catch {
      setGpsStatus('GPS_ERROR');
      return false;
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    try {
      setGpsStatus('GPS_SEARCHING');
      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const address = await reverseGeocode(
        current.coords.latitude,
        current.coords.longitude
      );
      setLocationData({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        address,
      });
      setGpsStatus('GPS_OK');
    } catch {
      setGpsStatus('GPS_ERROR');
    }
  }, [reverseGeocode]);

  useEffect(() => {
    if (!enabled) {
      setGpsStatus('GPS_OFF');
      setLocationData(null);
      return;
    }

    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      const granted = await requestPermission();
      if (!granted) return;

      setGpsStatus('GPS_SEARCHING');

      try {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: LOCATION_UPDATE_INTERVAL_MS,
            distanceInterval: LOCATION_DISTANCE_FILTER_M,
          },
          async (loc) => {
            const address = await reverseGeocode(
              loc.coords.latitude,
              loc.coords.longitude
            );
            setLocationData({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              address,
            });
            setGpsStatus('GPS_OK');
          }
        );
      } catch {
        setGpsStatus('GPS_ERROR');
      }
    };

    startWatching();

    return () => {
      subscription?.remove();
    };
  }, [enabled, requestPermission, reverseGeocode]);

  const gpsInfo: GpsInfo = {
    status: gpsStatus,
    location: locationData,
  };

  return { gpsInfo, requestPermission, refreshLocation };
}
