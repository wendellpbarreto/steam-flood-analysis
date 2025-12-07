import presetData from "./serigado-iv.json"

export interface PresetMetadata {
  id: string
  name: string
  description: string
  createdAt: string
  isDefault?: boolean
}

export interface CommonData {
  Eb: number
  Tb: number
  Ts: number
  Tr: number
  Ps: number
  K2: number
  rho1C1: number
  rho2C2: number
  tYears: number
  So: number
  Sor: number
  gammaO: number
  phi: number
  zn: number
  zt: number
  fsd: number
  Fsb: number
  Lv: number
  rhoW: number
  CwTs: number
  CwTr: number
  CwTb: number
  fPVRef: number
}

export interface SteamRateCase {
  rateBblPerDay: number
  rateTonsPerDay?: number
}

export function getCaseName(index: number): string {
  return `Caso ${index + 1}`
}

export interface PresetData {
  common: CommonData
  cases: SteamRateCase[]
}

export interface Preset extends PresetMetadata {
  data: PresetData
}

export const serigadoIVPreset = presetData as Preset

