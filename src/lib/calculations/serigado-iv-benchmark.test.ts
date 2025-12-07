import { describe, it, expect } from "vitest"
import { calculateAreaHeated } from "./area"
import { serigadoIVPreset } from "../../data/presets"
import type { SteamRateCase } from "../../data/presets"

const TOLERANCE = 2e-3

function relativeError(calculated: number, expected: number): number {
  if (expected === 0) {
    return Math.abs(calculated - expected)
  }
  return Math.abs((calculated - expected) / expected)
}

function expectWithinTolerance(
  calculated: number,
  expected: number,
  tolerance: number = TOLERANCE
) {
  const error = relativeError(calculated, expected)
  expect(error).toBeLessThan(tolerance)
}

const benchmarkValues = {
  case565: {
    areaHeated_As_ft2: 91807.1288,
    criticalTime_days: 2266.1,
    criticalTime_hours: 54387.0,
    thermalEfficiency: 0.6731288,
  },
  case755: {
    areaHeated_As_ft2: 122680.3225,
    criticalTime_days: 2266.1,
    criticalTime_hours: 54387.0,
    thermalEfficiency: 0.6731288,
  },
}

describe("Serigado IV - Benchmark de Valores de Referência", () => {
  const preset = serigadoIVPreset.data

  describe("Caso 565 bbl/d", () => {
    const testCase: SteamRateCase = {
      rateBblPerDay: 565,
    }
    const expected = benchmarkValues.case565

    it("deve calcular área aquecida dentro da tolerância", () => {
      const result = calculateAreaHeated(preset, testCase, 0)

      expectWithinTolerance(
        result.areaHeated_ft2,
        expected.areaHeated_As_ft2
      )

      console.log(
        `Área aquecida calculada: ${result.areaHeated_ft2}, esperada: ${expected.areaHeated_As_ft2}, erro: ${(
          relativeError(result.areaHeated_ft2, expected.areaHeated_As_ft2) * 100
        ).toFixed(4)}%`
      )
    })

    it("deve calcular tempo crítico em dias dentro da tolerância", () => {
      const result = calculateAreaHeated(preset, testCase, 0)
      const criticalTime_days = result.criticalTime.criticalTime_years * 365

      expectWithinTolerance(criticalTime_days, expected.criticalTime_days)

      console.log(
        `Tempo crítico (dias) calculado: ${criticalTime_days}, esperado: ${expected.criticalTime_days}, erro: ${(
          relativeError(criticalTime_days, expected.criticalTime_days) * 100
        ).toFixed(4)}%`
      )
    })

    it("deve calcular tempo crítico em horas dentro da tolerância", () => {
      const result = calculateAreaHeated(preset, testCase, 0)
      const criticalTime_hours = result.criticalTime.criticalTime_years * 365 * 24

      expectWithinTolerance(criticalTime_hours, expected.criticalTime_hours)

      console.log(
        `Tempo crítico (horas) calculado: ${criticalTime_hours}, esperado: ${expected.criticalTime_hours}, erro: ${(
          relativeError(criticalTime_hours, expected.criticalTime_hours) * 100
        ).toFixed(4)}%`
      )
    })

    it("deve calcular eficiência térmica dentro da tolerância", () => {
      const result = calculateAreaHeated(preset, testCase, 0)

      expectWithinTolerance(
        result.thermalEfficiency,
        expected.thermalEfficiency
      )

      console.log(
        `Eficiência térmica calculada: ${result.thermalEfficiency}, esperada: ${expected.thermalEfficiency}, erro: ${(
          relativeError(result.thermalEfficiency, expected.thermalEfficiency) *
          100
        ).toFixed(4)}%`
      )
    })
  })

  describe("Caso 755 bbl/d", () => {
    const testCase: SteamRateCase = {
      rateBblPerDay: 755,
    }
    const expected = benchmarkValues.case755

    it("deve calcular área aquecida dentro da tolerância", () => {
      const result = calculateAreaHeated(preset, testCase, 1)

      expectWithinTolerance(
        result.areaHeated_ft2,
        expected.areaHeated_As_ft2
      )

      console.log(
        `Área aquecida calculada: ${result.areaHeated_ft2}, esperada: ${expected.areaHeated_As_ft2}, erro: ${(
          relativeError(result.areaHeated_ft2, expected.areaHeated_As_ft2) * 100
        ).toFixed(4)}%`
      )
    })

    it("deve calcular tempo crítico em dias dentro da tolerância", () => {
      const result = calculateAreaHeated(preset, testCase, 1)
      const criticalTime_days = result.criticalTime.criticalTime_years * 365

      expectWithinTolerance(criticalTime_days, expected.criticalTime_days)

      console.log(
        `Tempo crítico (dias) calculado: ${criticalTime_days}, esperado: ${expected.criticalTime_days}, erro: ${(
          relativeError(criticalTime_days, expected.criticalTime_days) * 100
        ).toFixed(4)}%`
      )
    })

    it("deve calcular tempo crítico em horas dentro da tolerância", () => {
      const result = calculateAreaHeated(preset, testCase, 1)
      const criticalTime_hours = result.criticalTime.criticalTime_years * 365 * 24

      expectWithinTolerance(criticalTime_hours, expected.criticalTime_hours)

      console.log(
        `Tempo crítico (horas) calculado: ${criticalTime_hours}, esperado: ${expected.criticalTime_hours}, erro: ${(
          relativeError(criticalTime_hours, expected.criticalTime_hours) * 100
        ).toFixed(4)}%`
      )
    })

    it("deve calcular eficiência térmica dentro da tolerância", () => {
      const result = calculateAreaHeated(preset, testCase, 1)

      expectWithinTolerance(
        result.thermalEfficiency,
        expected.thermalEfficiency
      )

      console.log(
        `Eficiência térmica calculada: ${result.thermalEfficiency}, esperada: ${expected.thermalEfficiency}, erro: ${(
          relativeError(result.thermalEfficiency, expected.thermalEfficiency) *
          100
        ).toFixed(4)}%`
      )
    })
  })

  describe("Validação de Valores Independentes de Vazão", () => {
    it("tempo crítico deve ser o mesmo para ambos os casos", () => {
      const result565 = calculateAreaHeated(
        preset,
        { rateBblPerDay: 565 },
        0
      )
      const result755 = calculateAreaHeated(
        preset,
        { rateBblPerDay: 755 },
        1
      )

      expect(result565.criticalTime.criticalTime_years).toBeCloseTo(
        result755.criticalTime.criticalTime_years,
        10
      )
    })

    it("eficiência térmica deve ser a mesma para ambos os casos", () => {
      const result565 = calculateAreaHeated(
        preset,
        { rateBblPerDay: 565 },
        0
      )
      const result755 = calculateAreaHeated(
        preset,
        { rateBblPerDay: 755 },
        1
      )

      expect(result565.thermalEfficiency).toBeCloseTo(
        result755.thermalEfficiency,
        10
      )
    })
  })
})
