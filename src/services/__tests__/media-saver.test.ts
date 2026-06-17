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
      expect(MediaLibrary.getPermissionsAsync).toHaveBeenCalledWith({ writeOnly: true });
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
      expect(MediaLibrary.getPermissionsAsync).toHaveBeenCalledWith({ writeOnly: true });
      expect(MediaLibrary.requestPermissionsAsync).toHaveBeenCalledWith({ writeOnly: true });
    });

    it('권한 요청이 거부된 경우 false를 반환해야 한다', async () => {
      (MediaLibrary.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: false,
        status: 'undetermined',
      });
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: false,
        status: 'denied',
      });

      const result = await requestMediaPermission();

      expect(result).toBe(false);
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
