import type { CommonData } from "../../data/presets";
import { getTcdByFhv } from "../../data/tables/fhv-tcd";
import {
  getEnthalpyByPressure,
  calculateSteamEnthalpy,
} from "../../data/tables/saturated-steam";
import { calculateG1 } from "./math-utils";

export interface CriticalTimeResult {
  criticalTime_years: number;
  criticalTime_days: number;
  criticalTime_hours: number;
  G1_value: number;
  tcd_calculated: number;
  tcd_from_table: number;
  fhv: number;
  alpha2: number;
  interpolationUsed: boolean;
}

export function calculateCriticalTime(common: CommonData): CriticalTimeResult {
  const alpha2 = common.K2 / common.rho2C2;

  const enthalpyByPressure = getEnthalpyByPressure(common.Ps);
  const HL = enthalpyByPressure.hf;
  const Hv = enthalpyByPressure.hg;
  const fs = common.fsd;
  const Hs = calculateSteamEnthalpy(fs, HL, Hv);

  const G1_value = 1 - (fs * common.Lv) / Hs;

  const tcd_calculated = findTcdByG1(G1_value);

  const fhv = calculateFhvFromTcd(tcd_calculated);
  const tcdResult = getTcdByFhv(fhv);
  const tcd_from_table = tcdResult.tcd;

  const znSquared = common.zn * common.zn;
  const tCriticalSeconds = (tcd_from_table * znSquared) / alpha2;
  const tCriticalHours = tCriticalSeconds / 3600.0;
  const tCriticalDays = tCriticalHours / 24.0;
  const tCriticalYears = tCriticalDays / 365.0;

  return {
    criticalTime_years: tCriticalYears,
    criticalTime_days: tCriticalDays,
    criticalTime_hours: tCriticalHours,
    G1_value,
    tcd_calculated,
    tcd_from_table,
    fhv,
    alpha2,
    interpolationUsed: tcdResult.interpolated,
  };
}

function calculateFhvFromTcd(tcd: number): number {
  const sqrtTcd = Math.sqrt(tcd);
  return sqrtTcd / (1 + sqrtTcd);
}

function findTcdByG1(G1_value: number): number {
  if (G1_value <= 0) {
    return 0;
  }

  if (G1_value >= 1) {
    return 100;
  }

  let lower = 0;
  let upper = 100;
  const tolerance = 1e-6;
  const maxIterations = 100;

  for (let i = 0; i < maxIterations; i++) {
    const tcd = (lower + upper) / 2;
    const G1_calculated = calculateG1(tcd);
    const diff = G1_calculated - G1_value;

    if (Math.abs(diff) < tolerance) {
      return tcd;
    }

    if (diff > 0) {
      upper = tcd;
    } else {
      lower = tcd;
    }
  }

  return (lower + upper) / 2;
}
