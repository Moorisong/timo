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
          } else if (addr.name && addr.name !== addr.street && addr.name !== addr.district) {
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
