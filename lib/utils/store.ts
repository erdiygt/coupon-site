export function clampStoreRating(value: number): number {
  if (Number.isNaN(value)) return 4.5;
  return Math.min(5, Math.max(1, Number(value.toFixed(1))));
}

export function sanitizeReviewCount(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.floor(value));
}
