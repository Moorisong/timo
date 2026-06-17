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
  SAVE_ALBUM_NAME: 'Timo',
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
      expect(MediaLibrary.getPermissionsAsync).toHaveBeenCalledWith();
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
      expect(MediaLibrary.getPermissionsAsync).toHaveBeenCalledWith();
      expect(MediaLibrary.requestPermissionsAsync).toHaveBeenCalledWith();
    });

    it('일반 권한 요청 시 에러가 나면, writeOnly: true 옵션을 사용하여 권한 획득을 재시도해야 한다', async () => {
      // 첫 번째 getPermissionsAsync 호출은 에러를 던져 폴백을 유도합니다.
      (MediaLibrary.getPermissionsAsync as jest.Mock)
        .mockRejectedValueOnce(new Error('Kotlin Type Conversion Error'))
        .mockResolvedValueOnce({
          granted: false,
          status: 'undetermined',
        });
      
      (MediaLibrary.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: true,
        status: 'granted',
      });

      const result = await requestMediaPermission();

      expect(result).toBe(true);
      expect(MediaLibrary.getPermissionsAsync).toHaveBeenLastCalledWith({ writeOnly: true });
      expect(MediaLibrary.requestPermissionsAsync).toHaveBeenCalledWith({ writeOnly: true });
    });

    it('모든 권한 요청이 거부된 경우 false를 반환해야 한다', async () => {
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
    it('미디어 권한이 없으면 createAssetAsync를 호출하지 않고 즉시 false를 반환해야 한다', async () => {
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
      expect(MediaLibrary.createAssetAsync).not.toHaveBeenCalled();
    });

    it('권한이 있고 Timo 앨범이 존재하지 않는 경우, copyAsset을 false로 설정하여 자산을 이동시켜 앨범을 생성해야 한다', async () => {
      (MediaLibrary.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: true,
        status: 'granted',
      });
      const mockAsset = { id: 'asset-1' };
      (MediaLibrary.createAssetAsync as jest.Mock).mockResolvedValue(mockAsset);
      (MediaLibrary.getAlbumAsync as jest.Mock).mockResolvedValue(null);
      (MediaLibrary.createAlbumAsync as jest.Mock).mockResolvedValue({ id: 'album-1' });

      const result = await saveImageToGallery('file://test.jpg');

      expect(result).toBe(true);
      expect(MediaLibrary.createAssetAsync).toHaveBeenCalledWith('file://test.jpg');
      expect(MediaLibrary.getAlbumAsync).toHaveBeenCalledWith('Timo');
      expect(MediaLibrary.createAlbumAsync).toHaveBeenCalledWith('Timo', mockAsset, false);
    });

    it('권한이 있고 Timo 앨범이 이미 존재하는 경우, copyAsset을 false로 설정하여 자산을 이동시켜 기존 앨범에 자산을 추가해야 한다', async () => {
      (MediaLibrary.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: true,
        status: 'granted',
      });
      const mockAsset = { id: 'asset-1' };
      (MediaLibrary.createAssetAsync as jest.Mock).mockResolvedValue(mockAsset);
      const mockAlbum = { id: 'album-1', title: 'Timo' };
      (MediaLibrary.getAlbumAsync as jest.Mock).mockResolvedValue(mockAlbum);

      const result = await saveImageToGallery('file://test.jpg');

      expect(result).toBe(true);
      expect(MediaLibrary.createAssetAsync).toHaveBeenCalledWith('file://test.jpg');
      expect(MediaLibrary.getAlbumAsync).toHaveBeenCalledWith('Timo');
      expect(MediaLibrary.createAlbumAsync).not.toHaveBeenCalled();
      expect(MediaLibrary.addAssetsToAlbumAsync).toHaveBeenCalledWith([mockAsset], mockAlbum, false);
    });
  });
});
