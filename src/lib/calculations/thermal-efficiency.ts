import type { CommonData } from "../../data/presets";

export interface ThermalEfficiencyResult {
  thermalEfficiency: number;
  GTd: number;
  alpha2: number;
  tDimensionless: number;
}

import { calculateGTd } from "./math-utils";

/**
 * Calcula a eficiência térmica usando a fórmula de Myhill & Stegemeier:
 * E_t = G(t_d) / t_d
 *
 * Se GTd já foi calculado (por exemplo, no Item A), pode ser passado como parâmetro
 * para evitar recálculo.
 */
export function calculateThermalEfficiency(
  common: CommonData,
  GTd?: number,
  tDimensionless?: number
): ThermalEfficiencyResult {
  const tDays = common.tYears * 365.0;
  const tHours = tDays * 24.0;
  const alpha2 = common.K2 / common.rho2C2;

  // Reaproveitar cálculos se fornecidos, senão calcular
  const tDim = tDimensionless ?? calculateTDimensionless(common, alpha2, tHours);
  const GTdValue = GTd ?? calculateGTd(tDim);

  // Fórmula correta: E_t = G(t_d) / t_d
  const thermalEfficiency = GTdValue / tDim;

  return {
    thermalEfficiency,
    GTd: GTdValue,
    alpha2,
    tDimensionless: tDim,
  };
}

export function calculateTDimensionless(
  common: CommonData,
  alpha2: number,
  tHours: number
): number {
  const M1 = common.rho1C1;
  const M2 = common.rho2C2;
  // Usar espessura total (zt) ao invés de espessura líquida (zn)
  const h = common.zt;
  const hSquared = h * h;

  const tDimensionless = 4 * Math.pow(M2 / M1, 2) * (alpha2 / hSquared) * tHours;

  return tDimensionless;
}


