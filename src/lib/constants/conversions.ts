export const LBS_PER_BBL_WATER = 350.0;

export const LBS_PER_METRIC_TON = 2204.62;
export const LBS_PER_SHORT_TON = 2000.0;

export const BBL_PER_METRIC_TON = LBS_PER_METRIC_TON / LBS_PER_BBL_WATER;
export const BBL_PER_SHORT_TON = LBS_PER_SHORT_TON / LBS_PER_BBL_WATER;

export function bblPerDayToMetricTonsPerDay(bblPerDay: number): number {
  return (bblPerDay * LBS_PER_BBL_WATER) / LBS_PER_METRIC_TON;
}

export function bblPerDayToShortTonsPerDay(bblPerDay: number): number {
  return (bblPerDay * LBS_PER_BBL_WATER) / LBS_PER_SHORT_TON;
}

export function metricTonsPerDayToBblPerDay(tonsPerDay: number): number {
  return (tonsPerDay * LBS_PER_METRIC_TON) / LBS_PER_BBL_WATER;
}

export function shortTonsPerDayToBblPerDay(tonsPerDay: number): number {
  return (tonsPerDay * LBS_PER_SHORT_TON) / LBS_PER_BBL_WATER;
}

export function validateBblToTonsConversion(
  bblPerDay: number,
  tonsPerDay: number,
  tolerance: number = 0.1
): boolean {
  const calculatedTons = bblPerDayToMetricTonsPerDay(bblPerDay);
  return Math.abs(calculatedTons - tonsPerDay) <= tolerance;
}

