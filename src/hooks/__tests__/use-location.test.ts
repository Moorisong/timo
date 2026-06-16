import { renderHook, act } from '@testing-library/react-native';
import * as Location from 'expo-location';
import useLocation from '../use-location';

// expo-location Mocking
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 37.5665,
      longitude: 126.9780,
    },
  }),
  watchPositionAsync: jest.fn().mockImplementation((options, callback) => {
    // 즉시 좌표 콜백 실행
    callback({
      coords: {
        latitude: 37.5665,
        longitude: 126.9780,
      },
    });
    return Promise.resolve({
      remove: jest.fn(),
    });
  }),
  reverseGeocodeAsync: jest.fn().mockResolvedValue([
    {
      country: '대한민국',
      region: '서울특별시',
      subregion: '마포구',
      city: '마포구',
      district: '아현동',
      street: '마포대로',
      streetNumber: '123',
      name: '마포빌딩',
      formattedAddress: '대한민국 서울특별시 마포구 아현동 마포대로 123 마포빌딩',
    },
  ]),
  Accuracy: {
    Balanced: 3,
  },
}));

describe('useLocation Hook 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('위치가 켜졌을 때 상세 주소(대한민국 서울특별시 마포구 아현동 마포대로 123)가 올바르게 조합되어 출력되어야 한다', async () => {
    const { result } = renderHook(() => useLocation(true));

    // startWatching 및 reverseGeocode 비동기 연산 기다리기
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
    expect(Location.watchPositionAsync).toHaveBeenCalled();
    expect(result.current.gpsInfo.status).toBe('GPS_OK');
    expect(result.current.gpsInfo.location).toEqual({
      latitude: 37.5665,
      longitude: 126.9780,
      address: '서울특별시 마포구 아현동 마포대로 123 마포빌딩',
    });
  });

  it('refreshLocation을 실행하면 getCurrentPositionAsync 및 reverseGeocodeAsync를 거쳐 상세 주소가 수집되어야 한다', async () => {
    const { result } = renderHook(() => useLocation(true));

    await act(async () => {
      await result.current.refreshLocation();
    });

    expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
    expect(result.current.gpsInfo.status).toBe('GPS_OK');
    expect(result.current.gpsInfo.location?.address).toBe('서울특별시 마포구 아현동 마포대로 123 마포빌딩');
  });
});
