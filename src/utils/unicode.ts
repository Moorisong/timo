/**
 * 유니코드 및 이모지 안전 문자열 처리 유틸리티
 */

/**
 * 이모지(Surrogate Pair)를 고려하여 문자열의 실제 문자 길이를 반환합니다.
 * @param str 입력 문자열
 * @returns 실제 문자 개수
 */
export function getUnicodeLength(str: string): number {
  if (!str) return 0;
  return [...str].length;
}

/**
 * 이모지가 쪼개져 깨지지 않도록 코드 포인트 단위로 문자열을 자릅니다.
 * @param str 입력 문자열
 * @param limit 제한할 문자 수
 * @returns 제한 길이만큼 안전하게 잘린 문자열
 */
export function sliceUnicode(str: string, limit: number): string {
  if (!str) return '';
  if (limit <= 0) return '';
  const arr = [...str];
  if (arr.length <= limit) return str;
  return arr.slice(0, limit).join('');
}
