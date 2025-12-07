import type { PresetData } from "../../data/presets";
import { validateAllModelFields } from "./field-usage";

export interface ModelCompleteness {
  allFieldsPresent: boolean;
  missingFields: string[];
  fieldsForItemA: string[];
  fieldsForOtherItems: string[];
  totalFields: number;
  presentFields: number;
}

export function checkModelCompleteness(data: PresetData): ModelCompleteness {
  const validation = validateAllModelFields(data);

  const allModelFields = [
    "Eb",
    "Tb",
    "Ts",
    "Tr",
    "Ps",
    "K2",
    "rho1C1",
    "rho2C2",
    "tYears",
    "So",
    "Sor",
    "gammaO",
    "phi",
    "zn",
    "zt",
    "fsd",
    "Fsb",
    "Lv",
    "rhoW",
    "CwTs",
    "CwTr",
    "CwTb",
    "fPVRef",
  ];

  const fieldsForItemA = [
    "tYears",
    "Ts",
    "Tr",
    "zn",
    "rho1C1",
    "CwTs",
    "fsd",
    "Lv",
    "K2",
    "rho2C2",
  ];

  const fieldsForOtherItems = allModelFields.filter(
    (field) =>
      !fieldsForItemA.includes(field) &&
      field !== "Ps" &&
      field !== "K2" &&
      field !== "rho2C2" &&
      field !== "zt"
  );

  const presentFields = allModelFields.filter((field) => {
    const value = data.common[field as keyof typeof data.common];
    return value !== undefined && value !== null;
  }).length;

  return {
    allFieldsPresent: validation.valid,
    missingFields: validation.missingFields,
    fieldsForItemA,
    fieldsForOtherItems,
    totalFields: allModelFields.length,
    presentFields,
  };
}
