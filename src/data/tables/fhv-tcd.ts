import fhvTcdTableData from "../../assets/tables/table-fhv-tcd.json";

export interface FhvTcdEntry {
  fhv: number;
  tcd: number;
}

export const fhvTcdTable: FhvTcdEntry[] = fhvTcdTableData as FhvTcdEntry[];

export interface InterpolationResult {
  value: number;
  interpolated: boolean;
  lowerBound?: FhvTcdEntry;
  upperBound?: FhvTcdEntry;
}

export function findEntryByFhv(fhv: number): InterpolationResult {
  for (let i = 0; i < fhvTcdTable.length; i++) {
    const entry = fhvTcdTable[i];
    if (Math.abs(fhv - entry.fhv) < 0.0001) {
      return {
        value: entry.fhv,
        interpolated: false,
        lowerBound: entry,
      };
    }
  }

  if (fhv <= fhvTcdTable[0].fhv) {
    return {
      value: fhvTcdTable[0].fhv,
      interpolated: false,
      lowerBound: fhvTcdTable[0],
    };
  }

  if (fhv >= fhvTcdTable[fhvTcdTable.length - 1].fhv) {
    const last = fhvTcdTable[fhvTcdTable.length - 1];
    return {
      value: last.fhv,
      interpolated: false,
      lowerBound: last,
    };
  }

  for (let i = 0; i < fhvTcdTable.length - 1; i++) {
    const current = fhvTcdTable[i];
    const next = fhvTcdTable[i + 1];

    if (fhv > current.fhv && fhv < next.fhv) {
      return {
        value: fhv,
        interpolated: true,
        lowerBound: current,
        upperBound: next,
      };
    }
  }

  const last = fhvTcdTable[fhvTcdTable.length - 1];
  return {
    value: last.fhv,
    interpolated: false,
    lowerBound: last,
  };
}

export function getTcdByFhv(fhv: number): {
  tcd: number;
  interpolated: boolean;
} {
  const result = findEntryByFhv(fhv);

  if (!result.interpolated || !result.upperBound) {
    return {
      tcd: result.lowerBound!.tcd,
      interpolated: false,
    };
  }

  const lower = result.lowerBound!;
  const upper = result.upperBound;
  const ratio = (fhv - lower.fhv) / (upper.fhv - lower.fhv);

  return {
    tcd: lower.tcd + ratio * (upper.tcd - lower.tcd),
    interpolated: true,
  };
}
