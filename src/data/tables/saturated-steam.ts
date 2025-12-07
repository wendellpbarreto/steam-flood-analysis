import saturatedSteamTable from "../../assets/tables/tabela_vapor_saturado.json";

interface RawSteamEntry {
  nota?: string;
  unidades?: Record<string, string>;
  temp_F?: number;
  pressao_psia?: number;
  entalpia?: {
    hf: number;
    hfg: number;
    hg: number;
  };
}

export interface SaturatedSteamEntry {
  temp_F: number;
  pressao_psia: number;
  entalpia: {
    hf: number;
    hfg: number;
    hg: number;
  };
}

const rawData = saturatedSteamTable as RawSteamEntry[];
export const saturatedSteamData: SaturatedSteamEntry[] = rawData
  .filter(
    (entry): entry is SaturatedSteamEntry =>
      entry.temp_F !== undefined &&
      entry.pressao_psia !== undefined &&
      entry.entalpia !== undefined
  )
  .map((entry) => ({
    temp_F: entry.temp_F!,
    pressao_psia: entry.pressao_psia!,
    entalpia: {
      hf: entry.entalpia!.hf,
      hfg: entry.entalpia!.hfg,
      hg: entry.entalpia!.hg,
    },
  }));

export interface InterpolationResult {
  value: number;
  interpolated: boolean;
  lowerBound?: SaturatedSteamEntry;
  upperBound?: SaturatedSteamEntry;
}

export function findEntryByPressure(psia: number): InterpolationResult {
  for (let i = 0; i < saturatedSteamData.length; i++) {
    const entry = saturatedSteamData[i];
    if (Math.abs(psia - entry.pressao_psia) < 0.0001) {
      return {
        value: entry.pressao_psia,
        interpolated: false,
        lowerBound: entry,
      };
    }
  }

  if (psia <= saturatedSteamData[0].pressao_psia) {
    return {
      value: saturatedSteamData[0].pressao_psia,
      interpolated: false,
      lowerBound: saturatedSteamData[0],
    };
  }

  if (psia >= saturatedSteamData[saturatedSteamData.length - 1].pressao_psia) {
    const last = saturatedSteamData[saturatedSteamData.length - 1];
    return {
      value: last.pressao_psia,
      interpolated: false,
      lowerBound: last,
    };
  }

  for (let i = 0; i < saturatedSteamData.length - 1; i++) {
    const current = saturatedSteamData[i];
    const next = saturatedSteamData[i + 1];

    if (psia > current.pressao_psia && psia < next.pressao_psia) {
      return {
        value: psia,
        interpolated: true,
        lowerBound: current,
        upperBound: next,
      };
    }
  }

  const last = saturatedSteamData[saturatedSteamData.length - 1];
  return {
    value: last.pressao_psia,
    interpolated: false,
    lowerBound: last,
  };
}

export function findEntryByTemperature(temp_F: number): InterpolationResult {
  for (let i = 0; i < saturatedSteamData.length; i++) {
    const entry = saturatedSteamData[i];
    if (Math.abs(temp_F - entry.temp_F) < 0.001) {
      return {
        value: entry.temp_F,
        interpolated: false,
        lowerBound: entry,
      };
    }
  }

  if (temp_F <= saturatedSteamData[0].temp_F) {
    return {
      value: saturatedSteamData[0].temp_F,
      interpolated: false,
      lowerBound: saturatedSteamData[0],
    };
  }

  if (temp_F >= saturatedSteamData[saturatedSteamData.length - 1].temp_F) {
    const last = saturatedSteamData[saturatedSteamData.length - 1];
    return {
      value: last.temp_F,
      interpolated: false,
      lowerBound: last,
    };
  }

  for (let i = 0; i < saturatedSteamData.length - 1; i++) {
    const current = saturatedSteamData[i];
    const next = saturatedSteamData[i + 1];

    if (temp_F > current.temp_F && temp_F < next.temp_F) {
      return {
        value: temp_F,
        interpolated: true,
        lowerBound: current,
        upperBound: next,
      };
    }
  }

  const last = saturatedSteamData[saturatedSteamData.length - 1];
  return {
    value: last.temp_F,
    interpolated: false,
    lowerBound: last,
  };
}

export function getEnthalpyByPressure(psia: number): {
  hf: number;
  hfg: number;
  hg: number;
  interpolated: boolean;
} {
  const result = findEntryByPressure(psia);

  if (!result.interpolated || !result.upperBound) {
    return {
      hf: result.lowerBound!.entalpia.hf,
      hfg: result.lowerBound!.entalpia.hfg,
      hg: result.lowerBound!.entalpia.hg,
      interpolated: false,
    };
  }

  const lower = result.lowerBound!;
  const upper = result.upperBound;
  const ratio =
    (psia - lower.pressao_psia) / (upper.pressao_psia - lower.pressao_psia);

  return {
    hf: lower.entalpia.hf + ratio * (upper.entalpia.hf - lower.entalpia.hf),
    hfg: lower.entalpia.hfg + ratio * (upper.entalpia.hfg - lower.entalpia.hfg),
    hg: lower.entalpia.hg + ratio * (upper.entalpia.hg - lower.entalpia.hg),
    interpolated: true,
  };
}

export function getEnthalpyByTemperature(temp_F: number): {
  hf: number;
  hfg: number;
  hg: number;
  interpolated: boolean;
} {
  const result = findEntryByTemperature(temp_F);

  if (!result.interpolated || !result.upperBound) {
    return {
      hf: result.lowerBound!.entalpia.hf,
      hfg: result.lowerBound!.entalpia.hfg,
      hg: result.lowerBound!.entalpia.hg,
      interpolated: false,
    };
  }

  const lower = result.lowerBound!;
  const upper = result.upperBound;
  const ratio = (temp_F - lower.temp_F) / (upper.temp_F - lower.temp_F);

  return {
    hf: lower.entalpia.hf + ratio * (upper.entalpia.hf - lower.entalpia.hf),
    hfg: lower.entalpia.hfg + ratio * (upper.entalpia.hfg - lower.entalpia.hfg),
    hg: lower.entalpia.hg + ratio * (upper.entalpia.hg - lower.entalpia.hg),
    interpolated: true,
  };
}

export function calculateSteamEnthalpy(
  fs: number,
  HL: number,
  Hv: number
): number {
  return (1 - fs) * HL + fs * Hv;
}

export function interpolateEnthalpy(
  temperature_F: number,
  quality: number = 1.0
): number {
  const { hf, hfg } = getEnthalpyByTemperature(temperature_F);
  return hf + quality * hfg;
}

export function getEnthalpyAtTemperature(
  temperature_F: number,
  quality: number = 1.0
): number {
  return interpolateEnthalpy(temperature_F, quality);
}
