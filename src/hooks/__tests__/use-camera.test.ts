import { renderHook, act } from '@testing-library/react-native';
import useCamera from '../use-camera';

// CameraView Mocking
const mockTakePictureAsync = jest.fn();
jest.mock('expo-camera', () => {
  /* eslint-disable-next-line @typescript-eslint/no-require-imports */
  const ReactModule = require('react');
  const MockCameraView = ReactModule.forwardRef((props: any, ref: any) => {
    ReactModule.useImperativeHandle(ref, () => ({
      takePictureAsync: mockTakePictureAsync,
    }));
    return null;
  });
  MockCameraView.displayName = 'CameraView';
  return {
    CameraView: MockCameraView,
    useCameraPermissions: () => [{ granted: true }, jest.fn()],
  };
});

// Constants Mocking
jest.mock('@/constants', () => ({
  CAMERA_QUALITY: 0.9,
}));

describe('useCamera Hook 테스트', () => {
  beforeEach(() => {
    mockTakePictureAsync.mockReset();
  });

  it('takePictureAsync가 성공하면 이미지 정보(uri, width, height)와 exif: true 옵션을 전달해야 한다', async () => {
    const mockPhoto = {
      uri: 'file://test-image.jpg',
      width: 1920,
      height: 1080,
    };
    mockTakePictureAsync.mockResolvedValueOnce(mockPhoto);

    const { result } = renderHook(() => useCamera());

    // mock ref 설정
    const dummyRef = {
      takePictureAsync: mockTakePictureAsync,
    };
    result.current.cameraRef.current = dummyRef as any;

    let photoResult;
    await act(async () => {
      photoResult = await result.current.takePicture();
    });

    // 1. exif: true와 quality가 올바르게 전달되었는지 확인
    expect(mockTakePictureAsync).toHaveBeenCalledWith({
      quality: 0.9,
      exif: true,
    });

    // 2. 반환 타입에 width, height가 제대로 포함되었는지 확인
    expect(photoResult).toEqual({
      uri: 'file://test-image.jpg',
      width: 1920,
      height: 1080,
    });
  });

  it('EXIF Orientation이 6(90도 회전)인 경우 width와 height가 서로 바뀌어 반환되어야 한다', async () => {
    const mockPhoto = {
      uri: 'file://test-image-rotated.jpg',
      width: 4000,
      height: 3000,
      exif: {
        Orientation: 6,
      },
    };
    mockTakePictureAsync.mockResolvedValueOnce(mockPhoto);

    const { result } = renderHook(() => useCamera());

    const dummyRef = {
      takePictureAsync: mockTakePictureAsync,
    };
    result.current.cameraRef.current = dummyRef as any;

    let photoResult;
    await act(async () => {
      photoResult = await result.current.takePicture();
    });

    expect(photoResult).toEqual({
      uri: 'file://test-image-rotated.jpg',
      width: 3000,
      height: 4000,
    });
  });
});
