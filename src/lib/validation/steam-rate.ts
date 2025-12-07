import {
  bblPerDayToMetricTonsPerDay,
  metricTonsPerDayToBblPerDay,
  LBS_PER_BBL_WATER,
  LBS_PER_METRIC_TON,
} from "../constants/conversions";
import type { SteamRateCase } from "../../data/presets";

export interface SteamRateValidation {
  valid: boolean;
  errors: string[];
  calculatedTonsPerDay?: number;
  calculatedBblPerDay?: number;
}

export function validateSteamRate(caseItem: SteamRateCase): SteamRateValidation {
  const errors: string[] = [];

  if (caseItem.rateBblPerDay <= 0) {
    errors.push("Vazão em bbl/d deve ser maior que zero");
  }

  if (caseItem.rateTonsPerDay !== undefined && caseItem.rateTonsPerDay <= 0) {
    errors.push("Vazão em t/d deve ser maior que zero");
  }

  if (caseItem.rateBblPerDay && caseItem.rateTonsPerDay) {
    const calculatedTons = bblPerDayToMetricTonsPerDay(caseItem.rateBblPerDay);
    const difference = Math.abs(calculatedTons - caseItem.rateTonsPerDay);
    const tolerance = 0.5;

    if (difference > tolerance) {
      errors.push(
        `Inconsistência entre bbl/d e t/d: ${caseItem.rateBblPerDay} bbl/d ≈ ${calculatedTons.toFixed(2)} t/d, mas foi informado ${caseItem.rateTonsPerDay} t/d`
      );
    }
  }

  const calculatedTonsPerDay =
    caseItem.rateTonsPerDay === undefined
      ? bblPerDayToMetricTonsPerDay(caseItem.rateBblPerDay)
      : undefined;

  const calculatedBblPerDay =
    caseItem.rateBblPerDay === undefined && caseItem.rateTonsPerDay
      ? metricTonsPerDayToBblPerDay(caseItem.rateTonsPerDay)
      : undefined;

  return {
    valid: errors.length === 0,
    errors,
    calculatedTonsPerDay,
    calculatedBblPerDay,
  };
}

export function syncSteamRateUnits(caseItem: SteamRateCase): SteamRateCase {
  if (caseItem.rateBblPerDay && !caseItem.rateTonsPerDay) {
    return {
      ...caseItem,
      rateTonsPerDay: bblPerDayToMetricTonsPerDay(caseItem.rateBblPerDay),
    };
  }

  if (caseItem.rateTonsPerDay && caseItem.rateBblPerDay) {
    const calculatedBbl = metricTonsPerDayToBblPerDay(caseItem.rateTonsPerDay);
    const difference = Math.abs(calculatedBbl - caseItem.rateBblPerDay);

    if (difference > 0.5) {
      return {
        ...caseItem,
        rateBblPerDay: calculatedBbl,
      };
    }
  }

  return caseItem;
}

export const STEAM_RATE_CONVERSION_INFO = {
  lbsPerBbl: LBS_PER_BBL_WATER,
  lbsPerMetricTon: LBS_PER_METRIC_TON,
  bblPerMetricTon: LBS_PER_METRIC_TON / LBS_PER_BBL_WATER,
  formula: "1 bbl/d = (350 lb/bbl × bbl/d) / 2204.62 lb/t = t/d",
} as const;

