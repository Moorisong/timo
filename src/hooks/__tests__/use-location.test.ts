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
    Low: 2,
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

  it('가짜 GPS 앱(모의 위치) 사용 시 watchPositionAsync에서 조작된 위치로 감지되어야 한다', async () => {
    (Location.watchPositionAsync as jest.Mock).mockImplementationOnce((options, callback) => {
      callback({
        coords: {
          latitude: 37.5665,
          longitude: 126.9780,
        },
        mocked: true, // 모의 위치 반환
      });
      return Promise.resolve({
        remove: jest.fn(),
      });
    });

    const { result } = renderHook(() => useLocation(true));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(result.current.gpsInfo.status).toBe('GPS_MOCKED');
    expect(result.current.gpsInfo.location).toBeNull();
  });

  it('가짜 GPS 앱(모의 위치) 사용 시 refreshLocation에서 조작된 위치로 감지되어야 한다', async () => {
    (Location.watchPositionAsync as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({
        remove: jest.fn(),
      });
    });

    // 마운트 시 1회 고속 수집은 정상 좌표, refreshLocation 시 2회째 수집은 모의 위치 반환하도록 순차적으로 모의
    (Location.getCurrentPositionAsync as jest.Mock)
      .mockResolvedValueOnce({
        coords: {
          latitude: 37.5665,
          longitude: 126.9780,
        },
      })
      .mockResolvedValueOnce({
        coords: {
          latitude: 37.5665,
          longitude: 126.9780,
        },
        mocked: true, // 모의 위치 반환
      });

    const { result } = renderHook(() => useLocation(true));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    await act(async () => {
      await result.current.refreshLocation();
    });

    expect(Location.getCurrentPositionAsync).toHaveBeenCalledTimes(2);
    expect(result.current.gpsInfo.status).toBe('GPS_MOCKED');
    expect(result.current.gpsInfo.location).toBeNull();
  });

  it('초기 마운트 시 getCurrentPositionAsync를 Accuracy.Low 설정으로 즉각적인 초기 위치 1회 조회를 선행해야 한다', async () => {
    renderHook(() => useLocation(true));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    expect(Location.getCurrentPositionAsync).toHaveBeenCalledWith(
      expect.objectContaining({ accuracy: Location.Accuracy.Low })
    );
  });

  it('위치 좌표 변화가 거의 없을 경우(1m 이내) reverseGeocodeAsync 호출을 건너뛰고 기존 주소를 재사용해야 한다', async () => {
    let watchCallback: ((loc: any) => void) | null = null;
    (Location.watchPositionAsync as jest.Mock).mockImplementationOnce((options, callback) => {
      watchCallback = callback;
      return Promise.resolve({
        remove: jest.fn(),
      });
    });

    const { result } = renderHook(() => useLocation(true));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    // reverseGeocodeAsync의 mock 초기 호출 회수 기록
    const initialGeocodeCalls = (Location.reverseGeocodeAsync as jest.Mock).mock.calls.length;

    // 미미한 위치 변화 발생 (약 1m 이내: 0.000005 변화)
    await act(async () => {
      if (watchCallback) {
        (watchCallback as (loc: any) => void)({
          coords: {
            latitude: 37.5665 + 0.000005,
            longitude: 126.9780 + 0.000005,
          },
        });
      }
    });

    // 주소 변환 API가 추가로 호출되지 않았어야 함
    expect((Location.reverseGeocodeAsync as jest.Mock).mock.calls.length).toBe(initialGeocodeCalls);
    // 기존 주소를 잘 활용하여 상태 유지
    expect(result.current.gpsInfo.location?.address).toBe('서울특별시 마포구 아현동 마포대로 123 마포빌딩');
  });

  it('훅이 언마운트되면 watchPositionAsync의 subscription.remove()가 정상적으로 호출되어 메모리가 정리되어야 한다', async () => {
    const mockRemove = jest.fn();
    (Location.watchPositionAsync as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({
        remove: mockRemove,
      });
    });

    const { unmount } = renderHook(() => useLocation(true));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    // 언마운트 수행
    unmount();

    expect(mockRemove).toHaveBeenCalled();
  });

  it('초기 위치 수집(getCurrentPositionAsync)이 2초 이상 지연되어 타임아웃이 발생해도, watchPositionAsync를 통해 정상 복구 및 수집을 진행해야 한다', async () => {
    // getCurrentPositionAsync가 3초 이상 늦게 응답하도록 설정 (2초 타임아웃 유발)
    (Location.getCurrentPositionAsync as jest.Mock).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({ coords: { latitude: 37.5665, longitude: 126.9780 } }), 3000))
    );

    // watchPositionAsync는 정상적으로 즉시 갱신 좌표 콜백 실행하도록 설정
    (Location.watchPositionAsync as jest.Mock).mockImplementationOnce((options, callback) => {
      callback({
        coords: {
          latitude: 37.5665,
          longitude: 126.9780,
        },
      });
      return Promise.resolve({
        remove: jest.fn(),
      });
    });

    const { result } = renderHook(() => useLocation(true));

    // 2초 타임아웃 대기 및 watchPositionAsync 실행 완료를 위한 대기
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 2100));
    });

    // 타임아웃이 났음에도 watchPositionAsync가 정상 가동되어 최종적으로 위치 정보를 제대로 획득했어야 함
    expect(result.current.gpsInfo.status).toBe('GPS_OK');
    expect(result.current.gpsInfo.location?.address).toBe('서울특별시 마포구 아현동 마포대로 123 마포빌딩');
  });
});
