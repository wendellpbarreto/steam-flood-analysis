import type { PresetData, SteamRateCase } from "../../data/presets";
import { getCaseName } from "../../data/presets";
import { calculateTDimensionless } from "./thermal-efficiency";
import {
  calculateCriticalTime,
  type CriticalTimeResult,
} from "./critical-time";
import {
  getEnthalpyByPressure,
  getEnthalpyByTemperature,
  calculateSteamEnthalpy,
} from "../../data/tables/saturated-steam";
import { calculateGTd } from "./math-utils";

export interface AreaCalculationResult {
  caseName: string;
  rateBblPerDay: number;
  rateTonsPerDay?: number;
  areaHeated_ft2: number;
  totalHeat_Btu: number;
  storedHeat_Btu: number;
  enthalpyReservoir_BtuPerLb: number;
  deltaT: number;
  massRate_lbPerDay: number;
  massRate_lbPerHour: number;
  heatRate_BtuPerHour: number;
  thermalEfficiency: number;
  GTd: number;
  alpha2: number;
  tDimensionless: number;
  criticalTime: CriticalTimeResult;
  Ho_BtuPerHour: number;
  enthalpySteam_BtuPerLb: number;
  enthalpyReservoirFromTable_BtuPerLb: number;
  HL_BtuPerLb: number;
  Hv_BtuPerLb: number;
  Ho_enthalpy_BtuPerLb: number;
  interpolationUsed: {
    pressure: boolean;
    temperature: boolean;
  };
  lostHeat_Btu: number;
  steamVolumeRequired_ft3: number;
  steamVolumeRequired_bbl: number;
  oilProduced_Np_bbl: number;
  oilSteamRatio_Fos: number;
  equivalentOilSteamRatio_Fose: number;
  oilEnergy_Btu: number;
  boilerEnergy_Btu: number;
  energyBalanceIndex: number;
}

export function calculateAreaHeated(
  presetData: PresetData,
  steamCase: SteamRateCase,
  caseIndex: number = 0
): AreaCalculationResult {
  const { common } = presetData;
  const { rateBblPerDay } = steamCase;

  const criticalTimeResult = calculateCriticalTime(common);

  const requiredFieldsForItemA = {
    tYears: common.tYears,
    Ts: common.Ts,
    Tr: common.Tr,
    zt: common.zt, // Usar espessura total ao invés de zn
    rho1C1: common.rho1C1,
    Ps: common.Ps,
    fsd: common.fsd,
    K2: common.K2,
    rho2C2: common.rho2C2,
  };

  Object.entries(requiredFieldsForItemA).forEach(([field, value]) => {
    if (value === undefined || value === null) {
      throw new Error(
        `Campo obrigatório para Item A '${field}' não está definido`
      );
    }
  });

  const tDays = common.tYears * 365.0;
  const tHours = tDays * 24.0;
  const deltaT = common.Ts - common.Tr;

  const enthalpyByPressure = getEnthalpyByPressure(common.Ps);
  const HL = enthalpyByPressure.hf;
  const Hv = enthalpyByPressure.hg;

  const fs = common.fsd;
  const enthalpySteam = calculateSteamEnthalpy(fs, HL, Hv);

  const enthalpyReservoirFromTable = getEnthalpyByTemperature(common.Tr);
  const hres = enthalpyReservoirFromTable.hf;

  const Ho_enthalpy = enthalpySteam - hres;

  const massRate_lbPerDay = rateBblPerDay * 350.0;
  const massRate_lbPerHour = massRate_lbPerDay / 24.0;
  const Ho_BtuPerHour = massRate_lbPerHour * Ho_enthalpy;

  const alpha2 = common.K2 / common.rho2C2;
  const M1 = common.rho1C1;
  const M2 = common.rho2C2;
  // Usar espessura total (zt) ao invés de espessura líquida (zn)
  const h = common.zt;

  const tDimensionless = calculateTDimensionless(common, alpha2, tHours);
  const GTd = calculateGTd(tDimensionless);

  // Calcular eficiência térmica correta: E_t = G(t_d) / t_d
  const thermalEfficiencyCorrected = GTd / tDimensionless;

  const numerator = Ho_BtuPerHour * M1 * h;
  const denominator = 4 * alpha2 * M2 * M2 * deltaT;
  const areaHeated_ft2 = (numerator / denominator) * GTd;

  const totalHeat_Btu = Ho_BtuPerHour * tHours;
  const storedHeat_Btu = thermalEfficiencyCorrected * totalHeat_Btu;
  const lostHeat_Btu = totalHeat_Btu - storedHeat_Btu;

  // Volume de vapor necessário (V1) em ft³ e bbl
  const steamEnthalpyDelta_BtuPerLb =
    (common.CwTs - common.CwTr) + common.fsd * common.Lv;
  const steamVolumeRequired_ft3 =
    thermalEfficiencyCorrected > 0 && steamEnthalpyDelta_BtuPerLb > 0
      ? (M1 * areaHeated_ft2 * common.zt * deltaT) /
        (common.rhoW * steamEnthalpyDelta_BtuPerLb * thermalEfficiencyCorrected)
      : 0;
  const steamVolumeRequired_bbl = steamVolumeRequired_ft3 / 5.615;

  // Volume de óleo produzido (Np) e razões óleo/vapor
  const deltaS = common.So - common.Sor;
  const oilProduced_Np_bbl =
    (areaHeated_ft2 * common.zn * common.phi * deltaS) / 5.615;

  const oilSteamRatio_Fos =
    steamVolumeRequired_bbl > 0 ? oilProduced_Np_bbl / steamVolumeRequired_bbl : 0;

  const boilerWaterEnthalpyDelta_BtuPerLb =
    (common.CwTs - common.CwTb) + common.Fsb * common.Lv;
  const equivalentOilSteamRatio_Fose =
    boilerWaterEnthalpyDelta_BtuPerLb > 0
      ? (1000 / boilerWaterEnthalpyDelta_BtuPerLb) * oilSteamRatio_Fos
      : 0;

  // Balanço de energia
  const oilEnthalpyPerBbl_Btu = 13.1 + 5600 * common.gammaO;
  const oilEnergy_Btu = oilProduced_Np_bbl * oilEnthalpyPerBbl_Btu;
  const boilerEnergy_Btu = common.Eb > 0 ? totalHeat_Btu / common.Eb : 0;
  const energyBalanceIndex =
    boilerEnergy_Btu > 0 ? oilEnergy_Btu / boilerEnergy_Btu : 0;

  return {
    caseName: getCaseName(caseIndex),
    rateBblPerDay,
    rateTonsPerDay: steamCase.rateTonsPerDay,
    areaHeated_ft2,
    totalHeat_Btu,
    storedHeat_Btu,
    enthalpyReservoir_BtuPerLb: Ho_enthalpy,
    deltaT,
    massRate_lbPerDay,
    massRate_lbPerHour,
    heatRate_BtuPerHour: Ho_BtuPerHour,
    thermalEfficiency: thermalEfficiencyCorrected,
    GTd,
    alpha2,
    tDimensionless,
    criticalTime: criticalTimeResult,
    Ho_BtuPerHour,
    enthalpySteam_BtuPerLb: enthalpySteam,
    enthalpyReservoirFromTable_BtuPerLb: hres,
    HL_BtuPerLb: HL,
    Hv_BtuPerLb: Hv,
    Ho_enthalpy_BtuPerLb: Ho_enthalpy,
    interpolationUsed: {
      pressure: enthalpyByPressure.interpolated,
      temperature: enthalpyReservoirFromTable.interpolated,
    },
    lostHeat_Btu,
    steamVolumeRequired_ft3,
    steamVolumeRequired_bbl,
    oilProduced_Np_bbl,
    oilSteamRatio_Fos,
    equivalentOilSteamRatio_Fose,
    oilEnergy_Btu,
    boilerEnergy_Btu,
    energyBalanceIndex,
  };
}

export function calculateAllCases(
  presetData: PresetData
): AreaCalculationResult[] {
  if (!presetData.cases || presetData.cases.length === 0) {
    throw new Error("Pelo menos um caso de vazão deve ser definido");
  }

  return presetData.cases.map((steamCase, index) =>
    calculateAreaHeated(presetData, steamCase, index)
  );
}
