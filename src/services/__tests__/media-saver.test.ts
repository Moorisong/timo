import { saveImageToGallery, requestMediaPermission } from '../media-saver';
import * as MediaLibrary from 'expo-media-library';

jest.mock('expo-media-library', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  createAssetAsync: jest.fn(),
  getAlbumAsync: jest.fn(),
  createAlbumAsync: jest.fn(),
  addAssetsToAlbumAsync: jest.fn(),
}));

// Mock Constants
jest.mock('@/constants', () => ({
  SAVE_ALBUM_NAME: 'Camera',
  SAVE_FILE_PREFIX: 'Timo_',
}));

describe('media-saver 서비스 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestMediaPermission 테스트', () => {
    it('이미 권한이 부여된 경우, requestPermissionsAsync를 호출하지 않고 true를 반환해야 한다', async () => {
      (MediaLibrary.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: true,
        status: 'granted',
      });

      const result = await requestMediaPermission();

      expect(result).toBe(true);
      expect(MediaLibrary.getPermissionsAsync).toHaveBeenCalledWith(true);
      expect(MediaLibrary.requestPermissionsAsync).not.toHaveBeenCalled();
    });

    it('권한이 없고 새로 권한을 요청하여 허용된 경우 true를 반환해야 한다', async () => {
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

  describe('saveImageToGallery 테스트', () => {
    it('미디어 권한이 없고 createAssetAsync도 실패하면 false를 반환해야 한다', async () => {
      (MediaLibrary.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: false,
        status: 'denied',
      });
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: false,
        status: 'denied',
      });
      (MediaLibrary.createAssetAsync as jest.Mock).mockRejectedValueOnce(new Error('Permission Denied'));

      const result = await saveImageToGallery('file://test.jpg');

      expect(result).toBe(false);
      expect(MediaLibrary.createAssetAsync).toHaveBeenCalledWith('file://test.jpg');
    });

    it('권한이 있고 앨범명이 "Camera"인 경우 앨범 생성/이동 없이 true를 반환해야 한다', async () => {
      (MediaLibrary.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: true,
        status: 'granted',
      });
      const mockAsset = { id: 'asset-1' };
      (MediaLibrary.createAssetAsync as jest.Mock).mockResolvedValue(mockAsset);

      const result = await saveImageToGallery('file://test.jpg');

      expect(result).toBe(true);
      expect(MediaLibrary.createAssetAsync).toHaveBeenCalledWith('file://test.jpg');
      expect(MediaLibrary.getAlbumAsync).not.toHaveBeenCalled();
      expect(MediaLibrary.createAlbumAsync).not.toHaveBeenCalled();
    });
  });
});
