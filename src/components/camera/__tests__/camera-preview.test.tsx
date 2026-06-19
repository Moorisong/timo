import React from 'react';
import { render } from '@testing-library/react-native';
import CameraPreview from '../camera-preview';

// expo-camera Mocking
const mockCameraView = jest.fn();
jest.mock('expo-camera', () => {
  /* eslint-disable-next-line @typescript-eslint/no-require-imports */
  const ReactModule = require('react');
  const MockCameraView = ReactModule.forwardRef((props: any, ref: any) => {
    mockCameraView(props);
    return null;
  });
  MockCameraView.displayName = 'CameraView';
  return {
    CameraView: MockCameraView,
    useCameraPermissions: () => [{ granted: true }, jest.fn()],
  };
});

describe('CameraPreview 컴포넌트 테스트', () => {
  beforeEach(() => {
    mockCameraView.mockClear();
  });

  it('카메라 권한이 있고 정상 상태일 때 CameraView가 animateShutter={false} 및 flash="off"와 함께 렌더링되어야 한다', () => {
    const mockRef = React.createRef<any>();
    const onRequestPermission = jest.fn();

    render(
      <CameraPreview
        cameraRef={mockRef}
        hasPermission={true}
        onRequestPermission={onRequestPermission}
      />
    );

    // 1. CameraView 호출 시 animateShutter={false}가 적용되어 있는지 검증
    expect(mockCameraView).toHaveBeenCalledWith(
      expect.objectContaining({
        animateShutter: false,
        flash: 'off',
      })
    );
  });
});
