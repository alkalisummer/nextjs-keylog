export const formatTimeAgo = (pressDateArr: number[]) => {
  if (!Array.isArray(pressDateArr) || pressDateArr.length === 0) return '';
  const pressDate = pressDateArr[0] * 1000; // 초 → 밀리초
  const now = Date.now();
  const diffMs = now - pressDate;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return `${diffDay}일 전`;
};
