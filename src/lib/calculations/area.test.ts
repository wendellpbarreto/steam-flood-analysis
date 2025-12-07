import { describe, it, expect } from "vitest"
import { calculateAreaHeated } from "./area"
import { validateFieldsForCalculation, getRequiredFieldsForItemA } from "../validation/field-usage"
import type { PresetData, SteamRateCase } from "../../data/presets"
import { serigadoIVPreset } from "../../data/presets"

describe("Cálculo Item A - Área Aquecida", () => {
  const preset = serigadoIVPreset.data
  const testCase: SteamRateCase = {
    rateBblPerDay: 565,
  }

  it("deve usar todos os campos obrigatórios para Item A", () => {
    const requiredFields = getRequiredFieldsForItemA()
    const validation = validateFieldsForCalculation(preset, ["A"])

    expect(validation.valid).toBe(true)
    expect(validation.missingFields).toHaveLength(0)

    requiredFields.forEach((field) => {
      expect(preset.common[field as keyof typeof preset.common]).toBeDefined()
    })
  })

  it("deve calcular área aquecida corretamente", () => {
    const result = calculateAreaHeated(preset, testCase, 0)

    expect(result.areaHeated_ft2).toBeGreaterThan(0)
    expect(result.totalHeat_Btu).toBeGreaterThan(0)
    expect(result.deltaT).toBe(preset.common.Ts - preset.common.Tr)
    expect(result.caseName).toBe("Caso 1")
  })

  it("deve usar todos os campos necessários no cálculo", () => {
    const result = calculateAreaHeated(preset, testCase, 0)

    expect(result.areaHeated_ft2).toBeDefined()
    expect(result.totalHeat_Btu).toBeDefined()
    expect(result.thermalEfficiency).toBeDefined()

    const { common } = preset
    const { rateBblPerDay } = testCase

    expect(common.tYears).toBeDefined()
    expect(common.Ts).toBeDefined()
    expect(common.Tr).toBeDefined()
    expect(common.zn).toBeDefined()
    expect(common.rho1C1).toBeDefined()
    expect(common.CwTs).toBeDefined()
    expect(common.fsd).toBeDefined()
    expect(common.Lv).toBeDefined()
    expect(rateBblPerDay).toBeDefined()
  })

  it("deve validar que campos não usados em Item A não são obrigatórios", () => {
    const fieldsNotUsedInA = ["Eb", "Tb", "So", "Sor", "gammaO", "phi", "Fsb", "rhoW", "CwTr", "CwTb", "fPVRef"]

    fieldsNotUsedInA.forEach((field) => {
      const isRequired = getRequiredFieldsForItemA().includes(field)
      expect(isRequired).toBe(false)
    })
  })

  it("deve calcular entalpia corretamente", () => {
    const result = calculateAreaHeated(preset, testCase, 0)

    expect(result.enthalpySteam_BtuPerLb).toBeGreaterThan(0)
    expect(result.enthalpyReservoirFromTable_BtuPerLb).toBeGreaterThan(0)
    expect(result.Ho_enthalpy_BtuPerLb).toBeCloseTo(
      result.enthalpySteam_BtuPerLb - result.enthalpyReservoirFromTable_BtuPerLb,
      6
    )
  })

  it("deve calcular calor total corretamente", () => {
    const result = calculateAreaHeated(preset, testCase, 0)
    const tDays = preset.common.tYears * 365.0
    const tHours = tDays * 24.0
    const expectedTotalHeat = result.Ho_BtuPerHour * tHours

    expect(result.totalHeat_Btu).toBeCloseTo(expectedTotalHeat, 2)
  })

  it("deve calcular área aquecida usando fórmula correta", () => {
    const result = calculateAreaHeated(preset, testCase, 0)
    const { common } = preset

    const numerator = result.Ho_BtuPerHour * common.rho1C1 * common.zt
    const denominator =
      4 * result.alpha2 * common.rho2C2 * common.rho2C2 * result.deltaT
    const expectedArea = (numerator / denominator) * result.GTd

    expect(result.areaHeated_ft2).toBeCloseTo(expectedArea, 2)
  })

  it("deve calcular itens d–h consistentes", () => {
    const result = calculateAreaHeated(preset, testCase, 0)

    expect(result.lostHeat_Btu + result.storedHeat_Btu).toBeCloseTo(result.totalHeat_Btu, 6)
    expect(result.steamVolumeRequired_bbl).toBeGreaterThan(0)
    expect(result.oilProduced_Np_bbl).toBeGreaterThan(0)
    expect(result.oilSteamRatio_Fos).toBeGreaterThan(0)
    expect(result.equivalentOilSteamRatio_Fose).toBeGreaterThan(0)
    expect(result.energyBalanceIndex).toBeGreaterThanOrEqual(0)
  })
})

describe("Validação de Campos", () => {
  const preset = serigadoIVPreset.data

  it("deve validar que preset Serigado IV tem todos os campos", () => {
    const validation = validateFieldsForCalculation(preset, ["A"])
    expect(validation.valid).toBe(true)
  })

  it("deve identificar campos faltantes", () => {
    const incompletePreset: PresetData = {
      ...preset,
      common: {
        ...preset.common,
        CwTs: undefined as any,
      },
    }

    const validation = validateFieldsForCalculation(incompletePreset, ["A"])
    expect(validation.valid).toBe(false)
    expect(validation.missingFields.length).toBeGreaterThan(0)
  })
})
