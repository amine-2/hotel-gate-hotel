export function calculateGrowth(current, previous) {
  if (!previous || previous <= 0) return 0;

  return ((current - previous) / previous) * 100;
}