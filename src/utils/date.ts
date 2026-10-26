export function timeAgo(ts: number): string {
  const m = Math.max(1, Math.round((Date.now() - ts) / 60_000));
  if (m < 60) return `${m} мин назад`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h} ч назад` : `${Math.floor(h / 24)} дн назад`;
}