/**
 * 날짜/시간 포맷 유틸리티
 */

/**
 * Date 객체를 yyyy-MM-dd HH:mm:ss 형식 문자열로 변환
 */
export function formatTimestamp(date: Date): string {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${mo}-${d}\n${h}:${mi}:${s}`;
}

/**
 * Date 객체를 파일명용 포맷 yyyyMMdd_HHmmss으로 변환
 */
export function formatTimestampForFile(date: Date): string {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}${mo}${d}_${h}${mi}${s}`;
}
