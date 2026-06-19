import { getUnicodeLength, sliceUnicode } from '../unicode';

describe('unicode 유틸리티 테스트', () => {
  describe('getUnicodeLength', () => {
    it('빈 문자열의 길이는 0이어야 한다', () => {
      expect(getUnicodeLength('')).toBe(0);
    });

    it('일반 영문/한글 문자열의 길이를 올바르게 구해야 한다', () => {
      expect(getUnicodeLength('Hello')).toBe(5);
      expect(getUnicodeLength('안녕하세요')).toBe(5);
    });

    it('이모지가 포함된 문자열의 길이를 문자 수 단위로 올바르게 구해야 한다', () => {
      // 일반적인 이모지(😀)는 surrogate pair로 .length 시 2가 나오지만, getUnicodeLength는 1이어야 함
      expect(getUnicodeLength('😀')).toBe(1);
      expect(getUnicodeLength('한국어😀')).toBe(4);
    });
  });

  describe('sliceUnicode', () => {
    it('빈 문자열이나 0 이하 제한인 경우 빈 문자열을 반환해야 한다', () => {
      expect(sliceUnicode('', 5)).toBe('');
      expect(sliceUnicode('Hello', 0)).toBe('');
      expect(sliceUnicode('Hello', -1)).toBe('');
    });

    it('제한 수보다 짧은 문자열은 그대로 반환해야 한다', () => {
      expect(sliceUnicode('Hello', 10)).toBe('Hello');
    });

    it('이모지가 없는 문자열을 올바르게 잘라내야 한다', () => {
      expect(sliceUnicode('안녕하세요', 3)).toBe('안녕하');
    });

    it('이모지가 쪼개지지 않고 안전하게 제한 길이만큼 잘려야 한다', () => {
      const text = '기관명😀담당자';
      // '기관명😀담당자'는 유니코드 상 7자
      // '기관명😀'는 4자
      expect(sliceUnicode(text, 4)).toBe('기관명😀');
      expect(sliceUnicode(text, 3)).toBe('기관명');
    });
  });
});
