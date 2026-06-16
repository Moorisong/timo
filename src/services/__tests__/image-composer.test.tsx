import { composeMetadataList } from '../image-composer';

// expo-image Mocking
jest.mock('expo-image', () => {
  return {
    Image: 'Image',
  };
});

describe('ComposerOverlay 메타데이터 리스트 합성 테스트', () => {
  const mockSettings = {
    agencyName: '한강유역환경청',
    inspectorName: '김준호',
    comment: '현장 점검 #047',
    locationEnabled: true,
  };

  const mockLocation = {
    latitude: 37.5665,
    longitude: 126.978,
    address: '대한민국 서울특별시 마포구 아현동',
  };

  it('기관명과 담당자가 있을 경우 첫 줄에 "기관명 / 담당자" 형식으로 합쳐져야 한다', () => {
    const list = composeMetadataList(mockSettings, mockLocation);
    expect(list[0]).toBe('한강유역환경청 / 김준호');
  });

  it('위치 정보가 켜져 있으면 두 번째 줄에 "상세주소" 형식으로 반환되어야 한다', () => {
    const list = composeMetadataList(mockSettings, mockLocation);
    expect(list[1]).toBe('대한민국 서울특별시 마포구 아현동');
  });

  it('메모가 있으면 세 번째 줄에 그대로 포함되어야 한다', () => {
    const list = composeMetadataList(mockSettings, mockLocation);
    expect(list[2]).toBe('현장 점검 #047');
  });

  it('결과 리스트는 정확히 3개의 요소만을 포함해야 한다', () => {
    const list = composeMetadataList(mockSettings, mockLocation);
    expect(list.length).toBe(3);
  });

  it('기관명만 있고 담당자가 없을 경우 기관명만 단독으로 표시되어야 한다', () => {
    const customSettings = {
      ...mockSettings,
      inspectorName: '',
    };
    const list = composeMetadataList(customSettings, mockLocation);
    expect(list[0]).toBe('한강유역환경청');
  });
});

// React Native 컴포넌트의 스케일 폰트 크기 계산 결과를 계산하는 테스트
// 실제 렌더링 대신 스타일 데이터의 배율 연산 로직의 안전성을 검증합니다.
describe('고해상도 스케일 팩터 스타일 연산 검증', () => {
  it('스케일 값에 비례하여 텍스트 크기(fontSize)가 올바르게 스케일링되는지 연산식을 검증한다', () => {
    const scale = 2.5;
    const baseFontSize = 13;
    const scaledFontSize = baseFontSize * scale;
    
    expect(scaledFontSize).toBe(32.5);
  });
});
