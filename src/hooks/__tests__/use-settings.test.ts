import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSettings from '../use-settings';

jest.mock('@react-native-async-storage/async-storage', () => ({
  multiGet: jest.fn().mockResolvedValue([
    ['timo_agency_name', 'Test Agency'],
    ['timo_inspector_name', 'Test Inspector'],
    ['timo_comment', 'Test Comment'],
    ['timo_location_enabled', 'true'],
    ['timo_metadata_background_enabled', 'true'],
  ]),
  multiSet: jest.fn().mockResolvedValue(null),
}));

describe('useSettings Hook 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('초기 렌더링 시 AsyncStorage에서 설정을 올바르게 로드해야 한다', async () => {
    const { result } = renderHook(() => useSettings());

    // loaded state를 기다리기 위해 살짝 대기
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(AsyncStorage.multiGet).toHaveBeenCalled();
    expect(result.current.settings).toEqual({
      agencyName: 'Test Agency',
      inspectorName: 'Test Inspector',
      comment: 'Test Comment',
      locationEnabled: true,
      metadataBackgroundEnabled: true,
    });
  });

  it('updateField를 호출하면 settings 상태가 부분적으로 변경되어야 한다', async () => {
    const { result } = renderHook(() => useSettings());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.updateField('locationEnabled', false);
    });

    expect(result.current.settings.locationEnabled).toBe(false);
  });

  it('saveSettings를 호출하면 AsyncStorage.multiSet이 올바른 매개변수로 호출되어야 한다', async () => {
    const { result } = renderHook(() => useSettings());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.updateField('agencyName', 'New Agency');
    });

    let success;
    await act(async () => {
      success = await result.current.saveSettings();
    });

    expect(success).toBe(true);
    expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
      ['timo_agency_name', 'New Agency'],
      ['timo_inspector_name', 'Test Inspector'],
      ['timo_comment', 'Test Comment'],
      ['timo_location_enabled', 'true'],
      ['timo_metadata_background_enabled', 'true'],
    ]);
  });

  it('메모(comment) 필드를 업데이트하고 저장한 후 다시 로드했을 때 올바르게 반영되어야 한다', async () => {
    const { result } = renderHook(() => useSettings());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // 1. 메모 수정
    act(() => {
      result.current.updateField('comment', 'Updated Inspection Memo');
    });
    expect(result.current.settings.comment).toBe('Updated Inspection Memo');

    // 2. 저장 API 호출 Mocking 설정
    const mockMultiSet = AsyncStorage.multiSet as jest.Mock;
    let saveSuccess;
    await act(async () => {
      saveSuccess = await result.current.saveSettings();
    });
    expect(saveSuccess).toBe(true);
    expect(mockMultiSet).toHaveBeenCalledWith(
      expect.arrayContaining([['timo_comment', 'Updated Inspection Memo']])
    );

    // 3. AsyncStorage multiGet Mocking 변경 후 리로드 테스트
    const mockMultiGet = AsyncStorage.multiGet as jest.Mock;
    mockMultiGet.mockResolvedValueOnce([
      ['timo_agency_name', 'Test Agency'],
      ['timo_inspector_name', 'Test Inspector'],
      ['timo_comment', 'Updated Inspection Memo'],
      ['timo_location_enabled', 'true'],
      ['timo_metadata_background_enabled', 'true'],
    ]);

    await act(async () => {
      await result.current.loadSettings();
    });

    expect(result.current.settings.comment).toBe('Updated Inspection Memo');
  });
});
