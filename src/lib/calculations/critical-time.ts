import type { CommonData } from "../../data/presets";
import { getTcdByFhv } from "../../data/tables/fhv-tcd";
import {
  getEnthalpyByPressure,
  calculateSteamEnthalpy,
  getEnthalpyByTemperature,
} from "../../data/tables/saturated-steam";

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
  const hRes = getEnthalpyByTemperature(common.Tr).hf;
  const HsEffective = Hs - hRes;

  const G1_value = HsEffective > 0 ? 1 - (fs * common.Lv) / HsEffective : 0;

  // FHV conforme planilha: fhv = fsd * (Hg - Hl) / (H_s,eff)
  const fhvDirect =
    HsEffective > 0 ? (fs * (Hv - HL)) / HsEffective : 0;

  const tcdResult = getTcdByFhv(fhvDirect);
  const tcd_from_table = tcdResult.tcd;

  // Tempo crítico usando definição t_d = t_cd e t_d = 4 (M2/M1)^2 (alpha2/h^2) * t
  const M1 = common.rho1C1;
  const M2 = common.rho2C2;
  const h = common.zn; // usa espessura líquida para tempo crítico
  const factor = 4 * Math.pow(M2 / M1, 2) * (alpha2 / (h * h));
  const tCriticalHours = factor > 0 ? tcd_from_table / factor : 0;
  const tCriticalDays = tCriticalHours / 24.0;
  const tCriticalYears = tCriticalDays / 365.0;

  return {
    criticalTime_years: tCriticalYears,
    criticalTime_days: tCriticalDays,
    criticalTime_hours: tCriticalHours,
    G1_value,
    tcd_calculated: tcd_from_table,
    tcd_from_table,
    fhv: fhvDirect,
    alpha2,
    interpolationUsed: tcdResult.interpolated,
  };
}
