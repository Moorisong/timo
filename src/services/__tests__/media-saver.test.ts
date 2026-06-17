import { saveImageToGallery, requestMediaPermission } from '../media-saver';
import * as MediaLibrary from 'expo-media-library';

jest.mock('expo-media-library', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  saveToLibraryAsync: jest.fn(),
}));

// Mock Constants
jest.mock('@/constants', () => ({
  SAVE_FILE_PREFIX: 'Timo_',
}));

describe('media-saver 서비스 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestMediaPermission 테스트 (최초 1회 권한 창 검증)', () => {
    it('이미 쓰기 권한이 부여된 경우, requestPermissionsAsync를 호출하지 않고 true를 반환해야 한다', async () => {
      (MediaLibrary.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: true,
        status: 'granted',
      });

      const result = await requestMediaPermission();

      expect(result).toBe(true);
      expect(MediaLibrary.getPermissionsAsync).toHaveBeenCalledWith(true);
      expect(MediaLibrary.requestPermissionsAsync).not.toHaveBeenCalled();
    });

    it('권한이 없고 새로 쓰기 권한을 요청하여 허용된 경우 true를 반환해야 한다', async () => {
      (MediaLibrary.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: false,
        status: 'undetermined',
      });
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: true,
        status: 'granted',
      });

      const result = await requestMediaPermission();

      expect(result).toBe(true);
      expect(MediaLibrary.getPermissionsAsync).toHaveBeenCalledWith(true);
      expect(MediaLibrary.requestPermissionsAsync).toHaveBeenCalledWith(true);
    });

    it('시나리오: 권한이 허용된 이후 두 번째 저장 시도부터는 권한 허용 창(requestPermissionsAsync)이 절대 뜨지 않아야 한다', async () => {
      // 1. 최초 상태: 권한 없음
      (MediaLibrary.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        granted: false,
        status: 'undetermined',
      });
      // 최초 권한 요청 시 허용됨
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        granted: true,
        status: 'granted',
      });

      // 최초 시도
      const firstResult = await requestMediaPermission();
      expect(firstResult).toBe(true);
      expect(MediaLibrary.getPermissionsAsync).toHaveBeenCalledTimes(1);
      expect(MediaLibrary.requestPermissionsAsync).toHaveBeenCalledTimes(1); // 창 1회 노출

      // 2. 두 번째 상태: 이제 권한 있음
      (MediaLibrary.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        granted: true,
        status: 'granted',
      });

      // 두 번째 시도
      const secondResult = await requestMediaPermission();
      expect(secondResult).toBe(true);
      expect(MediaLibrary.getPermissionsAsync).toHaveBeenCalledTimes(2);
      // requestPermissionsAsync는 더 이상 호출되지 않아야 함 (여전히 1회 노출 상태 유지)
      expect(MediaLibrary.requestPermissionsAsync).toHaveBeenCalledTimes(1);
    });

    it('시나리오: 권한 요청이 거부되고 다시 묻지 않기가 활성화된 경우(canAskAgain: false) Alert 팝업을 띄우고 false를 반환해야 한다', async () => {
      const { Alert, Linking } = require('react-native');
      jest.spyOn(Alert, 'alert');
      jest.spyOn(Linking, 'openSettings');

      (MediaLibrary.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: false,
        status: 'undetermined',
      });
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: false,
        status: 'denied',
        canAskAgain: false,
      });

      const result = await requestMediaPermission();

      expect(result).toBe(false);
      expect(Alert.alert).toHaveBeenCalledWith(
        '권한 확인',
        '사진을 저장하려면 갤러리 쓰기 권한이 필요합니다. 기기의 설정에서 권한을 허용해주세요.',
        expect.any(Array)
      );
      
      // Alert의 '설정으로 이동' 버튼 시뮬레이션
      const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
      const settingsButton = buttons.find((b: any) => b.text === '설정으로 이동');
      settingsButton.onPress();
      expect(Linking.openSettings).toHaveBeenCalled();

      jest.restoreAllMocks();
    });

    it('시나리오: 권한 요청이 단순 거부된 경우(canAskAgain: true) Alert를 띄우지 않고 false를 반환해야 한다', async () => {
      const { Alert } = require('react-native');
      jest.spyOn(Alert, 'alert');

      (MediaLibrary.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: false,
        status: 'undetermined',
      });
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: false,
        status: 'denied',
        canAskAgain: true,
      });

      const result = await requestMediaPermission();

      expect(result).toBe(false);
      expect(Alert.alert).not.toHaveBeenCalled();

      jest.restoreAllMocks();
    });
  });

  describe('saveImageToGallery 테스트 (DCIM 단일 저장 검증)', () => {
    it('미디어 권한이 없으면 saveToLibraryAsync를 호출하지 않고 즉시 false를 반환해야 한다', async () => {
      (MediaLibrary.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: false,
        status: 'denied',
      });
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: false,
        status: 'denied',
      });

      const result = await saveImageToGallery('file://test.jpg');

      expect(result).toBe(false);
      expect(MediaLibrary.saveToLibraryAsync).not.toHaveBeenCalled();
    });

    it('권한이 있으면 커스텀 앨범 조작 없이 saveToLibraryAsync만 호출하여 DCIM에 1장만 저장해야 한다', async () => {
      (MediaLibrary.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: true,
        status: 'granted',
      });
      (MediaLibrary.saveToLibraryAsync as jest.Mock).mockResolvedValue(true);

      const result = await saveImageToGallery('file://test.jpg');

      expect(result).toBe(true);
      expect(MediaLibrary.saveToLibraryAsync).toHaveBeenCalledWith('file://test.jpg');
    });

    it('코드 내에 iOS 관련 분기 처리(Platform.OS === "ios" 등)가 포함되지 않아야 한다 (Android 전용 앱 보장)', () => {
      const fs = require('fs');
      const path = require('path');
      const sourceCode = fs.readFileSync(path.resolve(__dirname, '../media-saver.ts'), 'utf-8');
      expect(sourceCode.toLowerCase()).not.toContain('ios');
      expect(sourceCode).not.toContain('Platform.OS');
    });
  });
});
