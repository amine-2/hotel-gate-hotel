export function getDateRange(filter) {
  const now = new Date();

  const map = {
    today: 1,
    "7d": 7,
    "30d": 30,
    "3m": 90,
    "6m": 180,
    "1y": 365,
  };

  const days = map[filter] || 7;

  /* CURRENT RANGE */

  const currentStart = new Date();
  currentStart.setDate(now.getDate() - days);

  /* PREVIOUS RANGE */

  const previousEnd = new Date(currentStart);

  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousEnd.getDate() - days);

  return {
    startDate: currentStart.toISOString(),
    endDate: now.toISOString(),

    previousStartDate: previousStart.toISOString(),
    previousEndDate: previousEnd.toISOString(),
  };
}